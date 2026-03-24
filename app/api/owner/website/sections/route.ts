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

// Helper: parse settings string to object safely
function parseSettings(raw: string | null | undefined): Record<string, unknown> {
    if (!raw) return {};
    try { return raw } catch { return {}; }
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

        const sections = await prisma.businessSection.findMany({
            where: { businessId: business.id },
            orderBy: { order: 'asc' }
        });

        // Parse settings string back to object for each section
        const parsed = sections.map(s => ({
            ...s,
            settings: parseSettings(s.settings)
        }));

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Website Sections API GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { type, title, content, images, order, isActive, settings } = await req.json();

        const business = await prisma.business.findFirst({
            where: { ownerId },
            select: { id: true }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        // Check if section already exists with this type
        let section = type
            ? await prisma.businessSection.findFirst({
                where: { businessId: business.id, type }
            })
            : null;

        if (!section) {
            section = await prisma.businessSection.create({
                data: {
                    businessId: business.id,
                    type: type || "HERO",
                    title: title || `New ${type || "HERO"} Section`,
                    content: content || "",
                    images: Array.isArray(images) ? images : [],
                    order: Number(order) || 0,
                    isActive: isActive !== false,
                    settings: settings ? settings : {}
                }
            });
        }

        return NextResponse.json({
            ...section,
            settings: parseSettings(section.settings)
        });
    } catch (error: unknown) {
        const err = error as { message?: string; code?: string; stack?: string };
        console.error("Website Sections API POST error:", err.message);
        return NextResponse.json({
            message: "Internal server error",
            error: err.message
        }, { status: 500 });
    }
};
