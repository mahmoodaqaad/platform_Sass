import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";
import bcrypt from "bcrypt";

// Helper to verify owner and get their business
async function getOwnerBusiness(req: NextRequest) {
    const token = req.cookies.get("myplatform_token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "OWNER") return null;

        const business = await prisma.business.findFirst({
            where: { ownerId: payload.id as string }
        });
        return business;
    } catch (error) {
        console.error("Owner verify error:", error);
        return null;
    }
}

// GET - Fetch all staff for the owner's business
export const GET = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const staffMembers = await prisma.member.findMany({
            where: {
                businessId: business.id,
                role: "STAFF"
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true, createdAt: true }
                }
            }
        });

        const formattedStaff = staffMembers.map(m => ({
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            createdAt: m.user.createdAt,
            memberId: m.id
        }));

        return NextResponse.json(formattedStaff);
    } catch (error) {
        console.error("Fetch staff error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// POST - Add a new staff member
export const POST = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    try {
        const { name, email, password } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ message: "يرجى إدخال جميع البيانات المطلوبة" }, { status: 400 });
        }

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            if (!password) {
                return NextResponse.json({ message: "يرجى إدخال كلمة مرور للموظف الجديد" }, { status: 400 });
            }
            // Create new user with role STAFF
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "STAFF"
                }
            });
        }

        // Check if already a member in THIS business
        const existingMember = await prisma.member.findUnique({
            where: {
                userId_businessId: {
                    userId: user.id,
                    businessId: business.id
                }
            }
        });

        if (existingMember) {
            return NextResponse.json({ message: "هذا المستخدم موظف بالفعل في مشروعك" }, { status: 400 });
        }

        // Create membership
        await prisma.member.create({
            data: {
                userId: user.id,
                businessId: business.id,
                role: "STAFF"
            }
        });

        return NextResponse.json({ message: "تم إضافة الموظف بنجاح", user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
    } catch (error) {
        console.error("Add staff error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء إضافة الموظف، يرجى المحاولة لاحقاً" }, { status: 500 });
    }
};
