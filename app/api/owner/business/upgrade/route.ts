import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";

async function getOwnerId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;
    return authUser.id;
}

export const POST = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { plan, duration, paidAmount } = await req.json();

        const business = await prisma.business.findFirst({
            where: { ownerId }
        });

        if (!business) return NextResponse.json({ message: "Business not found" }, { status: 404 });

        // Calculate new subscription end date
        // If they are upgrading, we typically reset the cycle or extend it.
        // For simplicity here: reset cycle to 'now' + duration months.
        const months = parseInt(duration) || 1;
        const subscriptionStart = new Date();
        const subscriptionEnd = new Date();
        subscriptionEnd.setDate(subscriptionEnd.getDate() + (30 * months));

        const updatedBusiness = await prisma.business.update({
            where: { id: business.id },
            data: {
                plan,
                planActive: true,
                subscriptionStart,
                subscriptionEnd,
                AllPaied: {
                    increment: paidAmount
                }
            }
        });

        return NextResponse.json({ message: "Upgrade successful", business: updatedBusiness });
    } catch (error) {
        console.error("Upgrade error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
