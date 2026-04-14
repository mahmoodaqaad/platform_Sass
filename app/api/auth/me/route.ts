import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/Tools/getAuthUser";
import prisma from "@/Tools/db";

export const GET = async (req: NextRequest) => {
    try {
        const authUser = await getAuthUser(req);

        if (!authUser) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }
        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { image: true }
        });
        if (!user) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }
        return NextResponse.json({
            authenticated: true,
            user: {
                id: authUser.id,
                name: authUser.name,
                email: authUser.email,
                role: authUser.role,
                image: user.image,
            }
        });
    } catch (error) {
        console.error("Auth me error:", error);
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }
};
