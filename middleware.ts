import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('myplatform_token')?.value;
    const { pathname } = request.nextUrl;

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

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
            const { payload } = await jwtVerify(token, secret);
            const userRole = payload.role as string;

            // If token is valid and user is on login/register, redirect to home (keep locale)
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

        } catch (error) {
            console.error("JWT Verification failed:", error);
            if (isDashboardRoute) {
                const redirectUrl = new URL('/login', request.url);
                const resp = NextResponse.redirect(redirectUrl);
                resp.cookies.delete('myplatform_token');
                return resp;
            }
            // Just clear token if invalid
            response.cookies.delete('myplatform_token');
        }
    } else {
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
