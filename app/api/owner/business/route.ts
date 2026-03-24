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
                // defaultLanguage: true,
                _count: {
                    select: {
                        services: true,
                        members: true,
                        appointments: true
                    }
                }
            }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        return NextResponse.json(business);
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
                // defaultLanguage
            }
        });

        return NextResponse.json({ message: "Success", business: updated });
    } catch (error) {
        console.error("Update business error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
