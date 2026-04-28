import { NextResponse } from "next/server";
import { prisma } from "@/Tools/db";

export const GET = async () => {
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
            // Ensure all default tiers exist
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

        // Return only non-sensitive data
        return NextResponse.json({
            platformName: settings.platformName,
            supportEmail: settings.supportEmail,
            supportPhone: settings.supportPhone,
            currency: settings.currency,
            tiersConfig: settings.tiersConfig,
            registrationOpen: settings.registrationOpen
        });
    } catch (error) {
        console.error("Fetch public settings error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
