import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";

async function getOwnerId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;
    return authUser.id;
}

function parseSettings(raw: string | null | undefined): Record<string, unknown> {
    if (!raw) return {};
    try { return raw; } catch { return {}; }
}

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    try {
        const { type, title, content, images, order, isActive, settings } = await req.json();

        const business = await prisma.business.findFirst({
            where: { ownerId },
            select: { id: true }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        const existingSection = await prisma.businessSection.findFirst({
            where: { id, businessId: business.id }
        });

        if (!existingSection) return NextResponse.json({ message: "Section not found or unauthorized" }, { status: 404 });

        const updatedSection = await prisma.businessSection.update({
            where: { id },
            data: {
                ...(type !== undefined && { type }),
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                ...(images !== undefined && { images }),
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive }),
                settings: settings !== undefined ? settings : undefined
            }
        });

        return NextResponse.json({
            ...updatedSection,
            settings: parseSettings(updatedSection.settings as string | null)
        });
    } catch (error) {
        console.error("Website Sections API PUT error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    try {
        const business = await prisma.business.findFirst({
            where: { ownerId },
            select: { id: true }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        const existingSection = await prisma.businessSection.findFirst({
            where: { id, businessId: business.id }
        });

        if (!existingSection) return NextResponse.json({ message: "Section not found or unauthorized" }, { status: 404 });

        await prisma.businessSection.delete({ where: { id } });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Website Sections API DELETE error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
