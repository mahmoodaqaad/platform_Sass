import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import prisma from "@/Tools/db";
import { JwtPayload } from "@/Tools/Types";
import { setCookie } from "@/Tools/generateToken";

export const POST = async (req: NextRequest) => {


    try {
        const { code } = await req.json()

        if (!code) return NextResponse.json({ message: "code is not defined" }, { status: 404 })
        const cookie = await cookies()

        const token = req.cookies.get("otp_code")?.value
        if (!token) return NextResponse.json({ message: "Token is not exist" }, { status: 404 })
        const decoded = await jwt.verify(token, process?.env?.JWT_SECRET!) as JwtPayload
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },

        })
        if (!user) {
            return NextResponse.json(
                { message: "user is not exist" },
                { status: 404 }
            );
        }
        if (user.verifyCode !== code) {
            return NextResponse.json({
                message: "code is not correct"
            }, { status: 400 })
        }
        if (user.verifyExpire < new Date()) {
            return NextResponse.json({
                message: "code is expired"
            }, { status: 400 })
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verifyCode: null,
                verifyExpire: null,
            }
        })
        const newcookie = await setCookie({
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,

        })
        cookie.delete("otp_code")

        return NextResponse.json({
            message: "code is correct"
        }, {
            status: 200,
            headers: { "Set-Cookie": newcookie }

        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "خطأ في التحقق" },
            { status: 500 }
        );
    }
}