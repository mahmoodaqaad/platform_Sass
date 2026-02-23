import prisma from "@/Tools/db";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Helper to verify staff and get their business
async function getStaffBusiness(req: NextRequest) {
    const token = req.cookies.get("myplatform_token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "STAFF") return null;

        const membership = await prisma.member.findFirst({
            where: { userId: payload.id as string },
            include: { business: true }
        });

        return membership?.business || null;
    } catch (error) {
        console.error("Staff verify error:", error);
        return null;
    }
}

export const GET = async (req: NextRequest) => {
    const business = await getStaffBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    try {
        const appointments = await prisma.appointment.findMany({
            where: { businessId: business.id },
            include: {
                customer: {
                    select: {
                        name: true,
                    }
                },
                service: {
                    select: {
                        name: true,
                        duration: true,
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        const appointmentData = appointments.map(item => ({
            id: item.id,
            serviceName: item.service.name,
            serviceDur: item.service.duration,
            customerName: item.customer.name,
            startTime: item.startTime,
            status: item.status,
        }));

        return NextResponse.json(appointmentData);
    } catch (error) {
        console.error("Fetch schedule error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء تحميل بيانات الحجوزات" }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
    const business = await getStaffBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    try {
        const body = await req.json();
        const { appointmentId, status } = body;

        if (!appointmentId || !status) {
            return NextResponse.json({ message: "بيانات ناقصة" }, { status: 400 });
        }

        // Verify the appointment belongs to the staff's business
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                businessId: business.id
            }
        });

        if (!appointment) {
            return NextResponse.json({ message: "الحجز غير موجود" }, { status: 404 });
        }

        // Logic for automatic revenue generation if status is COMPLETED
        if (status === 'COMPLETED' && appointment.status !== 'COMPLETED') {
            const service = await prisma.service.findUnique({
                where: { id: appointment.serviceId }
            });

            if (service) {
                await prisma.$transaction([
                    prisma.appointment.update({
                        where: { id: appointmentId },
                        data: { status }
                    }),
                    prisma.order.upsert({
                        where: { id: appointmentId },
                        create: {
                            id: appointmentId,
                            total: service.price,
                            status: 'PAID',
                            businessId: appointment.businessId,
                            customerId: appointment.customerId
                        },
                        update: {
                            status: 'PAID'
                        }
                    })
                ]);
                return NextResponse.json({ message: "تم إكمال الحجز وتسجيل الإيرادات بنجاح" });
            }
        }

        const updated = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update status error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء تحديث حالة الحجز" }, { status: 500 });
    }
};