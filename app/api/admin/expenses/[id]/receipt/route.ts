import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

function getMimeType(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".webp") {
    return "image/webp";
  }

  return "application/octet-stream";
}
export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
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
       EXPENSE ID
    ===================================================== */

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Expense ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       GET RECEIPT DETAILS
    ===================================================== */

    const expense = await prisma.expense.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        receiptFileName: true,
        receiptFilePath: true,
      },
    });

    if (!expense) {
      return NextResponse.json(
        {
          message: "Expense not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!expense.receiptFileName || !expense.receiptFilePath) {
      return NextResponse.json(
        {
          message: "Receipt not available.",
        },
        {
          status: 404,
        },
      );
    }

    /* =====================================================
       SAFE FILE PATH
    ===================================================== */

    const uploadsRoot = path.resolve(process.cwd(), "uploads");

    const storedPath = expense.receiptFilePath.replace(/^uploads[\\/]/, "");

    const absoluteFilePath = path.resolve(uploadsRoot, storedPath);

    const relativeCheck = path.relative(uploadsRoot, absoluteFilePath);

    if (relativeCheck.startsWith("..") || path.isAbsolute(relativeCheck)) {
      return NextResponse.json(
        {
          message: "Invalid receipt path.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       READ RECEIPT
    ===================================================== */

    let fileBuffer: Buffer;

    try {
      fileBuffer = await fs.readFile(absoluteFilePath);
    } catch {
      return NextResponse.json(
        {
          message: "Receipt file not found.",
        },
        {
          status: 404,
        },
      );
    }

    const mimeType = getMimeType(expense.receiptFileName);

    /* =====================================================
       RETURN IMAGE
    ===================================================== */

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,

      headers: {
        "Content-Type": mimeType,

        "Content-Disposition": `inline; filename="${expense.receiptFileName}"`,

        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Expense receipt preview error:", error);

    return NextResponse.json(
      {
        message: "Unable to load receipt.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
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
       EXPENSE ID
    ===================================================== */

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Expense ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       CHECK EXPENSE
    ===================================================== */

    const expense = await prisma.expense.findUnique({
      where: {
        id,
      },

      select: {
        id: true,

        expenseDate: true,

        receiptFileName: true,

        receiptFilePath: true,
      },
    });

    if (!expense) {
      return NextResponse.json(
        {
          message: "Expense not found.",
        },
        {
          status: 404,
        },
      );
    }

    /* =====================================================
       READ FORM DATA
    ===================================================== */

    const formData = await request.formData();

    const uploadedFile = formData.get("file");

    if (!uploadedFile || !(uploadedFile instanceof File)) {
      return NextResponse.json(
        {
          message: "Receipt image is required.",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       FILE VALIDATION
    ===================================================== */

    if (!ALLOWED_MIME_TYPES.includes(uploadedFile.type)) {
      return NextResponse.json(
        {
          message: "Only JPG, PNG and WebP images are allowed.",
        },
        {
          status: 400,
        },
      );
    }

    if (uploadedFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: "Receipt image must be 5 MB or smaller.",
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
       BUILD STORAGE PATH
    ===================================================== */

    const expenseDate = new Date(expense.expenseDate);

    const year = String(expenseDate.getUTCFullYear());

    const month = String(expenseDate.getUTCMonth() + 1).padStart(2, "0");

    const day = String(expenseDate.getUTCDate()).padStart(2, "0");

    const relativeFolder = path.join("expenses", year, month, day, id);

    const uploadFolder = path.join(process.cwd(), "uploads", relativeFolder);

    await fs.mkdir(uploadFolder, {
      recursive: true,
    });

    /* =====================================================
       SAVE NEW FILE
    ===================================================== */

    const fileName = `receipt-${Date.now()}.${extension}`;

    const absoluteFilePath = path.join(uploadFolder, fileName);

    const buffer = Buffer.from(await uploadedFile.arrayBuffer());

    await fs.writeFile(absoluteFilePath, buffer);

    newFilePath = absoluteFilePath;

    const relativeFilePath = path.join("uploads", relativeFolder, fileName);

    /* =====================================================
       UPDATE DATABASE
    ===================================================== */

    const oldFilePath = expense.receiptFilePath;

    const updatedExpense = await prisma.expense.update({
      where: {
        id,
      },

      data: {
        receiptFileName: fileName,

        receiptFilePath: relativeFilePath,
      },

      select: {
        id: true,

        expenseDate: true,

        receiptFileName: true,

        updatedAt: true,
      },
    });

    /* =====================================================
   REMOVE OLD RECEIPT
   ONLY AFTER DB UPDATE SUCCEEDS
===================================================== */
    if (oldFilePath) {
      try {
        const uploadsRoot = path.join(process.cwd(), "uploads");

        const storedPath = oldFilePath.replace(/^uploads[\\/]/, "");

        const oldAbsolutePath = path.join(uploadsRoot, storedPath);

        const relativeCheck = path.relative(uploadsRoot, oldAbsolutePath);

        if (
          !relativeCheck.startsWith("..") &&
          !path.isAbsolute(relativeCheck)
        ) {
          await fs.unlink(oldAbsolutePath);
        }
      } catch (error) {
        console.warn("Old receipt cleanup warning:", error);
      }
    }
    /* =====================================================
       SAFE RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        message: "Receipt uploaded successfully.",

        receipt: {
          expenseId: updatedExpense.id,

          fileName: updatedExpense.receiptFileName,

          status: "UPLOADED",

          updatedAt: updatedExpense.updatedAt,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Expense receipt upload error:", error);

    /* =====================================================
       ROLLBACK NEW PHYSICAL FILE
       IF DB UPDATE FAILED
    ===================================================== */

    if (newFilePath) {
      try {
        await fs.unlink(newFilePath);
      } catch (cleanupError) {
        console.warn("Receipt rollback cleanup warning:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        message: "Unable to upload receipt.",
      },
      {
        status: 500,
      },
    );
  }
}
