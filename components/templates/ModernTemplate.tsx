"use client"

import React, { useState } from "react";
import { HiOutlineClock } from "react-icons/hi";
import Button from "@/components/ui/Button";
import SectionRenderer from "@/components/builder/SectionRenderer";
import BookingModal from "@/components/modals/BookingModal";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
    business: any;
    sections: any[];
}

const COLOR_MAP: Record<string, any> = {
    indigo: { text: "text-indigo-400", bg: "bg-indigo-600", border: "border-indigo-500/50", shadow: "shadow-indigo-500/25", from: "from-indigo-600/20" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-600", border: "border-emerald-500/50", shadow: "shadow-emerald-500/25", from: "from-emerald-600/20" },
    rose: { text: "text-rose-400", bg: "bg-rose-600", border: "border-rose-500/50", shadow: "shadow-rose-500/25", from: "from-rose-600/20" },
    purple: { text: "text-purple-400", bg: "bg-purple-600", border: "border-purple-500/50", shadow: "shadow-purple-500/25", from: "from-purple-600/20" },
    orange: { text: "text-orange-400", bg: "bg-orange-600", border: "border-orange-500/50", shadow: "shadow-orange-500/25", from: "from-orange-600/20" },
    zinc: { text: "text-zinc-400", bg: "bg-zinc-800", border: "border-zinc-700", shadow: "shadow-zinc-500/10", from: "from-zinc-800/20" },
};

export default function ModernTemplate({ business, sections }: Props) {
    const t = useTranslations("Public");
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);

    const theme = COLOR_MAP[business.themeColor || "indigo"] || COLOR_MAP.indigo;
    const themeClass = theme.text;
    const bgThemeClass = theme.bg;
    const borderThemeClass = theme.border;
    console.log(business.themeColor);

    const handleBook = (service: any) => {
        setSelectedService(service);
        setIsBookingOpen(true);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white font-sans" dir={business.defaultLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {/* Template Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {business.logo ? (
                            <div className="w-10 h-10 relative overflow-hidden rounded-lg border border-white/10">
                                <Image
                                    src={business.logo}
                                    alt={business.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className={`w-10 h-10 rounded-lg ${bgThemeClass} flex items-center justify-center text-white font-black`}>
                                {business.name?.[0]}
                            </div>
                        )}
                        <h1 className="text-xl font-black tracking-tighter">{business.name}</h1>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8">
                        {sections.filter(s => s.isActive && s.type !== 'HERO').map(s => (
                            <a 
                                key={s.id} 
                                href={`#section-${s.id}`} 
                                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                            >
                                {s.title || s.type}
                            </a>
                        ))}
                    </nav>

                    <Button
                        theme={business.themeColor}
                        onClick={() => {
                            const firstSection = sections.find(s => s.isActive && s.type !== 'HERO');
                            if (firstSection) document.getElementById(`section-${firstSection.id}`)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-bold ${bgThemeClass} hover:opacity-90 transition-opacity whitespace-nowrap`}
                    >
                        {t("bookNow")}
                    </Button>
                </div>
            </header>

            {/* Custom Sections */}
            <div>
                {sections.map(section => (
                    <SectionRenderer key={section.id} section={section} business={business} onBook={handleBook} />
                ))}
            </div>



            <footer className="border-t border-white/5 py-10 mt-20 text-center text-zinc-600 text-sm">
                &copy; {new Date().getFullYear()} {business.name}. {t("allRightsReserved")}
            </footer>

            {selectedService && (
                <BookingModal
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    service={selectedService}
                    business={business}
                />
            )}
        </main >

    );
}
