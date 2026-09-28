import { NextRequest, NextResponse } from "next/server";

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

import {
  DonationImageType,
} from "@/app/generated/prisma/client";

/* =====================================================
   SETTINGS
===================================================== */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =====================================================
   HELPERS
===================================================== */

function getExtension(file: File) {
  switch (file.type) {
    case "image/jpeg":
      return ".jpg";

    case "image/png":
      return ".png";

    case "image/webp":
      return ".webp";

    default:
      return null;
  }
}

function getImageType(
  value: FormDataEntryValue | null
) {
  if (value === "REFERENCE") {
    return DonationImageType.REFERENCE;
  }

  if (value === "BANNER") {
    return DonationImageType.BANNER;
  }

  return null;
}

/* =====================================================
   POST / REPLACE IMAGE
===================================================== */

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  let newAbsoluteFilePath: string | null = null;

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
       2. DONATION ID
    ------------------------------------------------- */

    const { id: donationId } =
      await context.params;

    if (!donationId) {
      return NextResponse.json(
        {
          message:
            "Donation ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------
       3. READ FORM DATA
    ------------------------------------------------- */

    const formData =
      await request.formData();

    const fileValue =
      formData.get("file");

    const imageType =
      getImageType(
        formData.get("imageType")
      );

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        {
          message:
            "Image file is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!imageType) {
      return NextResponse.json(
        {
          message:
            "Image type must be REFERENCE or BANNER.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------
       4. VALIDATE IMAGE
    ------------------------------------------------- */

    if (
      !ALLOWED_TYPES.includes(
        fileValue.type
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Only JPG, PNG and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (fileValue.size <= 0) {
      return NextResponse.json(
        {
          message:
            "The selected image is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      fileValue.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          message:
            "Image size must not exceed 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const extension =
      getExtension(fileValue);

    if (!extension) {
      return NextResponse.json(
        {
          message:
            "Invalid image format.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------
       5. FIND DONATION
    ------------------------------------------------- */

    const donation =
      await prisma.donation.findUnique({
        where: {
          id: donationId,
        },

        select: {
          id: true,
          foodOfferedDate: true,
        },
      });

    if (!donation) {
      return NextResponse.json(
        {
          message:
            "Donation was not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------
       6. FIND EXISTING IMAGE

       One donation should have only:
       - one REFERENCE
       - one BANNER
    ------------------------------------------------- */

    const existingImages =
      await prisma.donationImage.findMany({
        where: {
          donationId:
            donation.id,

          imageType,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    /*
     * The newest existing image is treated as
     * the main image.
     *
     * findMany is intentional because some old
     * test data may already contain duplicates.
     */
    const existingImage =
      existingImages[0] ?? null;

    /* -------------------------------------------------
       7. BUILD STORAGE FOLDER
    ------------------------------------------------- */

    const foodDate =
      donation.foodOfferedDate;

    const year = String(
      foodDate.getUTCFullYear()
    );

    const month = String(
      foodDate.getUTCMonth() + 1
    ).padStart(2, "0");

    const day = String(
      foodDate.getUTCDate()
    ).padStart(2, "0");

    const typeFolder =
      imageType ===
      DonationImageType.REFERENCE
        ? "reference"
        : "banner";

    const relativeDirectory =
      path.join(
        "occasions",
        year,
        month,
        day,
        donation.id,
        typeFolder
      );

    const uploadRoot =
      path.join(
        process.cwd(),
        "uploads"
      );

    const absoluteDirectory =
      path.join(
        uploadRoot,
        relativeDirectory
      );

    await fs.mkdir(
      absoluteDirectory,
      {
        recursive: true,
      }
    );

    /* -------------------------------------------------
       8. GENERATE NEW FILE NAME
    ------------------------------------------------- */

    const uniquePart =
      crypto.randomUUID();

    const fileName =
      `image-${uniquePart}${extension}`;

    const absoluteFilePath =
      path.join(
        absoluteDirectory,
        fileName
      );

    newAbsoluteFilePath =
      absoluteFilePath;

    const internalFilePath =
      path
        .join(
          relativeDirectory,
          fileName
        )
        .replaceAll("\\", "/");

    /* -------------------------------------------------
       9. SAVE NEW PHYSICAL FILE
    ------------------------------------------------- */

    const bytes =
      await fileValue.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    await fs.writeFile(
      absoluteFilePath,
      buffer
    );

    /* -------------------------------------------------
       10. CREATE OR REPLACE DATABASE RECORD
    ------------------------------------------------- */

    let image;

    if (existingImage) {
      /*
       * REPLACE:
       * Keep the same DB record ID.
       */

      image =
        await prisma.donationImage.update({
          where: {
            id: existingImage.id,
          },

          data: {
            fileName,
            filePath:
              internalFilePath,

            sortOrder: 1,
          },

          select: {
            id: true,
            donationId: true,
            imageType: true,
            fileName: true,
            sortOrder: true,
            createdAt: true,
            updatedAt: true,
          },
        });
    } else {
      /*
       * FIRST IMAGE:
       * Create a new DB record.
       */

      image =
        await prisma.donationImage.create({
          data: {
            donationId:
              donation.id,

            imageType,

            fileName,

            filePath:
              internalFilePath,

            sortOrder: 1,
          },

          select: {
            id: true,
            donationId: true,
            imageType: true,
            fileName: true,
            sortOrder: true,
            createdAt: true,
            updatedAt: true,
          },
        });
    }

    /*
     * Database now points to the new image,
     * so the newly written file should no
     * longer be removed by catch().
     */
    newAbsoluteFilePath = null;

    /* -------------------------------------------------
       11. DELETE OLD PHYSICAL IMAGE
    ------------------------------------------------- */

    if (
      existingImage &&
      existingImage.filePath !==
        internalFilePath
    ) {
      const oldAbsolutePath =
        path.join(
          uploadRoot,
          existingImage.filePath
        );

      try {
        await fs.unlink(
          oldAbsolutePath
        );
      } catch (error) {
        console.warn(
          "Unable to delete old image file:",
          error
        );
      }
    }

    /* -------------------------------------------------
       12. CLEAN OLD DUPLICATE RECORDS

       This also fixes older test data where
       more than one BANNER / REFERENCE exists.
    ------------------------------------------------- */

    const duplicateImages =
      existingImages.slice(1);

    for (
      const duplicate
      of duplicateImages
    ) {
      const duplicateAbsolutePath =
        path.join(
          uploadRoot,
          duplicate.filePath
        );

      try {
        await fs.unlink(
          duplicateAbsolutePath
        );
      } catch (error) {
        console.warn(
          "Unable to delete duplicate image file:",
          error
        );
      }

      await prisma.donationImage.delete({
        where: {
          id: duplicate.id,
        },
      });
    }

    /* -------------------------------------------------
       13. SAFE RESPONSE
    ------------------------------------------------- */

    return NextResponse.json(
      {
        message:
          existingImage
            ? imageType ===
              DonationImageType.REFERENCE
              ? "Reference photo replaced successfully."
              : "Banner artwork replaced successfully."
            : imageType ===
                DonationImageType.REFERENCE
              ? "Reference photo uploaded successfully."
              : "Banner artwork uploaded successfully.",

        image,
      },
      {
        status:
          existingImage
            ? 200
            : 201,
      }
    );
  } catch (error) {
    console.error(
      "Donation image upload error:",
      error
    );

    /*
     * If the new file was physically written
     * but DB creation/update failed, clean it.
     */
    if (newAbsoluteFilePath) {
      try {
        await fs.unlink(
          newAbsoluteFilePath
        );
      } catch {
        // Ignore cleanup failure.
      }
    }

    return NextResponse.json(
      {
        message:
          "Unable to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}