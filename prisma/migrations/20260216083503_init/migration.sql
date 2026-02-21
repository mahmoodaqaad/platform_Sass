-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "image" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
