/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react";
import Image from "next/image";
import { HiOutlineClock } from "react-icons/hi";
import Button from "@/components/ui/Button";
import SectionRenderer from "@/components/builder/SectionRenderer";
import BookingModal from "@/components/modals/BookingModal";
import { useTranslations } from "next-intl";

interface Props {
    business: any;
    sections: any[];
}

const COLOR_MAP: Record<string, any> = {
    indigo: { 
        text: "text-indigo-400", 
        bg: "bg-indigo-600", 
        light: "bg-indigo-950/30",
        border: "border-indigo-500/20",
        accent: "text-indigo-400"
    },
    emerald: { 
        text: "text-emerald-400", 
        bg: "bg-emerald-600", 
        light: "bg-emerald-950/30",
        border: "border-emerald-500/20",
        accent: "text-emerald-400"
    },
    rose: { 
        text: "text-rose-400", 
        bg: "bg-rose-600", 
        light: "bg-rose-950/30",
        border: "border-rose-500/20",
        accent: "text-rose-400"
    },
    purple: { 
        text: "text-purple-400", 
        bg: "bg-purple-600", 
        light: "bg-purple-950/30",
        border: "border-purple-500/20",
        accent: "text-purple-400"
    },
    zinc: { 
        text: "text-zinc-400", 
        bg: "bg-zinc-800", 
        light: "bg-zinc-900/50",
        border: "border-zinc-700",
        accent: "text-zinc-300"
    },
    orange: { 
        text: "text-orange-400", 
        bg: "bg-orange-600", 
        light: "bg-orange-950/30",
        border: "border-orange-500/20",
        accent: "text-orange-400"
    },
};

export default function ClassicTemplate({ business, sections }: Props) {
    const t = useTranslations("Public");
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);

    const theme = COLOR_MAP[business.themeColor || "indigo"] || COLOR_MAP.indigo;
    const bgThemeClass = theme.bg;

    const handleBook = (service: any) => {
        setSelectedService(service);
        setIsBookingOpen(true);
    };

    return (
        <main className="min-h-screen bg-[#080808] text-stone-200 font-serif selection:bg-stone-800" dir={business.defaultLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {business?.logo ? (
                            <Image src={business?.logo} alt={business?.name} width={42} height={42} className="rounded-xl object-cover border border-white/10 shadow-sm" />
                        ) : (
                            <div className={`w-10 h-10 rounded-xl ${bgThemeClass} flex items-center justify-center text-white font-bold shadow-lg`}>
                                {business?.name?.[0]}
                            </div>
                        )}
                        <span className="font-serif font-black text-2xl tracking-tight text-white">{business?.name}</span>
                    </div>
                    <nav className="hidden md:flex gap-10 text-xs font-black uppercase tracking-[0.2em] text-stone-500">
                        {sections.filter(s => s.isActive && s.type !== 'HERO').map(s => (
                            <a key={s.id} href={`#section-${s.id}`} className="hover:text-white transition-colors">
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
                        className={`px-8 py-2.5 ${bgThemeClass} text-white rounded-full shadow-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-all`}>
                        {t("bookNow")}
                    </Button>
                </div>
            </header>

            {/* Render Sections */}
            <div>
                {sections.map((section, index) => (
                    <div 
                        key={section.id} 
                        id={`section-${section.id}`} 
                        className={`scroll-mt-20 ${index % 2 === 1 ? theme.light : "bg-transparent"}`}
                    >
                        <SectionRenderer 
                            section={section} 
                            business={business} 
                            onBook={handleBook} 
                            isLight={false}
                        />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="bg-black text-stone-500 py-24 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-16">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-3 mb-8">
                                <div className={`w-10 h-10 rounded-xl ${bgThemeClass} flex items-center justify-center text-white font-bold text-lg`}>
                                    {business?.name[0]}
                                </div>
                                <span className="font-serif font-black text-white tracking-tight text-2xl">{business?.name}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-stone-400 font-medium">
                                {business.description || "Providing exceptional services to our community with dedication and professional care."}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-16">
                            <div>
                                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
                                <ul className="space-y-5 text-sm font-medium">
                                    {sections.filter(s => s.isActive).map(s => (
                                        <li key={s.id}>
                                            <a href={`#section-${s.id}`} className="hover:text-white transition-colors">{s.title || s.type}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Connect</h4>
                                <ul className="space-y-5 text-sm font-medium">
                                    <li className="text-white font-bold">{business.phone}</li>
                                    <li>{business.email || business.owner?.email}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} {business.name}. {t("allRightsReserved")}
                        </p>
                        <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em]">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            {selectedService && (
                <BookingModal
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    service={selectedService}
                    business={business}
                />
            )}
        </main>
    );
}
