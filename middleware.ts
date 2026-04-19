import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('myplatform_token')?.value;
    const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;
    const cookie = await cookies()
    // 1. Handle i18n routing first to ensure locale is present/handled
    // valid locales: /en/..., /ar/...
    // If the path doesn't have a locale, handleI18nRouting might redirect.
    // We need to check if we should allow the request to proceed to auth check.

    // Check if the current path is a public asset or api (next-intl usually handles this via matcher in config, but we have manual matcher below)
    // Actually, we should let next-intl handle the response, but INTERCEPT it to check auth.

    const response = handleI18nRouting(request);

    // If next-intl redirects (e.g. / -> /ar), return that redirect immediately.
    if (response.headers.has('location')) {
        return response;
    }

    // 2. Auth Logic
    // We need to determine the "logical" path (without locale) for role checking?
    // Or just check strictly.
    // Pathname might be /en/owner/dashboard or /owner/dashboard (if not redirected yet? but response didn't redirect).

    // Helper to strip locale for checking
    const publicPathname = pathname.replace(/^\/(?:en|ar)/, '');
    // If pathname was '/en', publicPathname is '' -> '/'

    // We need to be careful: if pathname is `/en/owner`, publicPathname is `/owner`.

    const isDashboardRoute = publicPathname.startsWith('/owner') || publicPathname.startsWith('/admin') || publicPathname.startsWith('/staff') || publicPathname.startsWith('/onboarding');
    const isAuthRoute = publicPathname === '/login' || publicPathname === '/register';
    const isVerfiedRoute = publicPathname === "/verify-email"

    const otpToken = request.cookies.get("otp_code")?.value;

    // if (otpToken && isAuthRoute) {
    //     return NextResponse.redirect(new URL("/verify-email", request.url));

    // }

    if (isVerfiedRoute) {
        if (token || nextAuthToken) {

            return NextResponse.redirect(new URL("/", request.url));
        }

        if (!otpToken) {
            return NextResponse.redirect(new URL('/register', request.url));
        }

        try {


            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET
            );

            const { payload } = await jwtVerify(
                otpToken,
                secret
            );
            console.log(payload);

        } catch (error) {
            console.log(error);

            return NextResponse.redirect(new URL("/register", request.url));

        }

    }


    // 2. Auth Logic
    let userRole = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
            const { payload } = await jwtVerify(token, secret);
            userRole = payload.role as string;
        } catch (error) {
            console.error("JWT Verification failed:", error);
        }
    } else if (nextAuthToken) {
        userRole = nextAuthToken.role as string;
    }

    if (userRole) {
        // If logged in and on login/register, redirect to home
        if (isAuthRoute) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Role-based protection
        if (publicPathname.startsWith('/admin') && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (publicPathname.startsWith('/owner') && userRole !== 'OWNER' && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (publicPathname.startsWith('/staff') && userRole !== 'STAFF' && userRole !== 'OWNER' && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    } else {
        // Not logged in and trying to access dashboard
        if (isDashboardRoute) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
