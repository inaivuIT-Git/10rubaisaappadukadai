/*
  Warnings:

  - Added the required column `imageType` to the `donation_images` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DonationImageType" AS ENUM ('REFERENCE', 'BANNER');

-- AlterTable
ALTER TABLE "donation_images" ADD COLUMN     "imageType" "DonationImageType" NOT NULL;

-- CreateIndex
CREATE INDEX "donation_images_imageType_idx" ON "donation_images"("imageType");

-- CreateIndex
CREATE INDEX "donation_images_donationId_imageType_idx" ON "donation_images"("donationId", "imageType");
