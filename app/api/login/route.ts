import { prisma } from "@/Tools/db";
import { LoginDtos } from "@/Tools/Dto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { setCookie } from "@/Tools/generateToken";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json() as LoginDtos
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
            }
        })

        if (!user || !user.password) {
            return NextResponse.json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
        }

        const cookie = await setCookie({
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,
        })

        return NextResponse.json({
            message: "تم تسجيل الدخول بنجاح",
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        }, {
            status: 200,
            headers: { "Set-Cookie": cookie }
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ message: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 })
    }
}