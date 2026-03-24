-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "defaultLanguage" TEXT NOT NULL DEFAULT 'ar';

-- AlterTable
ALTER TABLE "BusinessSection" ALTER COLUMN "settings" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "bookingCount" INTEGER NOT NULL DEFAULT 0;
