import { getAuthUser } from "@/Tools/getAuthUser";
import prisma from "@/Tools/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
// Helper to get owner ID
async function getOwnerId(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "OWNER" && authUser.role !== "ADMIN")) return null;
    return authUser.id;
}

// Helper to verify owner and get their business
async function getOwnerBusinessById(ownerId: string) {
    return await prisma.business.findFirst({
        where: { ownerId }
    });
}

// GET - Fetch all staff for the owner's business
export const GET = async (req: NextRequest) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const business = await getOwnerBusinessById(ownerId);
    if (!business) return NextResponse.json({ message: "No business found" }, { status: 404 });

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
    const ownerId = await getOwnerId(req);
    if (!ownerId) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    const business = await prisma.business.findFirst({
        where: { ownerId },
        include: { _count: { select: { members: true } } }
    });

    if (!business) return NextResponse.json({ message: "لم يتم العثور على مشروع خاص بك" }, { status: 404 });

    try {
        const { name, email, password } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ message: "يرجى إدخال جميع البيانات المطلوبة" }, { status: 400 });
        }

        // Check plan limits
        const settings = await prisma.globalSettings.findUnique({ where: { id: "global" } });
        const plan = business.plan || "BASIC";
        const tiers: Record<string, { services: number; members: number; appointments: number }> = (settings?.tiersConfig as any) || {
            BASIC: { services: 2, members: 1, appointments: 50 },
            PRO: { services: 10, members: 5, appointments: 500 },
            BUSINESS: { services: 50, members: 20, appointments: 2000 },
            ENTERPRISE: { services: 999, members: 999, appointments: 9999 }
        };

        const limit = tiers[plan]?.members || 1;
        if (business._count.members >= limit + 1) {
            return NextResponse.json({
                message: `لقد وصلت للحد الأقصى من الموظفين المتاح في باقة ${plan} (${limit} موظفين). يرجى ترقية الباقة لإضافة المزيد.`
            }, { status: 403 });
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

export const DELETE = async (req: NextRequest) => {


    try {
        const ownerId = await getOwnerId(req)
        if (!ownerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const business = await getOwnerBusinessById(ownerId)
        if (!business) return NextResponse.json({ message: "No business found" }, { status: 404 });
        const { searchParams } = new URL(req.url);

        const staffId = searchParams.get("staffId")
        if (!staffId) return NextResponse.json({ message: "No staff id found" }, { status: 404 });
        const member = await prisma.member.findFirst({
            where: {
                userId: staffId,
                businessId: business.id
            }
        });

        if (!member) {
            return NextResponse.json({ staffId, businessId: business.id });
        }
        await prisma.member.delete({
            where: {
                userId_businessId: {
                    userId: staffId,
                    businessId: business.id
                }
            }
        });

        return NextResponse.json({ message: "delete staff successfully" });
    } catch (error) {
        console.log(error);

    }
}