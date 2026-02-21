import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { jwtVerify } from "jose";

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

// GET - Fetch all customers for the owner's business
export const GET = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    try {
        const customers = await prisma.customer.findMany({
            where: {
                businessId: business.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Fetch customers error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء تحميل بيانات العملاء" }, { status: 500 });
    }
};

// POST - Add a new customer
export const POST = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    try {
        const { name, email, phone, status, notes } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ message: "يرجى إدخال الاسم والبريد الإلكتروني" }, { status: 400 });
        }

        // Check if customer already exists for THIS business
        const existingCustomer = await prisma.customer.findUnique({
            where: {
                email_businessId: {
                    email,
                    businessId: business.id
                }
            }
        });

        if (existingCustomer) {
            return NextResponse.json({ message: "هذا العميل مسجل بالفعل في نظامك" }, { status: 400 });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                notes,
                status: status || "New",
                businessId: business.id
            }
        });

        return NextResponse.json({ message: "تم إضافة العميل بنجاح", customer }, { status: 201 });
    } catch (error) {
        console.error("Add customer error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء إضافة العميل" }, { status: 500 });
    }
};

// PATCH - Update customer status
export const PATCH = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    try {
        const { id, name, email, phone, status, notes } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "بيانات ناقصة" }, { status: 400 });
        }

        const updatedCustomer = await prisma.customer.update({
            where: {
                id,
                businessId: business.id
            },
            data: {
                name,
                email,
                phone,
                status,
                notes
            }
        });

        return NextResponse.json({ message: "تم تحديث حالة العميل", customer: updatedCustomer });
    } catch (error) {
        console.error("Update customer status error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء تحديث الحالة" }, { status: 500 });
    }
};

// DELETE - Remove a customer (Optional but good for completeness)
export const DELETE = async (req: NextRequest) => {
    const business = await getOwnerBusiness(req);
    if (!business) return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 });

    try {
        const { id } = await req.json();

        await prisma.customer.delete({
            where: {
                id,
                businessId: business.id // Ensure they can only delete their own business customers
            }
        });

        return NextResponse.json({ message: "تم حذف العميل بنجاح" });
    } catch (error) {
        console.error("Delete customer error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء حذف العميل" }, { status: 500 });
    }
};
