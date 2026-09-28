import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =====================================================
   HELPERS
===================================================== */

function getFileExtension(file: File) {
  if (file.type === "image/jpeg") {
    return "jpg";
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "";
}

function parseMenuDate(value: string) {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/* =====================================================
   GET DAILY MENUS
===================================================== */

export async function GET(request: NextRequest) {
  try {
    /* =====================================================
       AUTH
    ===================================================== */

    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    /* =====================================================
       OPTIONAL DATE FILTER
    ===================================================== */

    const searchParams = request.nextUrl.searchParams;

    const menuDateParam =
      searchParams.get("date")?.trim() ?? "";

    /* =====================================================
       GET ONE MENU BY DATE
    ===================================================== */

    if (menuDateParam) {
      const menuDate = parseMenuDate(menuDateParam);

      if (!menuDate) {
        return NextResponse.json(
          {
            message: "Invalid menu date.",
          },
          {
            status: 400,
          },
        );
      }

      const menu = await prisma.dailyMenu.findUnique({
        where: {
          menuDate,
        },

        select: {
          id: true,
          menuDate: true,
          fileName: true,
          title: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(
        {
          menu,
        },
        {
          status: 200,
        },
      );
    }

    /* =====================================================
       GET RECENT MENUS
    ===================================================== */

    const menus = await prisma.dailyMenu.findMany({
      select: {
        id: true,
        menuDate: true,
        fileName: true,
        title: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        menuDate: "desc",
      },

      take: 30,
    });

    return NextResponse.json(
      {
        menus,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Daily menu loading error:", error);

    return NextResponse.json(
      {
        message: "Unable to load daily menus.",
      },
      {
        status: 500,
      },
    );
  }
}

/* =====================================================
   CREATE / REPLACE DAILY MENU
===================================================== */

export async function POST(request: NextRequest) {
  let newFilePath: string | null = null;

  try {
    /* =====================================================
       AUTH
    ===================================================== */

    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    /* =====================================================
       READ FORM DATA
    ===================================================== */

    const formData = await request.formData();

    const menuDateValue = String(
      formData.get("menuDate") ?? "",
    ).trim();

    const titleValue = String(
      formData.get("title") ?? "",
    ).trim();

    const uploadedFile = formData.get("file");

    /* =====================================================
       VALIDATE MENU DATE
    ===================================================== */

    if (!menuDateValue) {
      return NextResponse.json(
        {
          message: "Menu date is required.",
        },
        {
          status: 400,
        },
      );
    }

    const menuDate = parseMenuDate(menuDateValue);

    if (!menuDate) {
      return NextResponse.json(
        {
          message: "Invalid menu date.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       VALIDATE IMAGE
    ===================================================== */

    if (!uploadedFile || !(uploadedFile instanceof File)) {
      return NextResponse.json(
        {
          message: "Menu image is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(uploadedFile.type)) {
      return NextResponse.json(
        {
          message:
            "Only JPG, PNG and WebP images are allowed.",
        },
        {
          status: 400,
        },
      );
    }

    if (uploadedFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message:
            "Menu image must be 5 MB or smaller.",
        },
        {
          status: 400,
        },
      );
    }

    const extension = getFileExtension(uploadedFile);

    if (!extension) {
      return NextResponse.json(
        {
          message: "Unsupported image format.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       CHECK EXISTING MENU
    ===================================================== */

    const existingMenu =
      await prisma.dailyMenu.findUnique({
        where: {
          menuDate,
        },

        select: {
          id: true,
          fileName: true,
          filePath: true,
        },
      });

    /* =====================================================
       BUILD STORAGE PATH
       uploads/daily-menu/YYYY/MM/DD/
    ===================================================== */

    const year = String(menuDate.getUTCFullYear());

    const month = String(
      menuDate.getUTCMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      menuDate.getUTCDate(),
    ).padStart(2, "0");

    const relativeFolder = path.join(
      "daily-menu",
      year,
      month,
      day,
    );

    const uploadFolder = path.join(
      process.cwd(),
      "uploads",
      relativeFolder,
    );

    await fs.mkdir(uploadFolder, {
      recursive: true,
    });

    /* =====================================================
       SAVE NEW FILE
    ===================================================== */

    const fileName =
      `menu-${Date.now()}.${extension}`;

    const absoluteFilePath = path.join(
      uploadFolder,
      fileName,
    );

    const buffer = Buffer.from(
      await uploadedFile.arrayBuffer(),
    );

    await fs.writeFile(
      absoluteFilePath,
      buffer,
    );

    newFilePath = absoluteFilePath;

    const relativeFilePath = path.join(
      "uploads",
      relativeFolder,
      fileName,
    );

    /* =====================================================
       CREATE OR UPDATE DATABASE RECORD
    ===================================================== */

    const savedMenu =
      await prisma.dailyMenu.upsert({
        where: {
          menuDate,
        },

        create: {
          menuDate,

          fileName,

          filePath: relativeFilePath,

          title:
            titleValue || "Today's Menu",

          isActive: true,
        },

        update: {
          fileName,

          filePath: relativeFilePath,

          title:
            titleValue || "Today's Menu",

          isActive: true,
        },

        select: {
          id: true,

          menuDate: true,

          fileName: true,

          title: true,

          isActive: true,

          createdAt: true,

          updatedAt: true,
        },
      });

    /* =====================================================
       DELETE PREVIOUS IMAGE
       ONLY AFTER DATABASE SAVE SUCCEEDS
    ===================================================== */

    if (
      existingMenu?.filePath &&
      existingMenu.filePath !== relativeFilePath
    ) {
      try {
        const uploadsRoot = path.resolve(
          process.cwd(),
          "uploads",
        );

        const storedPath =
          existingMenu.filePath.replace(
            /^uploads[\\/]/,
            "",
          );

        const oldAbsolutePath = path.resolve(
          uploadsRoot,
          storedPath,
        );

        const relativeCheck = path.relative(
          uploadsRoot,
          oldAbsolutePath,
        );

        if (
          !relativeCheck.startsWith("..") &&
          !path.isAbsolute(relativeCheck)
        ) {
          await fs.unlink(oldAbsolutePath);
        }
      } catch (error) {
        console.warn(
          "Old daily menu cleanup warning:",
          error,
        );
      }
    }

    /* =====================================================
       SAFE RESPONSE
       filePath is intentionally NOT returned
    ===================================================== */

    return NextResponse.json(
      {
        message: existingMenu
          ? "Daily menu replaced successfully."
          : "Daily menu uploaded successfully.",

        menu: savedMenu,
      },
      {
        status: existingMenu ? 200 : 201,
      },
    );
  } catch (error) {
    console.error(
      "Daily menu upload error:",
      error,
    );

    /* =====================================================
       ROLLBACK NEW PHYSICAL FILE
       IF DATABASE SAVE FAILS
    ===================================================== */

    if (newFilePath) {
      try {
        await fs.unlink(newFilePath);
      } catch (cleanupError) {
        console.warn(
          "Daily menu rollback cleanup warning:",
          cleanupError,
        );
      }
    }

    return NextResponse.json(
      {
        message: "Unable to upload daily menu.",
      },
      {
        status: 500,
      },
    );
  }
}