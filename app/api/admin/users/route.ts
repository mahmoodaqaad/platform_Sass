import prisma from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
// Helper to verify admin role
async function verifyAdmin(req: NextRequest) {
    const authUser = await getAuthUser(req);
    return authUser?.role === "ADMIN";
}

// GET - Fetch all users
export const GET = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                ownedBusinesses: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        type: true,
                    }
                },
                memberships: {
                    include: {
                        business: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// POST - Create a new user (Admin only)
export const POST = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const { name, email, password, role, businessName, businessSlug, businessType, businessId } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return NextResponse.json({ message: "exist_user" }, { status: 400 })
        // let newUser;
        // if (existingUser) {
        //     // Upsert Behavior: Update existing user role
        //     newUser = await prisma.user.update({
        //         where: { email },
        //         data: { role },
        //         select: { id: true, name: true, email: true, role: true }
        //     });
        // } else {
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, role },
            select: { id: true, name: true, email: true, role: true }
        });
        // }

        // OWNER Case
        if (role === "OWNER") {
            const finalSlug = businessSlug || name.toLowerCase().trim().replace(/\s+/g, "_");
            const finalName = businessName || `${name} Business`;
            const finalType = businessType || "OTHER";

            // Validate Slug
            const existingBiz = await prisma.business.findUnique({ where: { slug: finalSlug } });
            if (existingBiz) {
                return NextResponse.json({
                    message: `تم ${existingUser ? 'تحديث' : 'إنشاء'} المستخدم، ولكن رابط العمل (Slug) مستخدم بالفعل. يرجى إنشاء العمل يدوياً.`,
                    user: newUser
                }, { status: 201 });
            }

            const ownerId = newUser.id;
            await prisma.$transaction(async (tx) => {
                // Check if user already has a business
                const hasBusiness = await tx.business.findFirst({ where: { ownerId } });
                if (!hasBusiness) {
                    const newBusiness = await tx.business.create({
                        data: {
                            name: finalName,
                            slug: finalSlug,
                            ownerId: ownerId,
                            type: finalType,
                            status: "ACTIVE"
                        }
                    });
                    await tx.member.create({
                        data: {
                            userId: ownerId,
                            businessId: newBusiness.id,
                            role: "OWNER"
                        }
                    });
                }
            });
        }
        // STAFF Case
        else if (role === "STAFF" && businessId) {
            const existingMember = await prisma.member.findFirst({
                where: { userId: newUser.id, businessId }
            });
            if (!existingMember) {
                await prisma.member.create({
                    data: { userId: newUser.id, businessId, role: "STAFF" }
                });
            }
        }

        return NextResponse.json({
            message: existingUser ? "تم تحديث بيانات المستخدم وتخصيص الصلاحيات" : "تم إنشاء المستخدم بنجاح",
            user: newUser
        }, { status: 201 });
    } catch (error) {
        console.error("Create/Upsert user error:", error);
        return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
    }
};

// PUT - Update user details (name, email, role)
export const PUT = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id, name, email, role, businessName, businessSlug, businessType, businessId } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email, NOT: { id: id } }, });
        if (existingUser) return NextResponse.json({ message: "this user already exist" }, { status: 400 })
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, role },
            select: { id: true, name: true, email: true, role: true }
        });

        // Automation: Create/Update business if role is OWNER
        if (role === "OWNER") {
            const existingBiz = await prisma.business.findFirst({ where: { ownerId: id } });

            const finalSlug = businessSlug || name.toLowerCase().trim().replace(/\s+/g, "_");
            const finalName = businessName || `${name} Business`;
            const finalType = businessType || "OTHER";
            if (!existingBiz) {
                // Check slug uniqueness
                const slugConflict = await prisma.business.findUnique({ where: { slug: finalSlug } });
                if (slugConflict) {
                    return NextResponse.json({
                        message: "تم تحديث المستخدم، ولكن رابط العمل (Slug) مستخدم بالفعل. يرجى إنشاء العمل يدوياً."
                    }, { status: 200 });
                }


                await prisma.$transaction(async (tx) => {

                    const newBusiness = await tx.business.create({
                        data: {
                            name: finalName,
                            slug: finalSlug,
                            ownerId: id,
                            type: finalType,
                            status: "ACTIVE"
                        }
                    });
                    await tx.member.create({
                        data: {
                            userId: id,
                            businessId: newBusiness.id,
                            role: "OWNER"
                        }
                    });
                });
            } else {
                // Update existing business
                await prisma.business.update({
                    where: { id: existingBiz.id },
                    data: {
                        name: finalName,
                        slug: finalSlug,
                        type: finalType
                    }
                });
            }
        }
        // STAFF Assignment
        else if (role === "STAFF" && businessId) {
            // Check if already a member of ANY business
            const currentMembership = await prisma.member.findFirst({
                where: { userId: id }
            });

            if (currentMembership) {
                // Update membership to new business
                await prisma.member.update({
                    where: { id: currentMembership.id },
                    data: { businessId, role: "STAFF" }
                });
            } else {
                // Create new membership
                await prisma.member.create({
                    data: { userId: id, businessId, role: "STAFF" }
                });
            }
        }

        return NextResponse.json({ message: "تم تحديث بيانات المستخدم بنجاح", user: updatedUser });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
    }
};

// PATCH - Update role only (Legacy/Simplified)
export const PATCH = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            include: { memberships: true }
        });

        // Automation: Create business if role is promoted to OWNER
        if (role === "OWNER") {
            const hasBusiness = await prisma.business.findFirst({ where: { ownerId: userId } });
            if (!hasBusiness) {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (user) {
                    const slug = user.name?.toLowerCase().trim().replace(/\s+/g, "_") || `business_${userId}`;
                    await prisma.$transaction(async (tx) => {
                        const newBusiness = await tx.business.create({
                            data: {
                                name: `${user.name} Business`,
                                slug,
                                ownerId: userId,
                                status: "ACTIVE"
                            }
                        });
                        await tx.member.create({
                            data: {
                                userId: userId,
                                businessId: newBusiness.id,
                                role: "OWNER"
                            }
                        });
                    });
                }
            }
        }

        return NextResponse.json({ message: "User role updated", user: updatedUser });
    } catch (error) {
        console.error("Update role error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

// DELETE - Remove a user
export const DELETE = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await req.json();

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
