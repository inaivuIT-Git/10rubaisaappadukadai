import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

import { AdminRole, DonationImageType } from "@/app/generated/prisma/client";

export async function GET() {
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

    const isSuperAdmin = admin.role === AdminRole.SUPER_ADMIN;

    /* =====================================================
       TODAY - INDIA DATE
    ===================================================== */

    const todayString = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const today = new Date(`${todayString}T00:00:00.000Z`);

    const upcomingEndDate = new Date(today);

    upcomingEndDate.setUTCDate(upcomingEndDate.getUTCDate() + 7);

    /* =====================================================
       GENERAL COUNTS
    ===================================================== */

    const [donationsCount, expensesCount, bannerUploadedCount] =
      await Promise.all([
        prisma.donation.count(),

        prisma.expense.count(),

        prisma.donation.count({
          where: {
            images: {
              some: {
                imageType: DonationImageType.BANNER,
              },
            },
          },
        }),
      ]);

    const bannerPendingCount = Math.max(
      donationsCount - bannerUploadedCount,
      0,
    );

    /* =====================================================
       UPCOMING FOOD OFFERED DATES
    ===================================================== */

    const upcomingFoodDates = await prisma.donation.findMany({
      where: {
        foodOfferedDate: {
          gte: today,
          lte: upcomingEndDate,
        },
      },

      orderBy: [
        {
          foodOfferedDate: "asc",
        },
        {
          createdAt: "asc",
        },
      ],

      select: {
        id: true,
        foodOfferedDate: true,

        donor: {
          select: {
            id: true,
            name: true,
            mobile: true,
          },
        },

        occasion: {
          select: {
            id: true,
            occasionType: true,
            donationFor: true,
            personName: true,
            relationshipToDonor: true,
          },
        },

        images: {
          where: {
            imageType: DonationImageType.BANNER,
          },

          select: {
            id: true,
            fileName: true,
            imageType: true,
          },

          take: 1,
        },
      },
    });

    /* =====================================================
       RECENT DONATIONS
    ===================================================== */

    const recentDonations = await prisma.donation.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      select: {
        id: true,
        foodOfferedDate: true,
        createdAt: true,

        donor: {
          select: {
            id: true,
            name: true,
            mobile: true,
          },
        },

        occasion: {
          select: {
            id: true,
            occasionType: true,
            donationFor: true,
            personName: true,
          },
        },

        images: {
          where: {
            imageType: DonationImageType.BANNER,
          },

          select: {
            id: true,
            fileName: true,
          },

          take: 1,
        },
      },
    });

    /* =====================================================
       RECENT EXPENSES
    ===================================================== */

    const recentExpenses = await prisma.expense.findMany({
      orderBy: [
        {
          expenseDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 5,

      select: {
        id: true,
        expenseDate: true,
        expenseType: true,
        category: true,
        description: true,
        amount: true,
        paymentMethod: true,
        paidTo: true,
        receiptFileName: true,
        createdAt: true,
      },
    });

    const safeRecentExpenses = recentExpenses.map((expense) => ({
      ...expense,

      amount: Number(expense.amount),

      receiptStatus: expense.receiptFileName ? "UPLOADED" : "NOT_PROVIDED",
    }));

    /* =====================================================
       TODAY IMAGE / BANNER SUMMARY
    ===================================================== */

    const [todayDonationCount, todayBannerUploadedCount] = await Promise.all([
      prisma.donation.count({
        where: {
          foodOfferedDate: today,
        },
      }),

      prisma.donation.count({
        where: {
          foodOfferedDate: today,

          images: {
            some: {
              imageType: DonationImageType.BANNER,
            },
          },
        },
      }),
    ]);

    const todayBannerPendingCount = Math.max(
      todayDonationCount - todayBannerUploadedCount,
      0,
    );

    /* =====================================================
       SUPER ADMIN FINANCIAL SUMMARY
    ===================================================== */

    let finance = null;

    if (isSuperAdmin) {
      const [
        gpaySummary,
        cashSummary,
        neftSummary,
        donationTotalSummary,
        expenseTotalSummary,
      ] = await Promise.all([
        prisma.donation.aggregate({
          where: {
            paymentMethod: "GPAY",
          },

          _sum: {
            amountReceived: true,
          },
        }),

        prisma.donation.aggregate({
          where: {
            paymentMethod: "CASH",
          },

          _sum: {
            amountReceived: true,
          },
        }),

        prisma.donation.aggregate({
          where: {
            paymentMethod: "NEFT",
          },

          _sum: {
            amountReceived: true,
          },
        }),

        prisma.donation.aggregate({
          _sum: {
            amountReceived: true,
          },
        }),

        prisma.expense.aggregate({
          _sum: {
            amount: true,
          },
        }),
      ]);

      const gpay = Number(gpaySummary._sum.amountReceived ?? 0);

      const cash = Number(cashSummary._sum.amountReceived ?? 0);

      const neft = Number(neftSummary._sum.amountReceived ?? 0);

      const totalDonations = Number(
        donationTotalSummary._sum.amountReceived ?? 0,
      );

      const totalExpenses = Number(expenseTotalSummary._sum.amount ?? 0);

      finance = {
        gpay,
        cash,
        neft,

        totalDonations,
        totalExpenses,

        balance: totalDonations - totalExpenses,
      };
    }

    /* =====================================================
       SAFE RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        date: todayString,

        summary: {
          donationsCount,
          expensesCount,

          banners: {
            uploaded: bannerUploadedCount,

            pending: bannerPendingCount,
          },

          today: {
            donations: todayDonationCount,

            bannersUploaded: todayBannerUploadedCount,

            bannersPending: todayBannerPendingCount,
          },
        },

        upcomingFoodDates: upcomingFoodDates.map((donation) => ({
          id: donation.id,

          foodOfferedDate: donation.foodOfferedDate,

          donor: donation.donor,

          occasion: donation.occasion,

          bannerStatus: donation.images.length > 0 ? "UPLOADED" : "PENDING",
        })),

        recentDonations: recentDonations.map((donation) => ({
          id: donation.id,

          foodOfferedDate: donation.foodOfferedDate,

          createdAt: donation.createdAt,

          donor: donation.donor,

          occasion: donation.occasion,

          bannerStatus: donation.images.length > 0 ? "UPLOADED" : "PENDING",
        })),

        recentExpenses: safeRecentExpenses,

        finance,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        message: "Unable to load dashboard.",
      },
      {
        status: 500,
      },
    );
  }
}
