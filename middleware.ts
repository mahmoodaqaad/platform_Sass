import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('myplatform_token')?.value;
    const { pathname } = request.nextUrl;

    const isDashboardRoute = pathname.startsWith('/owner') || pathname.startsWith('/admin') || pathname.startsWith('/staff') || pathname.startsWith('/onboarding');
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
            await jwtVerify(token, secret);

            // If token is valid and user is on login/register, redirect to dashboard/home
            if (isAuthRoute) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            console.error("JWT Verification failed:", error);
            // Token is invalid - clear it and allow redirect to login if on protected route
            if (isDashboardRoute) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('myplatform_token');
                return response;
            }
            // If not on dashboard route, just clear it for future
            const response = NextResponse.next();
            response.cookies.delete('myplatform_token');
            return response;
        }
    } else {
        // No token - redirect protected routes to login
        if (isDashboardRoute) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/owner/:path*',
        '/admin/:path*',
        '/staff/:path*',
        '/login',
        '/register',
        '/onboarding'
    ],
};
