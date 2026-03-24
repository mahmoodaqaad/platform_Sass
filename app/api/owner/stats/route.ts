import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

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

    try {
        const business = await prisma.business.findFirst({
            where: { ownerId },
            select: { id: true }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        const businessId = business.id;
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        // 1. Revenue
        const currentRevenue = await prisma.order.aggregate({
            where: { businessId, createdAt: { gte: currentMonthStart, lte: currentMonthEnd }, status: "PAID" },
            _sum: { total: true }
        });
        const lastRevenue = await prisma.order.aggregate({
            where: { businessId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd }, status: "PAID" },
            _sum: { total: true }
        });

        // 2. Appointments
        const currentAppointments = await prisma.appointment.count({
            where: { businessId, createdAt: { gte: currentMonthStart, lte: currentMonthEnd } }
        });
        const lastAppointments = await prisma.appointment.count({
            where: { businessId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
        });

        // 3. Customers
        const currentCustomers = await prisma.customer.count({
            where: { businessId, createdAt: { gte: currentMonthStart, lte: currentMonthEnd } }
        });
        const lastCustomers = await prisma.customer.count({
            where: { businessId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
        });

        // 4. Pending Orders
        const pendingOrders = await prisma.appointment.count({
            where: { businessId, status: "PENDING" }
        });

        const calculateChange = (current: number, last: number) => {
            if (last === 0) return current > 0 ? "+100%" : "0%";
            const change = ((current - last) / last) * 100;
            return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
        };

        return NextResponse.json({
            revenue: {
                value: currentRevenue._sum.total?.toString() || "0",
                change: calculateChange(Number(currentRevenue._sum.total || 0), Number(lastRevenue._sum.total || 0)),
                trend: Number(currentRevenue._sum.total || 0) >= Number(lastRevenue._sum.total || 0) ? "up" : "down"
            },
            appointments: {
                value: currentAppointments,
                change: calculateChange(currentAppointments, lastAppointments),
                trend: currentAppointments >= lastAppointments ? "up" : "down"
            },
            customers: {
                value: currentCustomers,
                change: calculateChange(currentCustomers, lastCustomers),
                trend: currentCustomers >= lastCustomers ? "up" : "down"
            },
            pendingOrders: {
                value: pendingOrders,
                // For pending orders, we might just show the raw count and maybe a different type of trend
                change: "",
                trend: "neutral"
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
