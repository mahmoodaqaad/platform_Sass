import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { startOfMonth, endOfMonth, subMonths, eachMonthOfInterval, format } from "date-fns";
import { getAuthUser } from "@/Tools/getAuthUser";

async function getOwnerId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;
    return authUser.id;
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
        const sixMonthsAgo = subMonths(now, 5);

        // 1. Monthly Revenue for Chart (Last 6 Months)
        const orders = await prisma.order.findMany({
            where: {
                businessId,
                status: "PAID",
                createdAt: { gte: startOfMonth(sixMonthsAgo) }
            },
            select: { total: true, createdAt: true }
        });

        const monthlyData = eachMonthOfInterval({
            start: sixMonthsAgo,
            end: now
        }).map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            const revenue = orders
                .filter(o => o.createdAt >= monthStart && o.createdAt <= monthEnd)
                .reduce((sum, o) => sum + Number(o.total), 0);

            return {
                month: format(month, "MMM"),
                revenue
            };
        });

        // 2. Summary Stats
        const currentMonthRevenue = monthlyData[monthlyData.length - 1].revenue;
        const lastMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0;

        const totalOrders = await prisma.order.count({ where: { businessId, status: "PAID" } });
        const allTimeRevenue = await prisma.order.aggregate({
            where: { businessId, status: "PAID" },
            _sum: { total: true }
        });

        // 3. Recent Transactions
        const recentTransactions = await prisma.order.findMany({
            where: { businessId, status: "PAID" },
            include: {
                customer: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 10
        });

        // 4. Calculate Top Services (Heuristic: Since we don't have OrderItems yet, we could potentially look at most frequent amounts if they match service prices, 
        // but better to just use Appointment data for service-level revenue as a source of truth)
        const serviceStats = await prisma.appointment.groupBy({
            by: ["serviceId"],
            where: { businessId, status: "COMPLETED" },
            _count: { id: true }
        });

        const services = await prisma.service.findMany({
            where: { id: { in: serviceStats.map(s => s.serviceId) } }
        });

        const topServices = serviceStats.map(s => {
            const service = services.find(srv => srv.id === s.serviceId);
            return {
                name: service?.name || "Unknown",
                revenue: (service?.price ? Number(service.price) : 0) * s._count.id,
                count: s._count.id
            };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        return NextResponse.json({
            monthlyData,
            stats: {
                totalRevenue: Number(allTimeRevenue._sum.total || 0),
                currentMonthRevenue,
                totalOrders,
                averageOrder: totalOrders > 0 ? Number(allTimeRevenue._sum.total || 0) / totalOrders : 0,
                growth: lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0
            },
            recentTransactions: recentTransactions.map(t => ({
                id: t.id,
                customer: t.customer?.name || "Walk-in",
                amount: Number(t.total),
                date: t.createdAt,
                status: t.status
            })),
            topServices
        });

    } catch (error) {
        console.error("Revenue API error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
