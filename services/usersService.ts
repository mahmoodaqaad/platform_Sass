import { prisma } from "@/Tools/db";

export const UserService = {
    async fetchUserEmail() {
        return await prisma.user.findMany({ select: { email: true } })

    }
}