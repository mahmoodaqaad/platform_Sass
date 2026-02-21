/*
  Warnings:

  - The `status` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "status",
ADD COLUMN     "status" "BusinessStatus" NOT NULL DEFAULT 'ACTIVE';
