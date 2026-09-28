import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

/* =====================================================
   GET SINGLE DONATION
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
    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    const admin = await getAuthenticatedAdmin();

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

    // --------------------------------------------------
    // DONATION ID
    // --------------------------------------------------

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Donation ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // FIND DONATION
    // --------------------------------------------------

    const donation = await prisma.donation.findUnique({
      where: {
        id,
      },

      include: {
        donor: {
          select: {
            id: true,
            name: true,
            mobile: true,
            email: true,
            address: true,
          },
        },

        occasion: {
          select: {
            id: true,
            occasionType: true,
            donationFor: true,
            personName: true,
            relationshipToDonor: true,
            annualReminderEnabled: true,
          },
        },

        images: {
          select: {
            id: true,
            imageType: true,
            fileName: true,
            sortOrder: true,
            createdAt: true,
          },

          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!donation) {
      return NextResponse.json(
        {
          message: "Donation not found.",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------
    // SAFE COMMON RESPONSE
    // --------------------------------------------------

    const responseData: {
      id: string;

      donor: typeof donation.donor;
      occasion: typeof donation.occasion;

      foodOfferedDate: Date;

      images: typeof donation.images;

      createdAt: Date;

      amountReceived?: number | null;
      paymentMethod?: string | null;
      transactionReference?: string | null;
      paymentReceivedDate?: Date | null;
    } = {
      id: donation.id,

      donor: donation.donor,

      occasion: donation.occasion,

      foodOfferedDate:
        donation.foodOfferedDate,

      images: donation.images,

      createdAt: donation.createdAt,
    };

    // --------------------------------------------------
    // FINANCIAL DATA — SUPER ADMIN ONLY
    // --------------------------------------------------

    if (admin.role === "SUPER_ADMIN") {
      responseData.amountReceived =
        donation.amountReceived !== null
          ? Number(donation.amountReceived)
          : null;

      responseData.paymentMethod =
        donation.paymentMethod;

      responseData.transactionReference =
        donation.transactionReference;

      responseData.paymentReceivedDate =
        donation.paymentReceivedDate;
    }

    return NextResponse.json({
      donation: responseData,
    });
  } catch (error) {
    console.error(
      "Get donation error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load donation.",
      },
      {
        status: 500,
      }
    );
  }
}