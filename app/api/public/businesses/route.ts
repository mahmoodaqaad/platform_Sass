import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";


export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const type = searchParams.get("type") || "";

        const where: any = {
            status: "ACTIVE",
            planActive: true,
        };

        if (query) {
            where.OR = [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ];
        }

        if (type && type !== "ALL") {
            where.type = type;
        }

        const businesses = await prisma.business.findMany({
            where,
            select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                description: true,
                logo: true,
                address: true,
                plan: true,
                // defaultLanguage: true,
                createdAt: true,
            },
            orderBy: [
                { createdAt: "desc" }
            ]
        });

        // Manual sorting for plan priority
        const planPriority: Record<string, number> = {
            "BUSINESS": 3,
            "PRO": 2,
            "BASIC": 1,
            "ENTERPRISE": 0
        };

        const sortedBusinesses = [...businesses].sort((a, b) => {
            const priorityA = planPriority[a.plan as string] || 0;
            const priorityB = planPriority[b.plan as string] || 0;
            if (priorityA !== priorityB) {
                return priorityB - priorityA;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return NextResponse.json(sortedBusinesses);
    } catch (error) {
        console.error("Fetch public businesses error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
