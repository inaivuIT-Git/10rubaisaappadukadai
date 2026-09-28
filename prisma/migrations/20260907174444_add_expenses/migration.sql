-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FOOD_EXPENSE', 'OPERATING_EXPENSE');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('RICE_GROCERIES', 'VEGETABLES', 'COOKING_GAS_FUEL', 'COOKING_MATERIALS', 'PACKAGING', 'TRANSPORT', 'RENT', 'ELECTRICITY', 'WATER', 'STAFF_LABOUR', 'MAINTENANCE', 'MARKETING_PRINTING', 'OTHER');

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "expenseDate" DATE NOT NULL,
    "expenseType" "ExpenseType" NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paidTo" TEXT,
    "billReferenceNumber" TEXT,
    "receiptFileName" TEXT,
    "receiptFilePath" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "expenses_expenseDate_idx" ON "expenses"("expenseDate");

-- CreateIndex
CREATE INDEX "expenses_expenseType_idx" ON "expenses"("expenseType");

-- CreateIndex
CREATE INDEX "expenses_category_idx" ON "expenses"("category");

-- CreateIndex
CREATE INDEX "expenses_paymentMethod_idx" ON "expenses"("paymentMethod");
