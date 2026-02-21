import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'ar'],

    // Used when no locale matches
    defaultLocale: 'ar',

    // Prefix for the default locale can be hidden if desired, 
    // but usually for distinct 'en'/'ar' it's better to show it or at least have one.
    // Let's keep prefixes for both to be explicit, or hide for default.
    // User wants Arabic support, likely as primary or equal.
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
