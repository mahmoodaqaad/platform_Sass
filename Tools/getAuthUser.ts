import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";
import { JwtPayload } from "./Types";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

/**
 * Unified auth helper — supports both legacy JWT cookie (myplatform_token)
 * and NextAuth session (Google / social login).
 * Returns the authenticated user or null.
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
    // 1. Try legacy custom token first
    const legacyToken = req.cookies.get("myplatform_token")?.value;
    if (legacyToken) {
        try {
            const decoded = jwt.verify(
                legacyToken,
                process.env.JWT_SECRET!
            ) as JwtPayload;
            return {
                id: decoded.id,
                name: decoded.name || "",
                email: decoded.email || "",
                role: decoded.role,
            };
        } catch {
            // Token invalid — fall through to check NextAuth
        }
    }

    // 2. Try NextAuth session token (Google, etc.)
    const nextAuthToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });
    if (nextAuthToken?.sub) {
        return {
            id: nextAuthToken.sub,
            name: (nextAuthToken.name as string) || "",
            email: (nextAuthToken.email as string) || "",
            role: (nextAuthToken.role as string) || "USER",
        };
    }

    return null;
}
