/*
  Warnings:

  - The `plan` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PLAN" AS ENUM ('BASIC', 'PRO', 'BUSINESS', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "plan",
ADD COLUMN     "plan" "PLAN" NOT NULL DEFAULT 'BASIC';
