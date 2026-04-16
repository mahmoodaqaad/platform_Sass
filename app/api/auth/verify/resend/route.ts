import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import prisma from "@/Tools/db";
import { JwtPayload } from "@/Tools/Types";
import { sendOtp } from "@/lib/mailer";
import { setOTPCookie } from "@/Tools/generateToken";

export const POST = async (req: NextRequest) => {

    try {
        const token = req.cookies.get("otp_code")?.value
        if (!token) return NextResponse.json({ message: "Token is not exist" }, { status: 404 })
        const decoded = jwt.verify(token, process?.env?.JWT_SECRET!) as JwtPayload
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },

        })
        if (!user) return NextResponse.json({ message: "user is not exist" }, { status: 404 })
        const code = Math.floor(100000 + Math.random() * 900000).toString()


        await prisma.user.update({
            where: { id: decoded.id },
            data: {
                isVerified: false,
                verifyCode: code,
                verifyExpire: new Date(Date.now() + 10 * 60 * 1000),
            }

        })
        await sendOtp(user.email, code)
        const cookie = await setOTPCookie(user.email, user.id)


        return NextResponse.json({
            message: "code is sent successfully"
        }, {
            status: 200,
            headers: { "Set-Cookie": cookie }
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "resend error" },
            { status: 500 }
        );
    }



}