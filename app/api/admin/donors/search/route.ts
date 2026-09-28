import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Check authentication
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
    // 2. Read search parameters
    // --------------------------------------------------
    const searchParams = request.nextUrl.searchParams;

    const mobile = searchParams.get("mobile")?.trim() ?? "";

    const name = searchParams.get("name")?.trim() ?? "";

    // --------------------------------------------------
    // 3. Require at least one search value
    // --------------------------------------------------
    if (!mobile && !name) {
      return NextResponse.json(
        {
          message: "Mobile or name is required.",
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------
    // 4. Search donors
    // --------------------------------------------------
    const donors = await prisma.donor.findMany({
      where: {
        isActive: true,

        OR: [
          ...(mobile
            ? [
                {
                  mobile: {
                    contains: mobile,
                    mode: "insensitive" as const,
                  },
                },
              ]
            : []),

          ...(name
            ? [
                {
                  name: {
                    contains: name,
                    mode: "insensitive" as const,
                  },
                },
              ]
            : []),
        ],
      },

      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
        address: true,

        // ----------------------------------------------
        // Existing occasions for this donor
        // ----------------------------------------------
        occasions: {
          where: {
            isActive: true,
          },

          select: {
            id: true,
            occasionType: true,
            donationFor: true,
            personName: true,
            relationshipToDonor: true,
            annualReminderEnabled: true,

            donations: {
              select: {
                foodOfferedDate: true,
              },

              orderBy: {
                foodOfferedDate: "desc",
              },

              take: 1,
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },

        // ----------------------------------------------
        // Previous donation history
        //
        // IMPORTANT:
        // No amount/payment information is returned here.
        // ----------------------------------------------
        donations: {
          select: {
            id: true,
            foodOfferedDate: true,

            occasion: {
              select: {
                    id: true,

                occasionType: true,
                donationFor: true,
                personName: true,
                relationshipToDonor: true,
              },
            },
          },

          orderBy: {
            foodOfferedDate: "desc",
          },

          take: 20,
        },
      },

      orderBy: {
        name: "asc",
      },

      take: 10,
    });

    // --------------------------------------------------
    // 5. Return results
    // --------------------------------------------------
    return NextResponse.json(
      {
        donors,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Donor search error:", error);

    return NextResponse.json(
      {
        message: "Unable to search donors.",
      },
      {
        status: 500,
      },
    );
  }
}
