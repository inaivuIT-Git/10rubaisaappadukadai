import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { getAuthenticatedAdmin } from "@/app/lib/admin-auth";

import {
  ExpenseCategory,
  ExpenseType,
  PaymentMethod,
} from "@/app/generated/prisma/client";

/* =====================================================
   GET SINGLE EXPENSE
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

    const { id } = await context.params;

    const expense = await prisma.expense.findUnique({
      where: {
        id,
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
        billReferenceNumber: true,
        receiptFileName: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!expense) {
      return NextResponse.json(
        {
          message: "Expense not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        expense: {
          ...expense,

          amount: Number(expense.amount),

          receiptStatus: expense.receiptFileName
            ? "UPLOADED"
            : "NOT_PROVIDED",
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET single expense error:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to load expense.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   PATCH EXPENSE
===================================================== */

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
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

    const { id } = await context.params;

    /* =====================================================
       CHECK EXPENSE
    ===================================================== */

    const existingExpense =
      await prisma.expense.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingExpense) {
      return NextResponse.json(
        {
          message: "Expense not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    const expenseDate = String(
      body.expenseDate ?? ""
    ).trim();

    const expenseType = String(
      body.expenseType ?? ""
    ).trim();

    const category = String(
      body.category ?? ""
    ).trim();

    const description = String(
      body.description ?? ""
    ).trim();

    const amount = Number(body.amount);

    const paymentMethod = String(
      body.paymentMethod ?? ""
    ).trim();

    const paidTo = String(
      body.paidTo ?? ""
    ).trim();

    const billReferenceNumber = String(
      body.billReferenceNumber ?? ""
    ).trim();

    const notes = String(
      body.notes ?? ""
    ).trim();

    /* =====================================================
       REQUIRED VALIDATION

       Description is intentionally OPTIONAL.
    ===================================================== */

    if (!expenseDate) {
      return NextResponse.json(
        {
          message: "Expense date is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!expenseType) {
      return NextResponse.json(
        {
          message: "Expense type is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          message: "Expense category is required.",
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
          message: "Payment method is required.",
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
      !Object.values(ExpenseType).includes(
        expenseType as ExpenseType
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid expense type.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Object.values(ExpenseCategory).includes(
        category as ExpenseCategory
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid expense category.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Object.values(PaymentMethod).includes(
        paymentMethod as PaymentMethod
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid payment method.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       DATE VALIDATION
    ===================================================== */

    const parsedExpenseDate = new Date(
      `${expenseDate}T00:00:00.000Z`
    );

    if (
      Number.isNaN(
        parsedExpenseDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid expense date.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    const expense = await prisma.expense.update({
      where: {
        id,
      },

      data: {
        expenseDate: parsedExpenseDate,

        expenseType:
          expenseType as ExpenseType,

        category:
          category as ExpenseCategory,

        description,

        amount,

        paymentMethod:
          paymentMethod as PaymentMethod,

        paidTo: paidTo || null,

        billReferenceNumber:
          billReferenceNumber || null,

        notes: notes || null,
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
        billReferenceNumber: true,
        receiptFileName: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message:
          "Expense updated successfully.",

        expense: {
          ...expense,

          amount: Number(expense.amount),

          receiptStatus: expense.receiptFileName
            ? "UPLOADED"
            : "NOT_PROVIDED",
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH expense error:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to update expense.",
      },
      {
        status: 500,
      }
    );
  }
}