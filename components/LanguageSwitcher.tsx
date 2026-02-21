"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { IoLanguage } from "react-icons/io5";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === "en" ? "ar" : "en";
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/10"
            title={locale === "en" ? "إلى العربية" : "To English"}
        >
            <IoLanguage className="text-lg" />
            <span className="text-xs font-bold uppercase">
                {locale === "en" ? "AR" : "EN"}
            </span>
        </button>
    );
}
