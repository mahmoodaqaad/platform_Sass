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
        <main className="min-h-screen bg-[#050505] text-white font-sans pt-20" dir={business.defaultLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {/* Template Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {business.logo && (
                            <div className="w-10 h-10 relative overflow-hidden rounded-lg border border-white/10">
                                <Image
                                    src={business.logo}
                                    alt={business.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <h1 className="text-xl font-black tracking-tighter">{business.name}</h1>
                    </div>

                    <Button
                        theme={business.themeColor}
                        onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`px-6 py-2 rounded-full text-sm font-bold ${bgThemeClass} hover:opacity-90 transition-opacity whitespace-nowrap`}
                    >
                        {t("bookNow")}
                    </Button>
                </div>
            </header>

            {/* Custom Sections */}
            <div>
                {sections.map(section => (
                    <SectionRenderer key={section.id} section={section} business={business} />
                ))}
            </div>

            <div id="services-section" className="max-w-6xl mx-auto py-20 px-6 space-y-32">
                {/* Services Section */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl font-black mb-2">{t("ourServices")}</h2>
                            <p className="text-zinc-500 text-lg">{t("servicesDesc")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {business?.services?.map((service: any) => (
                            <div key={service.id} className={`p-0 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 hover:${borderThemeClass} transition-all group overflow-hidden flex flex-col`}>
                                {service.image && (
                                    <div className="h-48 w-full relative overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                                    </div>
                                )}
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                                    <p className="text-zinc-500 text-sm line-clamp-2 mb-8">{service.description || t("serviceDefaultDesc")}</p>

                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/50">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                                <HiOutlineClock /> {t("duration", { min: service.duration })}
                                            </div>
                                            <div className={`text-3xl font-black ${themeClass}`}>
                                                ${service.price.toString()}
                                            </div>
                                        </div>
                                        <Button
                                            theme={business.themeColor}
                                            onClick={() => handleBook(service)}
                                            className={`px-6! py-3! text-sm bg-${business.themeColor}-600! hover:opacity-90`}
                                        >
                                            {t("book")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
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
