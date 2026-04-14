import prisma from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";
import { NextRequest, NextResponse } from "next/server";

async function verifyAdmin(req: NextRequest) {
    const authUser = await getAuthUser(req);
    return authUser?.role === "ADMIN";
}

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const business = await prisma.business.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { name: true, email: true }
                },
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
        console.error("Fetch admin business detail error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
