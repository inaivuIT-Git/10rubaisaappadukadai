-- CreateEnum
CREATE TYPE "OccasionType" AS ENUM ('BIRTHDAY', 'WEDDING_ANNIVERSARY', 'MEMORIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "DonationFor" AS ENUM ('SELF', 'FAMILY_MEMBER', 'FRIEND', 'RELATIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('GPAY', 'CASH', 'NEFT');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'WHATSAPP_SENT', 'SPONSORED', 'NOT_INTERESTED');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occasions" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "occasionType" "OccasionType" NOT NULL,
    "donationFor" "DonationFor" NOT NULL,
    "personName" TEXT NOT NULL,
    "relationshipToDonor" TEXT,
    "annualReminderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "occasions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "foodOfferedDate" DATE NOT NULL,
    "amountReceived" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionReference" TEXT,
    "paymentReceivedDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_images" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annual_reminders" (
    "id" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "reminderYear" INTEGER NOT NULL,
    "reminderDate" DATE NOT NULL,
    "foodOfferedDate" DATE NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "whatsappSentDate" TIMESTAMP(3),
    "responseDate" TIMESTAMP(3),
    "linkedDonationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annual_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "donors_mobile_idx" ON "donors"("mobile");

-- CreateIndex
CREATE INDEX "occasions_donorId_idx" ON "occasions"("donorId");

-- CreateIndex
CREATE INDEX "donations_donorId_idx" ON "donations"("donorId");

-- CreateIndex
CREATE INDEX "donations_occasionId_idx" ON "donations"("occasionId");

-- CreateIndex
CREATE INDEX "donations_foodOfferedDate_idx" ON "donations"("foodOfferedDate");

-- CreateIndex
CREATE INDEX "donations_paymentReceivedDate_idx" ON "donations"("paymentReceivedDate");

-- CreateIndex
CREATE INDEX "donation_images_donationId_idx" ON "donation_images"("donationId");

-- CreateIndex
CREATE INDEX "annual_reminders_reminderDate_idx" ON "annual_reminders"("reminderDate");

-- CreateIndex
CREATE INDEX "annual_reminders_status_idx" ON "annual_reminders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "annual_reminders_occasionId_reminderYear_key" ON "annual_reminders"("occasionId", "reminderYear");

-- AddForeignKey
ALTER TABLE "occasions" ADD CONSTRAINT "occasions_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "occasions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_images" ADD CONSTRAINT "donation_images_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_reminders" ADD CONSTRAINT "annual_reminders_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "occasions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_reminders" ADD CONSTRAINT "annual_reminders_linkedDonationId_fkey" FOREIGN KEY ("linkedDonationId") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
