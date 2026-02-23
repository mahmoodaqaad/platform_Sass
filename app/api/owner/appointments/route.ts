import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";

async function getOwnerId(req: NextRequest) {
    const token = req.cookies.get("myplatform_token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "OWNER") return null;
        return payload.id as string;
    } catch {
        return null;
    }
}

export const GET = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
        const business = await prisma.business.findFirst({
            where: { ownerId },
            select: { id: true }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        const appointments = await prisma.appointment.findMany({
            where: { businessId: business.id },
            include: {
                customer: { select: { name: true, email: true } },
                service: { select: { name: true, price: true } }
            },
            orderBy: { startTime: "desc" },
            take: limit
        });

        const serializedAppointments = appointments.map(app => ({
            ...app,
            service: {
                ...app.service,
                price: Number(app.service.price)
            }
        }));

        return NextResponse.json({ appointments: serializedAppointments });
    } catch (error) {
        console.error("Fetch appointments error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { appointmentId, status } = body;

        if (!appointmentId || !status) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Verify the appointment belongs to a business owned by this owner
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                business: { ownerId }
            }
        });

        if (!appointment) {
            return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
        }

        // Logic for automatic revenue generation
        if (status === 'COMPLETED' && appointment.status !== 'COMPLETED') {
            // Fetch service details for the price
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
                        where: { id: appointmentId }, // Use appointmentId as Order ID to link them and prevent duplicates
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
                return NextResponse.json({ message: "Appointment completed and revenue recorded." });
            }
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });

        return NextResponse.json(updatedAppointment);
    } catch (error) {
        console.error("Update appointment error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
