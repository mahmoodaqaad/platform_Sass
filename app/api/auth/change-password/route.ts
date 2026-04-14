import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import bcrypt from "bcrypt";
import { getAuthUser } from "@/Tools/getAuthUser";

async function getUserId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    return authUser ? authUser.id : null;
}

export const POST = async (req: NextRequest) => {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { accept, currentPassword, newPassword } = await req.json();
        if (accept !== 304) {
            if ((!currentPassword || !newPassword)) {
                return NextResponse.json({ message: "Missing fields" }, { status: 400 });
            }
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });
        if (accept !== 304) {

            if (!user || !user.password) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
        }
        if (accept !== 304) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid && accept != 304) {
                return NextResponse.json({ message: "Current password incorrect" }, { status: 401 });
            }
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
