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
            select: { templateId: true, themeColor: true }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        return NextResponse.json(business);
    } catch (error) {
        console.error("Website API GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { templateId, themeColor } = await req.json();

        const business = await prisma.business.findFirst({
            where: { ownerId },
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });
        const updatedBusiness = await prisma.business.update({
            where: { id: business.id },
            data: { templateId, themeColor }
        });
        NextResponse.json("dsdsd", { status: 200 })

        return NextResponse.json({ templateId: updatedBusiness.templateId, themeColor: updatedBusiness.themeColor });
    } catch (error) {
        console.error("Website API PUT error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
