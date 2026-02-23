import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";

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
        return null;
    }
}

export const GET = async (req: NextRequest) => {
    const business = await getStaffBusiness(req);
    if (!business) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const appointmentsToday = await prisma.appointment.count({
            where: {
                businessId: business.id,
                startTime: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        const completedToday = await prisma.appointment.count({
            where: {
                businessId: business.id,
                status: "COMPLETED",
                startTime: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        const nextAppointments = await prisma.appointment.findMany({
            where: {
                businessId: business.id,
                startTime: {
                    gte: new Date()
                }
            },
            take: 3,
            orderBy: {
                startTime: 'asc'
            },
            include: {
                customer: { select: { name: true } },
                service: { select: { name: true } }
            }
        });

        return NextResponse.json({
            stats: {
                today: appointmentsToday,
                completed: completedToday,
                workingHours: "8h" // Placeholder for now
            },
            recent: nextAppointments.map(app => ({
                id: app.id,
                time: new Date(app.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                client: app.customer.name,
                service: app.service.name,
                status: app.status === "PENDING" ? "Upcoming" : app.status === "CONFIRMED" ? "In Progress" : app.status
            }))
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
