import prisma from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";
import { NextRequest, NextResponse } from "next/server";

// Helper to verify admin role
async function verifyAdmin(req: NextRequest) {
    const authUser = await getAuthUser(req);
    return authUser?.role === "ADMIN";
}

// GET - Fetch all businesses
export const GET = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const businesses = await prisma.business.findMany({
            include: {

                owner: {
                    select: { name: true, email: true }
                },
                _count: {
                    select: {
                        members: { where: { role: "STAFF" } },
                        services: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        // Format for UI
        const formatted = businesses.map(b => ({
            id: b.id,
            name: b.name,
            slug: b.slug,
            ownerName: b.owner.name,
            ownerEmail: b.owner.email, 
            staffCount: b._count.members,
            serviceCount: b._count.services,
            plan: b.plan,
            planActive: b.planActive,
            subscriptionStart: b.subscriptionStart,
            subscriptionEnd: b.subscriptionEnd,
            status: b.status || "ACTIVE",
            logo: b.logo,
            createdAt: b.createdAt,
            type: b.type,
            description: b.description,
            address: b.address,
            phone: b.phone,
            allpaied: Number(b.AllPaied)
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Fetch businesses error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// PUT - Update business details
export const PUT = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, name, slug, status, type, description, address, phone, logo } = await req.json();

        if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });
        const isSlugExist = await prisma.business.findFirst({ where: { slug, id: { not: id } } })
        if (isSlugExist) return NextResponse.json({ message: "هذا الرابط مستخدم " }, { status: 400 });

        const updated = await prisma.business.update({
            where: { id },
            data: {
                name,
                slug,
                status,
                type, description, address, phone,
                logo,
            }
        });

        return NextResponse.json({ message: "Business updated successfully", business: updated });
    } catch (error) {
        console.error("Update business error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// POST - Create a new business
export const POST = async (req: NextRequest) => {

    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, slug, ownerEmail, type, description, address, phone, logo, numMonth, plan } = await req.json();

        if (!name || !slug || !ownerEmail || !type || !description || !address || !phone || !numMonth || !plan) {
            return NextResponse.json({ message: "جميع الحقول مطلوبة" }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email: ownerEmail } });
        if (!user) {
            return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
        }

        // Check if slug is taken
        const existingSlug = await prisma.business.findUnique({ where: { slug } });
        if (existingSlug) {
            return NextResponse.json({ message: "هذا الرابط (Slug) مستخدم بالفعل" }, { status: 400 });
        }
        const newEndDate = new Date()
        newEndDate.setDate(newEndDate.getDate() + (30 * Number(numMonth)))
        // return NextResponse.json(newEndDate)

        const newBusiness = await prisma.$transaction(async (tx) => {
            // Update user role to OWNER if it's not already
            if (user.role !== "OWNER" && user.role !== "ADMIN") {
                await tx.user.update({
                    where: { id: user.id },
                    data: { role: "OWNER" }
                });
            }

            const biz = await tx.business.create({
                data: {
                    name,
                    slug,
                    ownerId: user.id,
                    type, description, address, phone,
                    logo,
                    subscriptionEnd: newEndDate,
                    plan,

                }
            });

            await tx.member.create({
                data: {
                    userId: user.id,
                    businessId: biz.id,
                    role: "OWNER"
                }
            });

            return biz;
        });

        return NextResponse.json({ message: "تم إنشاء العمل بنجاح", business: newBusiness }, { status: 201 });
    } catch (error) {
        console.error("Create business error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// DELETE - Remove a business
export const DELETE = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await req.json();
        //  re   NextResponse.json({id})

        await prisma.business.delete({
            where: { id }
        });


        return NextResponse.json({ message: "Business deleted successfully" });
    } catch (error) {
        console.error("Delete business error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
