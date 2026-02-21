"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import axios from "axios";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
    HiArrowRight,
    HiChartBar,
    HiUsers,
    HiCurrencyDollar,
    HiGlobeAlt,
    HiLightningBolt,
    HiBriefcase,
    HiShieldCheck
} from "react-icons/hi";

const Hero = () => {
    const t = useTranslations("Hero");
    const [platformName, setPlatformName] = React.useState("Platform");

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get("/api/settings/public");
                setPlatformName(res.data.platformName);
            } catch (err) {
                console.error("Hero settings fetch error:", err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#050505] text-white">
            {/* Background Gradients & Grid - Human-Made Feel */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* 1. Base Gradient Mesh */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-linear-to-b from-indigo-500/10 via-transparent to-transparent opacity-60" />

                {/* 2. Complex SVG Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* 3. Interactive Glowing Junctions (Static for performance, but visually deep) */}
                <div className="absolute inset-0">
                    {[20, 40, 60, 80].map((x) => (
                        [10, 30, 50, 70, 90].map((y) => (
                            <div
                                key={`${x}-${y}`}
                                className="absolute w-[2px] h-[2px] bg-indigo-400 rounded-full blur-[1px]"
                                style={{ top: `${y}%`, left: `${x}%` }}
                            />
                        ))
                    ))}
                </div>

                {/* 4. Large Cinematic Glows */}
                <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8"
                    >
                        <HiLightningBolt />
                        <span>{t("v2Live")}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8 tracking-tight"
                    >
                        {t("titleLine1")} <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-white/40">
                            {t("titleLine2")}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10"
                    >
                        {t("description")}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-2xl shadow-white/5"
                        >
                            {t("getStartedFree")}
                            <HiArrowRight className="group-hover:translate-x-1 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#demo"
                            className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl font-bold transition-all flex items-center justify-center"
                        >
                            {t("requestDemo")}
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500"
                    >
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><HiGlobeAlt /> {t("global")}</div>
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><HiBriefcase /> {t("nexus")}</div>
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><HiShieldCheck /> {t("secure")}</div>
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter font-serif italic">Acme Corp</div>
                    </motion.div>
                </div>

                {/* The "Human-Made" Dashboard Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="relative mx-auto mt-10 max-w-6xl"
                >
                    {/* Main Dashboard Container */}
                    <div className="relative z-10 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden aspect-video flex">
                        {/* Sidebar */}
                        <div className="w-16 md:w-60 border-r border-zinc-900 bg-zinc-950/50 p-4 hidden md:flex flex-col gap-6">
                            <div className="flex items-center gap-3 px-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600" />
                                <div className="h-4 w-24 bg-zinc-800 rounded-full flex items-center px-2 text-[8px] font-bold text-zinc-500 overflow-hidden">{platformName}</div>
                            </div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-3 px-2">
                                    <div className="w-5 h-5 rounded bg-zinc-900" />
                                    <div className="h-3 w-32 bg-zinc-900 rounded-full" />
                                </div>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 md:p-10 flex flex-col gap-8">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-zinc-800 rounded-full" />
                                    <div className="h-6 w-48 bg-zinc-900 rounded-full" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900" />
                                    <div className="w-10 h-10 rounded-full bg-zinc-900" />
                                </div>
                            </div>

                            {/* Grid of Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: t("activeUsers"), val: "12,402", icon: <HiUsers className="text-indigo-400" /> },
                                    { label: t("revenue"), val: "$452,000", icon: <HiCurrencyDollar className="text-emerald-400" /> },
                                    { label: t("growth"), val: "+24.5%", icon: <HiChartBar className="text-amber-400" /> }
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-zinc-500 font-medium text-sm">
                                            <span>{stat.label}</span>
                                            {stat.icon}
                                        </div>
                                        <div className="text-2xl font-bold ltr:text-left rtl:text-right">{stat.val}</div>
                                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Chart Area */}
                            <div className="flex-1 rounded-2xl bg-zinc-900/30 border border-zinc-800/30 p-6 flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <div className="h-4 w-40 bg-zinc-800 rounded-full" />
                                    <div className="flex gap-4">
                                        <div className="h-3 w-12 bg-zinc-800 rounded-full" />
                                        <div className="h-3 w-12 bg-zinc-800 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex-1 flex items-end gap-2 px-2">
                                    {[40, 60, 45, 90, 65, 80, 50, 70, 85, 40, 60, 100].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: 1 + i * 0.05 }}
                                            className="flex-1 bg-linear-to-t from-indigo-500 to-indigo-400/50 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Layers for Depth */}
                    <div className="absolute top-10 -right-10 w-full h-full border border-zinc-800 rounded-2xl -z-10 translate-x-4 translate-y-4 opacity-50" />
                    <div className="absolute top-10 -right-10 w-full h-full border border-zinc-800 rounded-2xl -z-20 translate-x-8 translate-y-8 opacity-20" />
                </motion.div>
            </div>
        </section >
    );
};

export default Hero;
