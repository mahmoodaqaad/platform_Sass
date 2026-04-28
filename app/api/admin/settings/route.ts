import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/Tools/db";
import { getAuthUser } from "@/Tools/getAuthUser";

async function verifyAdmin(req: NextRequest) {
    const authUser = await getAuthUser(req);
    return authUser?.role === "ADMIN";
}

export const GET = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        let settings = await prisma.globalSettings.findUnique({
            where: { id: "global" }
        });

        const defaultTiers = {
            BASIC: { services: 2, members: 1, appointments: 50 },
            PRO: { services: 10, members: 5, appointments: 500 },
            BUSINESS: { services: 50, members: 20, appointments: 2000 },
            ENTERPRISE: { services: 999, members: 999, appointments: 9999 }
        };

        if (!settings) {
            // Seed default settings if not exists
            settings = await prisma.globalSettings.create({
                data: {
                    id: "global",
                    platformName: "OmniBooking",
                    supportEmail: "mahmmodaqaad@gmail.com",
                    registrationOpen: true,
                    currency: "USD",
                    commissionRate: 10.0,
                    tiersConfig: defaultTiers
                }
            });
        } else {
            // Ensure all default tiers exist in the fetched settings
            const currentTiers = (settings.tiersConfig as Record<string, any>) || {};
            let updated = false;

            for (const tier in defaultTiers) {
                if (!currentTiers[tier]) {
                    currentTiers[tier] = (defaultTiers as Record<string, any>)[tier];
                    updated = true;
                }
            }

            if (updated) {
                settings = await prisma.globalSettings.update({
                    where: { id: "global" },
                    data: { tiersConfig: currentTiers }
                });
            }
        }

        return NextResponse.json({
            ...settings,
            commissionRate: Number(settings.commissionRate)
        });
    } catch (error) {
        console.error("Fetch settings error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    if (!await verifyAdmin(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();

        const updated = await prisma.globalSettings.upsert({
            where: { id: "global" },
            update: {
                platformName: data.platformName,
                supportEmail: data.supportEmail,
                supportPhone: data.supportPhone,
                registrationOpen: data.registrationOpen,
                currency: data.currency,
                commissionRate: data.commissionRate,
                tiersConfig: data.tiersConfig
            },
            create: {
                id: "global",
                platformName: data.platformName,
                supportEmail: data.supportEmail,
                supportPhone: data.supportPhone,
                registrationOpen: data.registrationOpen,
                currency: data.currency,
                commissionRate: data.commissionRate,
                tiersConfig: data.tiersConfig
            }
        });

        return NextResponse.json({ message: "Settings updated successfully", settings: updated });
    } catch (error) {
        console.error("Update settings error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
