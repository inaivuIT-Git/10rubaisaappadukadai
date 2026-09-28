-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';
