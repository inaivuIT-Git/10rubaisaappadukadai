import { NextRequest, NextResponse } from "next/server";

import fs from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

/* =====================================================
   HELPERS
===================================================== */

function getContentType(fileName: string) {
  const extension = path
    .extname(fileName)
    .toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";

    case ".png":
      return "image/png";

    case ".webp":
      return "image/webp";

    default:
      return null;
  }
}

/* =====================================================
   GET ADMIN IMAGE
===================================================== */

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    /* -------------------------------------------------
       1. AUTHENTICATION
    ------------------------------------------------- */

    const admin =
      await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    /* -------------------------------------------------
       2. IMAGE ID
    ------------------------------------------------- */

    const { id: imageId } =
      await context.params;

    if (!imageId) {
      return NextResponse.json(
        {
          message: "Image ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------
       3. FIND IMAGE
    ------------------------------------------------- */

    const image =
      await prisma.donationImage.findUnique({
        where: {
          id: imageId,
        },

        select: {
          id: true,
          fileName: true,
          filePath: true,
          imageType: true,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          message: "Image was not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------
       4. CONTENT TYPE
    ------------------------------------------------- */

    const contentType =
      getContentType(image.fileName);

    if (!contentType) {
      return NextResponse.json(
        {
          message: "Unsupported image format.",
        },
        {
          status: 415,
        }
      );
    }

    /* -------------------------------------------------
       5. SAFE FILE PATH
    ------------------------------------------------- */

    const uploadRoot =
      path.resolve(
        process.cwd(),
        "uploads"
      );

    const absolutePath =
      path.resolve(
        uploadRoot,
        image.filePath
      );

    /*
     * Security:
     * The DB path must remain inside /uploads.
     */

    if (
      !absolutePath.startsWith(
        uploadRoot + path.sep
      )
    ) {
      console.error(
        "Invalid donation image path:",
        image.id
      );

      return NextResponse.json(
        {
          message: "Image was not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------
       6. READ IMAGE
    ------------------------------------------------- */

    let fileBuffer: Buffer;

    try {
      fileBuffer =
        await fs.readFile(
          absolutePath
        );
    } catch (error) {
      console.error(
        "Unable to read donation image:",
        error
      );

      return NextResponse.json(
        {
          message: "Image file was not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------
       7. RETURN IMAGE
    ------------------------------------------------- */

    return new NextResponse(
      new Uint8Array(fileBuffer),
      {
        status: 200,

        headers: {
          "Content-Type":
            contentType,

          "Content-Length":
            String(
              fileBuffer.length
            ),

          "Cache-Control":
            "private, max-age=3600",

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    console.error(
      "Admin image view error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load image.",
      },
      {
        status: 500,
      }
    );
  }
}