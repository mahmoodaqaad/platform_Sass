"use client";

import React from "react";
import Link from "next/link";
import axios from "axios";
import { SiTeal, SiLinkedin, SiGithub, SiWhatsapp } from "react-icons/si";
import { useTranslations } from "next-intl";
import { PublicSettings } from "@/lib/types";



const Footer = () => {
    const [settings, setSettings] = React.useState<PublicSettings | null>(null);
    const t = useTranslations("Landing.Footer");

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get("/api/settings/public");
                setSettings(res.data);
            } catch (err) {
                console.error("Footer settings fetch error:", err);
            }
        };
        fetchSettings();
    }, []);

    const linksSection = [
        {
            title: t("cols.product"),
            links: [
                { name: t("links.features"), href: "#features" },
                { name: t("links.integrations"), href: "#" },
                { name: t("links.pricing"), href: "#pricing" },
                { name: t("links.changelog"), href: "#" }
            ]
        },
        {
            title: t("cols.company"),
            links: [
                { name: t("links.about"), href: "#" },
                { name: t("links.careers"), href: "#" },
                { name: t("links.blog"), href: "#" },
                { name: t("links.newsroom"), href: "#" }
            ]
        },
        {
            title: t("cols.legal"),
            links: [
                { name: t("links.privacy"), href: "#" },
                { name: t("links.terms"), href: "#" },
                { name: t("links.cookie"), href: "#" },
                { name: t("links.sla"), href: "#" }
            ]
        }
    ];

    return (
        <footer className="bg-[#050505] border-t border-zinc-900 pt-16 md:pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 md:mb-20">
                    {/* Brand */}
                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-black">M</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">{settings?.platformName || "Platform"}</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-xs">
                            {t("brandDesc")}
                        </p>
                        <div className="flex gap-4 justify-center sm:justify-start">
                            {[{ Icon: SiTeal }, { Icon: SiLinkedin }, { Icon: SiGithub }, { Icon: SiWhatsapp }].map(({ Icon }, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 transition-all"
                                >
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {linksSection.map((col, i) => (
                        <div key={i} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-300">
                                {col.title}
                            </h4>
                            <ul className="space-y-4">
                                {col.links.map((link, lIndex) => (
                                    <li key={lIndex}>
                                        <Link href={link.href} className="text-zinc-500 hover:text-white text-sm transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-zinc-900 gap-6 text-zinc-600 text-[10px] md:text-xs text-center md:text-left">
                    <p>{t("rights", { year: new Date().getFullYear(), platform: settings?.platformName || "Platform" })}</p>
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            {t("status")}
                        </div>
                        <div className="flex items-center">
                            {t("createdBy")}
                            <span className="text-sky-500 mx-1 font-bold" >
                                Mahmood aqaad
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
