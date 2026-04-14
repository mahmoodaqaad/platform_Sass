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
    indigo: { text: "text-indigo-600", bg: "bg-indigo-600", border: "border-indigo-500/30" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-600", border: "border-emerald-500/30" },
    rose: { text: "text-rose-600", bg: "bg-rose-600", border: "border-rose-500/30" },
    purple: { text: "text-purple-600", bg: "bg-purple-600", border: "border-purple-500/30" },
    zinc: { text: "text-zinc-600", bg: "bg-zinc-800", border: "border-zinc-300" },
    orange: { text: "text-orange-600", bg: "bg-orange-800", border: "border-orange-300" },
};

export default function ClassicTemplate({ business, sections }: Props) {
    const t = useTranslations("Public");
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);

    const theme = COLOR_MAP[business.themeColor || "indigo"] || COLOR_MAP.indigo;
    const themeClass = theme.text;
    const bgThemeClass = theme.bg;
    const borderThemeClass = theme.border;
    console.log(theme);

    const handleBook = (service: any) => {
        setSelectedService(service);
        setIsBookingOpen(true);
    };

    return (
        <main className="min-h-screen bg-stone-50 text-stone-900 font-serif selection:bg-stone-200" dir={business.defaultLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {business?.logo ? (
                            <Image src={business?.logo} alt={business?.name} width={40} height={40} className="rounded-full object-cover border border-stone-200" />
                        ) : (
                            <div className={`w-10 h-10 rounded-full ${bgThemeClass} flex items-center justify-center text-white font-bold`}>
                                {business?.name[0]}
                            </div>
                        )}
                        <span className="font-bold text-xl tracking-tight">{business?.name}</span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-stone-500">
                        <a href="#services" className="hover:text-stone-900 transition-colors">{t("services")}</a>
                        {sections.filter(s => s.isActive && s.type !== 'HERO').map(s => (
                            <a key={s.id} href={`#section-${s.id}`} className="hover:text-stone-900 transition-colors">
                                {s.title || 'Section'}
                            </a>
                        ))}
                    </nav>
                    <Button
                        theme={business.themeColor}
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`px-6 py-2 ${bgThemeClass} text-white rounded-md shadow-sm text-sm`}>
                        {t("bookNow")}
                    </Button>
                </div>
            </header>

            {/* Render Sections */}
            <div className="bg-white">
                {sections.map(section => (
                    <div key={section.id} id={`section-${section.id}`} className="scroll-mt-20">
                        <SectionRenderer section={section} business={business} />
                    </div>
                ))}
            </div>

            {/* Services Section */}
            <div className="max-w-6xl mx-auto py-24 px-6">
                <section id="services">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-stone-900 mb-4">{t("ourServices")}</h2>
                        <p className="text-stone-500 text-lg">{t("servicesDesc")}</p>
                        <div className={`w-20 h-1 ${bgThemeClass} mx-auto mt-6 rounded-full opacity-50`} />
                    </div>
                    {
                        business?.services?.length > 0 ?

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {business?.services?.map((service: any) => (
                                    <div key={service.id} className={`bg-white rounded-xl border border-stone-200 p-0 shadow-xs hover:shadow-md hover:${borderThemeClass} transition-all group flex flex-col overflow-hidden`}>
                                        {service.image && (
                                            <div className="h-56 w-full relative overflow-hidden">
                                                <Image
                                                    src={service.image}
                                                    alt={service.name}
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-8 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-stone-900 mb-3">{service.name}</h3>
                                            <p className="text-stone-500 text-sm mb-8 flex-1">{service.description || t("serviceDefaultDesc")}</p>

                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center text-sm font-medium pb-4 border-b border-stone-100">
                                                    <span className="text-stone-500 flex items-center gap-2"><HiOutlineClock /> {t("duration", { min: '' }).split(' ')[1] || 'Duration'}</span>
                                                    <span className="text-stone-900">{service.duration} {t("duration", { min: '' }).split(' ')[0] || 'minutes'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm font-medium pb-6">
                                                    <span className="text-stone-500">Price</span>
                                                    <span className={`text-2xl font-bold ${themeClass}`}>${service.price.toString()}</span>
                                                </div>
                                                <Button
                                                    theme={business.themeColor}
                                                    onClick={() => handleBook(service)}
                                                    className={`w-full py-3 ${bgThemeClass} text-white rounded-md group-hover:bg-opacity-90`}
                                                >
                                                    {t("selectService")}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                ))

                                }
                            </div>
                            :
                            <div className="text-center w-full">

                                <p className=" font-extrabold text-3xl text-red-400 italic">{t("noServices")}</p>
                                <hr className="mt-3 w-48 text-red-400 mx-auto" />
                            </div>
                    }
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-400 py-12">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${bgThemeClass} flex items-center justify-center text-white font-bold text-xs`}>
                            {business?.name[0]}
                        </div>
                        <span className="font-bold text-white tracking-wider uppercase text-sm">{business?.name}</span>
                    </div>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} {business.name}. {t("allRightsReserved")}
                    </p>
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
