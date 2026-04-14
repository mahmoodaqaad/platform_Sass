import prisma from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";
import { NextRequest, NextResponse } from "next/server";
async function getOwnerId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;
    return authUser.id;
}

export const GET = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let isAccountIsGoogle = false
    try {
        const business = await prisma.business.findFirst({
            where: { ownerId },
            select: {
                id: true,
                name: true,
                slug: true,
                plan: true,
                address: true,
                phone: true,
                logo: true,
                description: true,
                planActive: true,
                subscriptionStart: true,
                subscriptionEnd: true,
                remindersEnabled: true,
                marketingAutomation: true,
                status: true,
                type: true,

                defaultLanguage: true,
                _count: {
                    select: {
                        services: true,
                        members: true,
                        appointments: true
                    }
                }
            }
        });
        const existPassword = await prisma.user.findUnique({
            where: { id: ownerId },
            select: { password: true }
        });
        const account = await prisma.account.findFirst({
            where: { userId: ownerId },
            select: { provider: true }
        });
        if (account) {
            isAccountIsGoogle = true
        }
        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        return NextResponse.json({ ...business, isAccountIsGoogle: !existPassword?.password && isAccountIsGoogle });
    } catch (error) {
        console.error("Fetch owner business error:", error);

        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        const { name, description, address, phone, slug, logo, remindersEnabled, marketingAutomation, defaultLanguage } = data;

        const business = await prisma.business.findFirst({
            where: { ownerId }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        const isSlugExist = await prisma.business.findFirst({ where: { slug, NOT: { id: business.id } } })
        if (isSlugExist) return NextResponse.json({ message: "هذا الرابط مستخدم " }, { status: 400 });

        const updated = await prisma.business.update({
            where: { id: business.id },
            data: {
                name,
                description,
                address,
                phone,
                slug,
                logo,
                remindersEnabled,
                marketingAutomation,
                defaultLanguage
            }
        });

        return NextResponse.json({ message: "Success", business: updated });
    } catch (error) {
        console.error("Update business error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
