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

export const GET = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: { email: true, name: true }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Fetch user emails error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
