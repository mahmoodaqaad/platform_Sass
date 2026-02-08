import { prisma } from "@/Tools/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/Tools/Types";

export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("myplatform_token")?.value;
        if (!token) return NextResponse.json({ message: "لا غير مصرح لك بالوصول لا يوجد عمل خاص بك" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        // Find business owned by this user
        const business = await prisma.business.findFirst({
            where: { ownerId: decoded.id },
            include: { services: { orderBy: { createdAt: 'desc' } } }
        });

        if (!business) return NextResponse.json({ message: "لم يتم العثور على مشروع خاص بك" }, { status: 404 });

        return NextResponse.json({ services: business.services });
    } catch (error) {
        return NextResponse.json({ message: "حدث خطأ أثناء تحميل الخدمات" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("myplatform_token")?.value;
        if (!token) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const body = await req.json();
        const { name, description, duration, price } = body;

        if (!name || !duration || !price) {
            return NextResponse.json({ message: "يرجى إدخال اسم الخدمة، المدة، والسعر" }, { status: 400 });
        }

        const business = await prisma.business.findFirst({
            where: { ownerId: decoded.id }
        });

        if (!business) return NextResponse.json({ message: "لم يتم العثور على مشروع خاص بك" }, { status: 404 });

        const service = await prisma.service.create({
            data: {
                name,
                description: description || "",
                duration: parseInt(duration),
                price: parseFloat(price),
                businessId: business.id
            }
        });

        return NextResponse.json({ message: "تم إضافة الخدمة بنجاح!", service }, { status: 201 });
    } catch (error) {
        console.error("Add service error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء إضافة الخدمة، تأكد من صحة البيانات" }, { status: 500 });
    }
}
