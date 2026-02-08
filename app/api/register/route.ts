
import { prisma } from "@/Tools/db"
import { RegisterDto } from "@/Tools/Dto"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { setCookie } from "@/Tools/generateToken"

export const POST = async (req: NextRequest) => {
    try {
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

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER" // All new signups are standard users until they create a business
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        })

        const cookie = await setCookie({
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,
        })

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

// export const GET = async () => {
//     try {
//         const users = await Prisma.user.findMany()
//         return NextResponse.json({ users }, { status: 200 })
//     } catch (error) {
//         console.error("Fetch users error:", error)
//         return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
//     }
// }