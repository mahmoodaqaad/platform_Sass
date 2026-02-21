import { prisma } from "@/Tools/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/Tools/Types";

export const POST = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("myplatform_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userId = decoded.id;

        const body = await req.json();
        const { name, slug, type, description, address, phone, plan, duration, AllPaied } = body;

        if (!name || !slug || !type || !address || !phone) {
            return NextResponse.json({ message: "يرجى ملء البيانات الأساسية" }, { status: 400 });
        }

        // Calculate subscription dates
        const months = parseInt(duration) || 1;
        const subscriptionStart = new Date();
        const subscriptionEnd = new Date();
        subscriptionEnd.setDate(subscriptionEnd.getDate() + (30 * months));

        // Check if slug exists
        const slugExist = await prisma.business.findUnique({ where: { slug } });
        if (slugExist) {
            return NextResponse.json({ message: "هذا الرابط مستخدم بالفعل، اختر رابطاً آخر" }, { status: 400 });
        }

        // Create Business and Member entry
        const business = await prisma.$transaction(async (tx) => {
            const newBusiness = await tx.business.create({
                data: {
                    name,
                    slug,
                    type,
                    description,
                    ownerId: userId,
                    plan: plan || "BASIC",
                    planActive: true,
                    address,
                    phone,
                    AllPaied,
                    subscriptionStart,
                    subscriptionEnd,

                }
            });
            await prisma.user.update({
                where: { id: userId }, data: {
                    role: "OWNER"
                }
            })
            await tx.member.create({
                data: {
                    userId,
                    businessId: newBusiness.id,
                    role: "OWNER"
                }
            });

            return newBusiness;
        });

        return NextResponse.json({
            message: "تم إنشاء عملك بنجاح!",
            business
        }, { status: 201 });

    } catch (error) {
        console.error("Business creation error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء إنشاء العمل" }, { status: 500 });
    }
}
