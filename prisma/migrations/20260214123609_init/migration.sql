-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "marketingAutomation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remindersEnabled" BOOLEAN NOT NULL DEFAULT false;
