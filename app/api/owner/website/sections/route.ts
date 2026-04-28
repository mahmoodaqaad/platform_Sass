import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";

async function getOwnerId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;
    return authUser.id;
}

// Helper: parse settings string to object safely
function parseSettings(raw: any): Record<string, any> {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch { return {}; }
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
                    settings: settings !== undefined 
                        ? (typeof settings === 'object' ? JSON.stringify(settings) : settings) 
                        : "{}"
                }
            });
        }

        return NextResponse.json({
            ...section,
            settings: parseSettings(section.settings)
        });
    } catch (error: any) {
        console.error("Website Sections API POST error:", error.message);
        return NextResponse.json({
            message: "Internal server error",
            error: error.message
        }, { status: 500 });
    }
};
