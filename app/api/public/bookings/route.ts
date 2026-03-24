import { prisma } from "@/Tools/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { serviceId, businessId, customerName, customerEmail, customerPhone, startTime } = body;

        if (!serviceId || !businessId || !customerName || !customerEmail || !customerPhone || !startTime) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify service and business exist
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { business: true }
        });

        if (!service || service.businessId !== businessId) {
            return NextResponse.json({ message: "Service or Business not found" }, { status: 404 });
        }

        // 2. Calculate end time based on service duration
        const start = new Date(startTime);
        const end = new Date(start.getTime() + service.duration * 60000);

        // 3. Check for overlapping appointments (Conflict Prevention)
        const overlappingAppointment = await prisma.appointment.findFirst({
            where: {
                businessId,
                status: { in: ["PENDING", "CONFIRMED"] },
                AND: [
                    { startTime: { lt: end } },
                    { endTime: { gt: start } }
                ]
            }
        });

        if (overlappingAppointment) {
            return NextResponse.json({
                message: "This slot is already booked or pending. Please choose another time."
            }, { status: 409 });
        }

        // 4. Find or create customer (scoped to business)
        const customer = await prisma.customer.upsert({
            where: {
                email_businessId: {
                    email: customerEmail,
                    businessId: businessId
                }
            },
            update: {
                name: customerName,
                phone: customerPhone
            },
            create: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                businessId: businessId
            }
        });

        // 4. Create the appointment as PENDING (awaiting owner approval)
        const appointment = await prisma.appointment.create({
            data: {
                startTime: start,
                endTime: end,
                serviceId,
                businessId,
                customerId: customer.id,
                status: "PENDING"
            }
        });

        return NextResponse.json({
            message: "Booking request submitted successfully!",
            appointment
        }, { status: 201 });

    } catch (error) {
        console.error("Public booking error:", error);
        return NextResponse.json({ message: "Error creating booking" }, { status: 500 });
    }
}
