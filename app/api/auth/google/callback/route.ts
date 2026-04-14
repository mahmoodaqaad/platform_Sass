import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/Tools/db";
import { setCookie } from "@/Tools/generateToken";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/ar/login?error=no_code", req.url));
    }

    try {
        // 1. Exchange code for token
        // This is where we swap the "permission code" for the actual "keys" (tokens)
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${new URL(req.url).origin}/api/auth/google/callback`,
            grant_type: "authorization_code",
        });

        const { access_token } = tokenResponse.data;

        // 2. Get user info from Google using the access token
        const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        const { email, name, picture } = userResponse.data;

        if (!email) {
            throw new Error("No email returned from Google");
        }

        // 3. Find or Create User in our Database (Prisma)
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // New user registration via Google
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    image: picture,
                    role: "USER" // Default role for new signups
                }
            });
        }

        // 4. Use the project's existing 'setCookie' logic to log them in
        // This creates the 'myplatform_token' cookie that your app expects
        const cookie = await setCookie({
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,
        });

        // 5. Decide where to send them based on their Role
        let redirectPath = "/ar";
        if (user.role === "ADMIN") redirectPath = "/ar/admin";
        else if (user.role === "OWNER") redirectPath = "/ar/owner";
        else if (user.role === "STAFF") redirectPath = "/ar/staff";

        // Create the redirect response and attach the auth cookie
        const response = NextResponse.redirect(new URL(redirectPath, req.url));
        response.headers.set("Set-Cookie", cookie);
        
        return response;

    } catch (error) {
        console.error("Manual Google Auth Error:", error);
        // If something goes wrong, send them back to login with an error message
        return NextResponse.redirect(new URL("/ar/login?error=google_auth_failed", req.url));
    }
};
