import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

import {
  AdminRole,
  DonationFor,
  OccasionType,
  PaymentMethod,
} from "@/app/generated/prisma/client";

type CreateDonationBody = {
  donorId?: string | null;

  donorName: string;
  mobile?: string;
  email?: string;
  address?: string;

  occasionId?: string | null;

  foodOfferedDate: string;
  occasionType: string;
  donationFor: string;
  personName: string;
  relationshipToDonor?: string;
  annualReminderEnabled: boolean;

  amountReceived?: number | null;
  paymentMethod?: string | null;
  transactionReference?: string | null;
  paymentReceivedDate?: string | null;
};

function getOccasionType(value: string) {
  switch (value) {
    case "birthday":
      return OccasionType.BIRTHDAY;

    case "wedding-anniversary":
      return OccasionType.WEDDING_ANNIVERSARY;

    case "memorial":
      return OccasionType.MEMORIAL;

    case "other":
      return OccasionType.OTHER;

    default:
      return null;
  }
}

function getDonationFor(value: string) {
  switch (value) {
    case "self":
      return DonationFor.SELF;

    case "family-member":
      return DonationFor.FAMILY_MEMBER;

    case "friend":
      return DonationFor.FRIEND;

    case "relative":
      return DonationFor.RELATIVE;

    case "other":
      return DonationFor.OTHER;

    default:
      return null;
  }
}

function getPaymentMethod(value?: string | null) {
  switch (value) {
    case "gpay":
      return PaymentMethod.GPAY;

    case "cash":
      return PaymentMethod.CASH;

    case "neft":
      return PaymentMethod.NEFT;

    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Authentication
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 2. Read request
    // --------------------------------------------------

    let body: CreateDonationBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          message: "Invalid request.",
        },
        {
          status: 400,
        },
      );
    }

    const donorName = body.donorName?.trim();
    const mobile = body.mobile?.trim() ?? "";
    const email = body.email?.trim() || null;
    const address = body.address?.trim() || null;

    const personName = body.personName?.trim();

    const relationshipToDonor = body.relationshipToDonor?.trim() || null;

    // --------------------------------------------------
    // 3. Validate common fields
    // --------------------------------------------------

    if (!donorName) {
      return NextResponse.json(
        {
          message: "Donor name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!body.foodOfferedDate) {
      return NextResponse.json(
        {
          message: "Food offered date is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!personName) {
      return NextResponse.json(
        {
          message: "Person / couple name is required.",
        },
        {
          status: 400,
        },
      );
    }

    const occasionType = getOccasionType(body.occasionType);

    const donationFor = getDonationFor(body.donationFor);

    if (!occasionType) {
      return NextResponse.json(
        {
          message: "Invalid occasion type.",
        },
        {
          status: 400,
        },
      );
    }

    if (!donationFor) {
      return NextResponse.json(
        {
          message: "Invalid donation-for value.",
        },
        {
          status: 400,
        },
      );
    }

    const foodOfferedDate = new Date(`${body.foodOfferedDate}T00:00:00.000Z`);

    if (Number.isNaN(foodOfferedDate.getTime())) {
      return NextResponse.json(
        {
          message: "Invalid food offered date.",
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------
    // 4. Financial validation
    //
    // ADMIN cannot submit financial information.
    // SUPER_ADMIN can.
    // --------------------------------------------------

    let amountReceived: number | null = null;
    let paymentMethod: PaymentMethod | null = null;
    let transactionReference: string | null = null;
    let paymentReceivedDate: Date | null = null;

    if (admin.role === AdminRole.SUPER_ADMIN) {
      if (
        body.amountReceived === null ||
        body.amountReceived === undefined ||
        Number.isNaN(Number(body.amountReceived)) ||
        Number(body.amountReceived) < 0
      ) {
        return NextResponse.json(
          {
            message: "Valid amount is required.",
          },
          {
            status: 400,
          },
        );
      }

      amountReceived = Number(body.amountReceived);

      paymentMethod = getPaymentMethod(body.paymentMethod);

      if (!paymentMethod) {
        return NextResponse.json(
          {
            message: "Payment method is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (!body.paymentReceivedDate) {
        return NextResponse.json(
          {
            message: "Payment received date is required.",
          },
          {
            status: 400,
          },
        );
      }

      paymentReceivedDate = new Date(
        `${body.paymentReceivedDate}T00:00:00.000Z`,
      );

      if (Number.isNaN(paymentReceivedDate.getTime())) {
        return NextResponse.json(
          {
            message: "Invalid payment received date.",
          },
          {
            status: 400,
          },
        );
      }

      if (paymentMethod !== PaymentMethod.CASH) {
        transactionReference = body.transactionReference?.trim() || null;
      }
    }

    // --------------------------------------------------
    // 5. ADMIN financial-field protection
    // --------------------------------------------------

    if (
      admin.role !== AdminRole.SUPER_ADMIN &&
      (body.amountReceived !== undefined ||
        body.paymentMethod !== undefined ||
        body.transactionReference !== undefined ||
        body.paymentReceivedDate !== undefined)
    ) {
      return NextResponse.json(
        {
          message: "You do not have permission to submit payment information.",
        },
        {
          status: 403,
        },
      );
    }

    // --------------------------------------------------
    // 6. Database transaction
    // --------------------------------------------------

    const result = await prisma.$transaction(async (tx) => {
      // ----------------------------------------------
      // DONOR
      // ----------------------------------------------

      let donor;

      if (body.donorId) {
        donor = await tx.donor.findFirst({
          where: {
            id: body.donorId,
            isActive: true,
          },
        });

        if (!donor) {
          throw new Error("DONOR_NOT_FOUND");
        }

        // Update optional donor information entered
        // in the form.
        donor = await tx.donor.update({
          where: {
            id: donor.id,
          },

          data: {
            name: donorName,
            mobile,
            email,
            address,
          },
        });
      } else {
        donor = await tx.donor.create({
          data: {
            name: donorName,
            mobile,
            email,
            address,
          },
        });
      }

      // ----------------------------------------------
      // OCCASION
      // ----------------------------------------------

      let occasion;

      if (body.occasionId) {
        occasion = await tx.occasion.findFirst({
          where: {
            id: body.occasionId,
            donorId: donor.id,
            isActive: true,
          },
        });

        if (!occasion) {
          throw new Error("OCCASION_NOT_FOUND");
        }
      } else {
        occasion = await tx.occasion.create({
          data: {
            donorId: donor.id,
            occasionType,
            donationFor,
            personName,
            relationshipToDonor:
              donationFor === DonationFor.SELF ? null : relationshipToDonor,

            annualReminderEnabled: body.annualReminderEnabled,
          },
        });
      }

      // ----------------------------------------------
      // DONATION
      // ----------------------------------------------

      const donation = await tx.donation.create({
        data: {
          donorId: donor.id,
          occasionId: occasion.id,
          foodOfferedDate,

          amountReceived,
          paymentMethod,
          transactionReference,
          paymentReceivedDate,
        },

        select: {
          id: true,
          donorId: true,
          occasionId: true,
          foodOfferedDate: true,
          createdAt: true,
        },
      });

      return {
        donor,
        occasion,
        donation,
      };
    });

    // --------------------------------------------------
    // 7. Safe response
    //
    // Do not return financial information here.
    // --------------------------------------------------

    return NextResponse.json(
      {
        message: "Donation saved successfully.",

        donation: {
          id: result.donation.id,
          donorId: result.donor.id,
          occasionId: result.occasion.id,
          foodOfferedDate: result.donation.foodOfferedDate,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Create donation error:", error);

    if (error instanceof Error && error.message === "DONOR_NOT_FOUND") {
      return NextResponse.json(
        {
          message: "Selected donor was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (error instanceof Error && error.message === "OCCASION_NOT_FOUND") {
      return NextResponse.json(
        {
          message: "Selected occasion was not found for this donor.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Unable to save donation.",
      },
      {
        status: 500,
      },
    );
  }
}

/* =====================================================
   GET DONATIONS
===================================================== */

export async function GET() {
  try {
    // --------------------------------------------------
    // 1. Authentication
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 2. Load donations
    // --------------------------------------------------

    const donations = await prisma.donation.findMany({
      orderBy: {
        foodOfferedDate: "desc",
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
          },

          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    // --------------------------------------------------
    // 3. Role-safe response
    //
    // Financial fields are added only when the
    // authenticated user is SUPER_ADMIN.
    // --------------------------------------------------

    const response = donations.map((donation) => {
      const commonData = {
        id: donation.id,

        donor: {
          id: donation.donor.id,
          name: donation.donor.name,
          mobile: donation.donor.mobile,
          email: donation.donor.email,
          address: donation.donor.address,
        },

        occasion: {
          id: donation.occasion.id,
          occasionType: donation.occasion.occasionType,

          donationFor: donation.occasion.donationFor,

          personName: donation.occasion.personName,

          relationshipToDonor: donation.occasion.relationshipToDonor,

          annualReminderEnabled: donation.occasion.annualReminderEnabled,
        },

        foodOfferedDate: donation.foodOfferedDate,

        imageStatus: donation.images.some(
          (image) => image.imageType === "BANNER",
        )
          ? "Uploaded"
          : "Pending",

        imageCount: donation.images.length,

        images: donation.images,

        createdAt: donation.createdAt,
      };

      if (admin.role === AdminRole.SUPER_ADMIN) {
        return {
          ...commonData,

          amountReceived:
            donation.amountReceived !== null
              ? Number(donation.amountReceived)
              : null,

          paymentMethod: donation.paymentMethod,

          transactionReference: donation.transactionReference,

          paymentReceivedDate: donation.paymentReceivedDate,
        };
      }

      return commonData;
    });

    // --------------------------------------------------
    // 4. Response
    // --------------------------------------------------

    return NextResponse.json(
      {
        donations: response,
        total: response.length,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Get donations error:", error);

    return NextResponse.json(
      {
        message: "Unable to load donations.",
      },
      {
        status: 500,
      },
    );
  }
}
