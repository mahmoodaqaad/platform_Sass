import prisma from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";
import { NextRequest, NextResponse } from "next/server";

// Helper to verify owner and get their business
async function getOwnerBusiness(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;

    try {
        const business = await prisma.business.findFirst({
            where: { ownerId: authUser.id }
        });
        return business;
    } catch (error) {
        console.error("Owner verify error:", error);
        return null;
    }
}

export const POST = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });

    try {
        const body = await req.json();
        const { serviceId, customerName, customerEmail, startTime } = body;

        if (!serviceId || !customerName || !customerEmail || !startTime) {
            return NextResponse.json({ message: "يرجى إكمال كافة البيانات" }, { status: 400 });
        }

        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return NextResponse.json({ message: "الخدمة غير موجودة" }, { status: 404 });

        // Calculate end time
        const start = new Date(startTime);
        const end = new Date(start.getTime() + service.duration * 60000);

        // Conflict Prevention
        const overlappingAppointment = await prisma.appointment.findFirst({
            where: {
                businessId: business.id,
                status: { in: ["PENDING", "CONFIRMED"] },
                AND: [
                    { startTime: { lt: end } },
                    { endTime: { gt: start } }
                ]
            }
        });

        if (overlappingAppointment) {
            return NextResponse.json({
                message: "يوجد موعد آخر متداخل في هذا الوقت. يرجى اختيار وقت آخر."
            }, { status: 409 });
        }

        // Find or create customer for this business
        const customer = await prisma.customer.upsert({
            where: { email_businessId: { email: customerEmail, businessId: business.id } },
            update: { name: customerName },
            create: { name: customerName, email: customerEmail, businessId: business.id }
        });

        const appointment = await prisma.appointment.create({
            data: {
                startTime: start,
                endTime: end,
                serviceId,
                businessId: business.id,
                customerId: customer.id,
                status: "CONFIRMED" // Manual bookings are usually confirmed immediately
            }
        });

        return NextResponse.json({ message: "تم تسجيل الحجز بنجاح", appointment }, { status: 201 });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ message: "خطأ أثناء إنشاء الحجز" }, { status: 500 });
    }
}

export const GET = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });

    try {
        const appointments = await prisma.appointment.findMany({
            where: { businessId: business.id },
            include: {
                service: true,
                customer: true
            },
            orderBy: { startTime: 'desc' }
        });

        return NextResponse.json({ bookings: appointments });
    } catch (error) {
        console.error("Fetch bookings error:", error);
        return NextResponse.json({ message: "خطأ أثناء جلب الحجوزات" }, { status: 500 });
    }
}
