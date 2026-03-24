import { PrismaClient } from "../prisma/generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
// @ts-expect-error - Type mismatch between pg and @prisma/adapter-pg
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as {
    prisma?: PrismaClient
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;