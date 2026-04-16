
import { prisma } from "@/Tools/db"
import { RegisterDto } from "@/Tools/Dto"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { setCookie, setOTPCookie } from "@/Tools/generateToken"
import { sendOtp, transporter } from "@/lib/mailer"
export const POST = async (req: NextRequest) => {
    try {
        // Check if registration is open
        const settings = await prisma.globalSettings.findUnique({
            where: { id: "global" }
        })

        if (settings && !settings.registrationOpen) {
            return NextResponse.json({
                message: "التسجيل مغلق حالياً من قبل الإدارة. يرجى المحاولة لاحقاً أو التواصل مع الدعم."
            }, { status: 403 })
        }

        const body = await req.json() as RegisterDto
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json({ message: "يرجى ملء جميع الحقول المطلوبة" }, { status: 400 })
        }

        const userExist = await prisma.user.findUnique({ where: { email } })
        if (userExist) {
            return NextResponse.json({ message: "هذا البريد الإلكتروني مسجل مسبقاً" }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const code = Math.floor(100000 + Math.random() * 900000).toString()

        await sendOtp(email, code)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
                verifyCode: code,
                verifyExpire: new Date(Date.now() + 10 * 60 * 1000),
                isVerified: false,

                // All new signups are standard users until they create a business
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,

            }
        })

        const cookie = await setOTPCookie(user.email, user.id)

        return NextResponse.json({
            message: "تم التسجيل بنجاح",
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        }, {
            status: 201,
            headers: { "Set-Cookie": cookie }
        })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 })
    }
}
