import { prisma } from "@/Tools/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { getAuthUser } from "@/Tools/getAuthUser";
import { TierConfig } from "@/lib/types";



type TiersConfig = Record<string, TierConfig>;

export const GET = async (req: NextRequest) => {
    try {
        const authUser = await getAuthUser(req);
        if (!authUser) return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const includeArchived = searchParams.get("archived") === "true";

        const business = await prisma.business.findFirst({
            where: { ownerId: authUser.id },
            include: {
                services: {
                    where: includeArchived ? {} : { isActive: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!business) return NextResponse.json({ message: "لم يتم العثور على المشروع" }, { status: 404 });

        const serializedServices = business.services.map(s => ({
            ...s,
            price: Number(s.price)
        }));

        return NextResponse.json(serializedServices);
    } catch {
        return NextResponse.json({ message: "حدث خطأ أثناء تحميل الخدمات" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const authUser = await getAuthUser(req);
        if (!authUser) return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });
        const body = await req.json();
        const { name, description, duration, price, image } = body;

        if (!name || !duration || !price) {
            return NextResponse.json({ message: "يرجى إدخال البيانات المطلوبة" }, { status: 400 });
        }

        const business = await prisma.business.findFirst({
            where: { ownerId: authUser.id },
            include: { _count: { select: { services: { where: { isActive: true } } } } }
        });

        if (!business) return NextResponse.json({ message: "لم يتم العثور على مشروع" }, { status: 404 });

        const settings = await prisma.globalSettings.findUnique({ where: { id: "global" } });
        const plan = (business.plan as string) || "BASIC";
        const tiersConfig = (settings?.tiersConfig as unknown as TiersConfig) || {
            BASIC: { services: 2 },
            PRO: { services: 10 },
            BUSINESS: { services: 50 },
            ENTERPRISE: { services: 999 }
        };

        const limit = tiersConfig[plan]?.services || 2;
        if (business._count.services >= limit) {
            return NextResponse.json({ message: `لقد وصلت للحد الأقصى للخدمات (${limit})` }, { status: 403 });
        }

        const service = await prisma.service.create({
            data: {
                name,
                description: description || "",
                duration: parseInt(duration),
                price: parseFloat(price),
                image: image || null,
                businessId: business.id
            }
        });

        revalidatePath("/", "layout"); // Force global cache invalidation to ensure UI reflects new service.

        return NextResponse.json({ message: "تم إضافة الخدمة بنجاح!", service }, { status: 201 });
    } catch (error) {
        console.error("Add service error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء إضافة الخدمة" }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const authUser = await getAuthUser(req);
        if (!authUser) return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        const serviceId = searchParams.get("id");

        if (!serviceId) return NextResponse.json({ message: "المعرف مفقود" }, { status: 400 });

        const business = await prisma.business.findFirst({
            where: { ownerId: authUser.id },
            select: { id: true }
        });

        if (!business) return NextResponse.json({ message: "المشروع غير موجود" }, { status: 404 });

        await prisma.service.updateMany({
            where: { id: serviceId, businessId: business.id },
            data: { isActive: false }
        });

        revalidatePath("/", "layout");

        return NextResponse.json({ message: "تم أرشفة الخدمة بنجاح" });
    } catch {
        return NextResponse.json({ message: "حدث خطأ أثناء الحذف" }, { status: 500 });
    }
}

export const PATCH = async (req: NextRequest) => {
    try {
        const authUser = await getAuthUser(req);
        if (!authUser) return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });
        const body = await req.json();
        const { id, name, description, duration, price, image, isActive } = body;

        if (!id) return NextResponse.json({ message: "المعرف مفقود" }, { status: 400 });

        const business = await prisma.business.findFirst({
            where: { ownerId: authUser.id },
            select: { id: true }
        });

        if (!business) return NextResponse.json({ message: "المشروع غير موجود" }, { status: 404 });

        await prisma.service.updateMany({
            where: { id, businessId: business.id },
            data: {
                name,
                description,
                duration: duration ? parseInt(duration.toString()) : undefined,
                price: price ? parseFloat(price.toString()) : undefined,
                image,
                isActive: isActive !== undefined ? isActive : undefined
            }
        });

        revalidatePath("/", "layout");

        return NextResponse.json({ message: "تم تحديث الخدمة بنجاح" });
    } catch (error) {
        console.error("Update service error:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء تحديث الخدمة" }, { status: 500 });
    }
}
