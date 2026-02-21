import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";
import bcrypt from "bcrypt";

async function getUserId(req: NextRequest) {
    const token = req.cookies.get("myplatform_token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
        const { payload } = await jwtVerify(token, secret);
        return payload.id as string;
    } catch {
        return null;
    }
}

export const POST = async (req: NextRequest) => {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });

        if (!user || !user.password) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Current password incorrect" }, { status: 401 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
