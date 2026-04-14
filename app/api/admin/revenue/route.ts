import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { startOfMonth, subMonths, endOfMonth, format } from "date-fns";
import { getAuthUser } from "@/Tools/getAuthUser";

async function verifyAdmin(req: NextRequest) {
    const authUser = await getAuthUser(req);
    return authUser?.role === "ADMIN";
}

export const GET = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const sixMonthsAgo = startOfMonth(subMonths(now, 5));

        // 1. Calculate GMV (Total of all PAID orders)
        const gmvResult = await prisma.order.aggregate({
            where: { status: "PAID" },
            _sum: { total: true }
        });
        const totalGMV = Number(gmvResult._sum.total || 0);

        // 2. Calculate MRR (Estimated based on subscription plans)
        // Plan Prices from lib/stripe.ts
        const planPrices: Record<string, number> = {
            'BASIC': 29.99,
            'PRO': 49.99,
            'BUSINESS': 79.99,
            'ENTERPRISE': 199.99
        };

        const businesses = await prisma.business.findMany({
            where: { status: "ACTIVE" },
            select: { plan: true }
        });

        const estimatedMRR = businesses.reduce((sum, b) => {
            return sum + (planPrices[b.plan] || 0);
        }, 0);

        // 3. Monthly Trends (GMV and estimated Subscriptions)
        // For a real production app, we would have a 'Transaction' or 'SubscriptionPayment' table.
        // Here we simulate trends based on order creation dates for GMV.
        const monthlyData = [];
        for (let i = 0; i < 6; i++) {
            const monthStart = startOfMonth(subMonths(now, 5 - i));
            const monthEnd = endOfMonth(monthStart);

            const monthGMV = await prisma.order.aggregate({
                where: {
                    status: "PAID",
                    createdAt: { gte: monthStart, lte: monthEnd }
                },
                _sum: { total: true }
            });

            // For subscriptions, we simulate growth based on business count at that time
            const businessCountAtTime = await prisma.business.count({
                where: {
                    createdAt: { lte: monthEnd },
                    status: "ACTIVE"
                }
            });
            // Approximate MRR for that month
            const monthMRR = businessCountAtTime * 35; // Rough average

            monthlyData.push({
                month: format(monthStart, 'MMM'),
                gmv: Number(monthGMV._sum.total || 0),
                subscriptions: monthMRR
            });
        }

        // 4. Top Businesses by GMV
        const topBusinessesRaw = await prisma.order.groupBy({
            by: ['businessId'],
            where: { status: "PAID" },
            _sum: { total: true },
            orderBy: { _sum: { total: 'desc' } },
            take: 5
        });

        const topBusinesses = await Promise.all(topBusinessesRaw.map(async (item) => {
            const biz = await prisma.business.findUnique({
                where: { id: item.businessId },
                select: { name: true, logo: true, plan: true }
            });
            return {
                name: biz?.name || "Unknown",
                logo: biz?.logo,
                plan: biz?.plan,
                volume: Number(item._sum.total || 0)
            };
        }));

        // 5. Recent Activity (New Businesses)
        const recentActivity = await prisma.business.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                plan: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            summary: {
                totalGMV,
                estimatedMRR,
                activeSubs: businesses.length,
            },
            trends: monthlyData,
            topBusinesses,
            recentActivity
        });

    } catch (error) {
        console.error("Admin revenue error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
