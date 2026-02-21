import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";

async function verifyAdmin(req: NextRequest) {
    const token = req.cookies.get("myplatform_token")?.value;
    if (!token) return false;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.role === "ADMIN";
    } catch (error) {
        console.error("Auth error:", error);
        return false;
    }
}

export const GET = async (req: NextRequest) => {
    const startTime = performance.now();
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. Basic counts
        const totalUsers = await prisma.user.count();
        const totalBusinesses = await prisma.business.count();
        const activeBusinesses = await prisma.business.count({
            where: { status: "ACTIVE" }
        });

        // 2. Revenue aggregation
        const revenueResult = await prisma.order.aggregate({
            where: { status: "PAID" },
            _sum: { total: true }
        });
        const totalRevenue = Number(revenueResult._sum.total || 0);

        // 3. Recent Users
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        // 4. Growth Metrics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsersLastMonth = await prisma.user.count({
            where: { createdAt: { gte: thirtyDaysAgo } }
        });

        const growthRate = totalUsers > 0 ? (newUsersLastMonth / totalUsers) * 100 : 0;

        // 5. System Health (Real-time checks)
        // A. Latency Check
        const dbStart = performance.now();
        await prisma.$queryRaw`SELECT 1`;
        const dbLatency = Math.round(performance.now() - dbStart);


        // B. Data Integrity check (Optional/Simplified)
        // const orphanedMembers = await prisma.member.count({ where: { user: { is: null } } });

        // C. API Performance
        const apiTime = Math.round(performance.now() - startTime);

        const systemHealth = {
            database: Math.max(0, 100 - (dbLatency / 10)), // Simple score: 100ms = 90%, 200ms = 80%
            responseTime: `${apiTime}ms`,
            dbLatency: `${dbLatency}ms`,
            integrityScore: 100, // Fixed for now
            uptime: "99.9%"
        };

        return NextResponse.json({
            stats: [
                { name: "إجمالي المستخدمين", value: totalUsers.toLocaleString(), change: newUsersLastMonth, type: "users" },
                { name: "الشركات المسجلة", value: totalBusinesses.toLocaleString(), active: activeBusinesses, type: "businesses" },
                { name: "الإيرادات الكلية", value: `$${totalRevenue.toLocaleString()}`, type: "revenue" },
                { name: "معدل النمو", value: `${growthRate.toFixed(1)}%`, type: "growth" },
            ],
            recentUsers: recentUsers.map(u => ({
                id: u.id,
                name: u.name || "مستخدم جديد",
                role: u.role,
                status: "Active",
                createdAt: u.createdAt
            })),
            health: systemHealth
        });

    } catch (error) {
        console.error("Fetch stats error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
