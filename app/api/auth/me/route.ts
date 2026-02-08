import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("myplatform_token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
        const { payload } = await jwtVerify(token, secret);

        return NextResponse.json({
            authenticated: true,
            user: {
                id: payload.id,
                name: payload.name,
                email: payload.email,
                role: payload.role,
            }
        });
    } catch (error) {
        console.error("Auth me error:", error);
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }
};
