import { getAuthUser } from "@/Tools/getAuthUser";
import prisma from "@/Tools/db";
import { NextRequest, NextResponse } from "next/server";
async function getOwnerId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;
    return authUser.id;
}

export const POST = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { remindersEnabled, marketingAutomation } = body;

        const business = await prisma.business.findFirst({
            where: { ownerId },
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        const updatedBusiness = await prisma.business.update({
            where: { id: business.id },
            data: {
                remindersEnabled: remindersEnabled !== undefined ? remindersEnabled : business.remindersEnabled,
                marketingAutomation: marketingAutomation !== undefined ? marketingAutomation : business.marketingAutomation,
            },
        });

        return NextResponse.json(updatedBusiness);
    } catch (error) {
        console.error("Update automation error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
