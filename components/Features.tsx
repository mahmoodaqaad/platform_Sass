"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    HiLightningBolt,
    HiShieldCheck,
    HiChartBar,
    HiUsers,
    HiCube,
    HiClock
} from "react-icons/hi";
import { useTranslations } from "next-intl";

const Features = () => {
    const t = useTranslations("Landing.Features");

    const features = [
        {
            title: t("items.lightning.title"),
            description: t("items.lightning.description"),
            icon: <HiLightningBolt className="w-8 h-8 text-amber-400" />,
            color: "bg-amber-500/10 border-amber-500/20"
        },
        {
            title: t("items.security.title"),
            description: t("items.security.description"),
            icon: <HiShieldCheck className="w-8 h-8 text-indigo-400" />,
            color: "bg-indigo-500/10 border-indigo-500/20"
        },
        {
            title: t("items.analytics.title"),
            description: t("items.analytics.description"),
            icon: <HiChartBar className="w-8 h-8 text-emerald-400" />,
            color: "bg-emerald-500/10 border-emerald-500/20"
        },
        {
            title: t("items.collaboration.title"),
            description: t("items.collaboration.description"),
            icon: <HiUsers className="w-8 h-8 text-rose-400" />,
            color: "bg-rose-500/10 border-rose-500/20"
        },
        {
            title: t("items.scaling.title"),
            description: t("items.scaling.description"),
            icon: <HiCube className="w-8 h-8 text-purple-400" />,
            color: "bg-purple-500/10 border-purple-500/20"
        },
        {
            title: t("items.automation.title"),
            description: t("items.automation.description"),
            icon: <HiClock className="w-8 h-8 text-cyan-400" />,
            color: "bg-cyan-500/10 border-cyan-500/20"
        }
    ];

    return (
        <section id="features" className="py-24 bg-[#050505] text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        {t("titlePrefix")} <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">{t("titleHighlight")}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 text-lg max-w-2xl mx-auto"
                    >
                        {t("subtitle")}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-8 rounded-3xl border ${feature.color} bg-zinc-950/50 hover:bg-zinc-900 transition-all group`}
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-zinc-900 inline-block group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
