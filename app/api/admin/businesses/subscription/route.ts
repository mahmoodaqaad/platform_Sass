import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";

async function verifyAdmin(req: NextRequest) {
    const token = req.cookies.get("myplatform_token")?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.role === "ADMIN";
    } catch {
        return false;
    }
}

export const POST = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { businessId, monthsToAdd } = await req.json();

        if (!businessId || !monthsToAdd) {
            return NextResponse.json({ message: "بيانات ناقصة" }, { status: 400 });
        }

        const business = await prisma.business.findUnique({
            where: { id: businessId }
        });

        if (!business) {
            return NextResponse.json({ message: "المشروع غير موجود" }, { status: 404 });
        }

        let newEndDate = new Date(business.subscriptionEnd || new Date());
        // If it was already expired or never set, start from now
        if (newEndDate < new Date()) {
            newEndDate = new Date();
        }

        newEndDate.setDate(newEndDate.getDate() + (30 * parseInt(monthsToAdd)));

        await prisma.business.update({
            where: { id: businessId },
            data: {
                subscriptionEnd: newEndDate,
                planActive: true
            }
        });

        return NextResponse.json({
            message: "تم تمديد الاشتراك بنجاح",
            newEndDate: newEndDate
        });

    } catch (error) {
        console.error("Subscription extension error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
