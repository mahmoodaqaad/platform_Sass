import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";

// Helper to verify admin role
async function verifyAdmin(req: NextRequest) {
    const token = req.cookies.get("myplatform_token")?.value;
    if (!token) return false;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.role === "ADMIN";
    } catch (error) {
        console.error("Auth error:", error);
        return false;
    }
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
                        members: {
                            where: {
                                role: "STAFF"
                            }
                        }
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
            status: b.status || "يعمل",
            createdAt: b.createdAt
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
        const { id, name, slug, status } = await req.json();

        if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

        const updated = await prisma.business.update({
            where: { id },
            data: {
                name,
                slug,
                // status // REMOVED: status is missing from current Prisma client
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
        const { name, slug, ownerEmail } = await req.json();

        if (!name || !slug || !ownerEmail) {
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
                    // status: "يعمل" // REMOVED: status is missing from current Prisma client
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

        // Use transaction to delete related records if necessary, 
        // or rely on cascade delete if configured in schema.
        await prisma.business.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Business deleted successfully" });
    } catch (error) {
        console.error("Delete business error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
