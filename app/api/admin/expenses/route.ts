import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

import {
  ExpenseCategory,
  ExpenseType,
  PaymentMethod,
} from "@/app/generated/prisma/client";

/* =====================================================
   GET EXPENSES
===================================================== */

export async function GET() {
  try {
    const admin =
      await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const expenses =
      await prisma.expense.findMany({
        orderBy: [
          {
            expenseDate:
              "desc",
          },
          {
            createdAt:
              "desc",
          },
        ],

        select: {
          id: true,

          expenseDate: true,

          expenseType: true,

          category: true,

          description: true,

          amount: true,

          paymentMethod: true,

          paidTo: true,

          billReferenceNumber:
            true,

          receiptFileName:
            true,

          notes: true,

          createdAt: true,

          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        expenses:
          expenses.map(
            (expense) => ({
              id: expense.id,

              expenseDate:
                expense.expenseDate,

              expenseType:
                expense.expenseType,

              category:
                expense.category,

              description:
                expense.description,

              amount:
                Number(
                  expense.amount
                ),

              paymentMethod:
                expense.paymentMethod,

              paidTo:
                expense.paidTo,

              billReferenceNumber:
                expense.billReferenceNumber,

              receiptStatus:
                expense.receiptFileName
                  ? "UPLOADED"
                  : "NOT_PROVIDED",

              receiptFileName:
                expense.receiptFileName,

              notes:
                expense.notes,

              createdAt:
                expense.createdAt,

              updatedAt:
                expense.updatedAt,
            })
          ),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET expenses error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load expenses.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   POST EXPENSE
===================================================== */

export async function POST(
  request: NextRequest
) {
  try {
    const admin =
      await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const expenseDate =
      String(
        body.expenseDate ?? ""
      ).trim();

    const expenseType =
      String(
        body.expenseType ?? ""
      ).trim();

    const category =
      String(
        body.category ?? ""
      ).trim();

    const description =
      String(
        body.description ?? ""
      ).trim();

    const amount =
      Number(
        body.amount
      );

    const paymentMethod =
      String(
        body.paymentMethod ?? ""
      ).trim();

    const paidTo =
      String(
        body.paidTo ?? ""
      ).trim();

    const billReferenceNumber =
      String(
        body.billReferenceNumber ??
          ""
      ).trim();

    const notes =
      String(
        body.notes ?? ""
      ).trim();

    /* =====================================================
       REQUIRED FIELD VALIDATION
    ===================================================== */

    if (!expenseDate) {
      return NextResponse.json(
        {
          message:
            "Expense date is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!expenseType) {
      return NextResponse.json(
        {
          message:
            "Expense type is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          message:
            "Expense category is required.",
        },
        {
          status: 400,
        }
      );
    }



    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Please enter a valid expense amount.",
        },
        {
          status: 400,
        }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        {
          message:
            "Payment method is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       ENUM VALIDATION
    ===================================================== */

    if (
      !Object.values(
        ExpenseType
      ).includes(
        expenseType as ExpenseType
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid expense type.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Object.values(
        ExpenseCategory
      ).includes(
        category as ExpenseCategory
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid expense category.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Object.values(
        PaymentMethod
      ).includes(
        paymentMethod as PaymentMethod
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid payment method.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       DATE VALIDATION
    ===================================================== */

    const parsedExpenseDate =
      new Date(
        `${expenseDate}T00:00:00.000Z`
      );

    if (
      Number.isNaN(
        parsedExpenseDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid expense date.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CREATE EXPENSE
    ===================================================== */

    const expense =
      await prisma.expense.create({
        data: {
          expenseDate:
            parsedExpenseDate,

          expenseType:
            expenseType as ExpenseType,

          category:
            category as ExpenseCategory,

          description,

          amount,

          paymentMethod:
            paymentMethod as PaymentMethod,

          paidTo:
            paidTo || null,

          billReferenceNumber:
            billReferenceNumber ||
            null,

          notes:
            notes || null,
        },

        select: {
          id: true,

          expenseDate: true,

          expenseType: true,

          category: true,

          description: true,

          amount: true,

          paymentMethod: true,

          paidTo: true,

          billReferenceNumber:
            true,

          receiptFileName:
            true,

          notes: true,

          createdAt: true,

          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        message:
          "Expense created successfully.",

        expense: {
          id: expense.id,

          expenseDate:
            expense.expenseDate,

          expenseType:
            expense.expenseType,

          category:
            expense.category,

          description:
            expense.description,

          amount:
            Number(
              expense.amount
            ),

          paymentMethod:
            expense.paymentMethod,

          paidTo:
            expense.paidTo,

          billReferenceNumber:
            expense.billReferenceNumber,

          receiptStatus:
            expense.receiptFileName
              ? "UPLOADED"
              : "NOT_PROVIDED",

          receiptFileName:
            expense.receiptFileName,

          notes:
            expense.notes,

          createdAt:
            expense.createdAt,

          updatedAt:
            expense.updatedAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST expense error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to create expense.",
      },
      {
        status: 500,
      }
    );
  }
}