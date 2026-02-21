-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_businessId_fkey";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
