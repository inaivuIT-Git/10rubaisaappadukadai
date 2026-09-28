-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "amountReceived" DROP NOT NULL,
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "paymentReceivedDate" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "annual_reminders_foodOfferedDate_idx" ON "annual_reminders"("foodOfferedDate");

-- CreateIndex
CREATE INDEX "donors_name_idx" ON "donors"("name");

-- CreateIndex
CREATE INDEX "occasions_occasionType_idx" ON "occasions"("occasionType");

-- CreateIndex
CREATE INDEX "occasions_personName_idx" ON "occasions"("personName");
