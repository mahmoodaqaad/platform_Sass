import { prisma } from "../lib/prisma";

export const BusinessService = {
    async getBySlug(slug: string) {
        return await prisma.business.findUnique({
            where: { slug },
            include: {
                services: true,
                products: true,
            },
        });
    },

    async getOwnerBusinesses(ownerId: string) {
        return await prisma.business.findMany({
            where: { ownerId },
        });
    },
};
