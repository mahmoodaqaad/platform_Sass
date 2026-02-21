"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiCheck, HiStar } from "react-icons/hi";
import axios from "axios";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Tier {
    name: string;
    price: string | number;
    description: string;
    features: string[];
    button: string;
    popular: boolean;
}

const Pricing = () => {
    const [plans, setPlans] = useState<Tier[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const t = useTranslations("Landing.Pricing");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                if (res.data.authenticated) {
                    setUser(res.data.user);
                }
            } catch {
                setUser(null);
            }
        };

        const fetchPricing = async () => {
            try {
                const res = await axios.get("/api/settings/public");
                const { tiersConfig } = res.data;

                if (tiersConfig) {
                    const mappedPlans = [
                        {
                            name: t("plans.basic.name"),
                            price: "0",
                            description: t("plans.basic.description"),
                            features: [
                                t("plans.basic.features.services", { services: tiersConfig.BASIC.services }),
                                t("plans.basic.features.members", { members: tiersConfig.BASIC.members }),
                                t("plans.basic.features.appointments", { appointments: tiersConfig.BASIC.appointments }),
                                t("plans.basic.features.support")
                            ],
                            button: t("plans.basic.button"),
                            popular: false
                        },
                        {
                            name: t("plans.pro.name"),
                            price: "49",
                            description: t("plans.pro.description"),
                            features: [
                                t("plans.pro.features.services", { services: tiersConfig.PRO.services }),
                                t("plans.pro.features.members", { members: tiersConfig.PRO.members }),
                                t("plans.pro.features.appointments", { appointments: tiersConfig.PRO.appointments }),
                                t("plans.pro.features.support"),
                                t("plans.pro.features.reporting")
                            ],
                            button: t("plans.pro.button"),
                            popular: true
                        },
                        {
                            name: t("plans.business.name"),
                            price: "99",
                            description: t("plans.business.description"),
                            features: [
                                t("plans.business.features.services", { services: tiersConfig?.BUSINESS?.services }),
                                t("plans.business.features.members", { members: tiersConfig?.BUSINESS?.members }),
                                t("plans.business.features.appointments", { appointments: tiersConfig?.BUSINESS?.appointments }),
                                t("plans.business.features.support"),
                                t("plans.business.features.analytics")
                            ],
                            button: t("plans.business.button"),
                            popular: false
                        },
                        {
                            name: t("plans.enterprise.name"),
                            price: t("plans.enterprise.price"),
                            description: t("plans.enterprise.description"),
                            features: [
                                t("plans.enterprise.features.services"),
                                t("plans.enterprise.features.members"),
                                t("plans.enterprise.features.appointments"),
                                t("plans.enterprise.features.manager"),
                                t("plans.enterprise.features.sla")
                            ],
                            button: t("plans.enterprise.button"),
                            popular: false
                        }
                    ];
                    setPlans(mappedPlans);
                }
            } catch (error) {
                console.error("Failed to fetch pricing:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBusiness = async () => {
            if (!user) return;
            try {
                const res = await axios.get("/api/owner/business");
                setBusinessPlan(res.data.plan);
            } catch (err) {
                console.error("Failed to fetch business plan:", err);
            }
        };

        checkAuth();
        fetchPricing();
        fetchBusiness();
    }, [t, user]);

    const [businessPlan, setBusinessPlan] = useState<string | null>(null);

    const handlePlanClick = (planName: string) => {
        const plan = planName.toUpperCase(); // Ensure this matches what we use in check out, strictly it might be just key name in future

        if (plan === "ENTERPRISE") {
            router.push("/contact");
            return;
        }

        const isUpgrade = sessionStorage.getItem("upgrade_mode") === "true";
        sessionStorage.setItem("selected_plan", plan);

        if (isUpgrade) {
            router.push(`/checkout?plan=${plan}&mode=upgrade`);
        } else if (plan === "BASIC") {
            // Free plan goes to register/onboarding
            router.push(user ? "/onboarding" : "/register?plan=BASIC");
        } else {
            // Paid plans go to checkout first
            router.push(`/checkout?plan=${plan}`);
        }
    };

    if (loading) return null;

    return (
        <section id="pricing" className="py-24 bg-[#050505] text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full -ml-32 -mb-32" />

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

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto" dir="rtl">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-8 rounded-[2.5rem] border ${plan.popular
                                ? "bg-zinc-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 relative"
                                : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                                } transition-all flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 shadow-lg shadow-indigo-500/20">
                                    <HiStar />
                                    {t("mostPopular")}
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-zinc-500 text-sm h-10">{plan.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tight" dir="ltr">
                                    {plan.price !== t("plans.enterprise.price") && plan.price !== "Custom" ? `$${plan.price}` : plan.price}
                                </span>
                                {plan.price !== t("plans.enterprise.price") && plan.price !== "Custom" && <span className="text-zinc-500 text-sm">{t("month")}</span>}
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <HiCheck className="text-indigo-400 w-5 h-5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePlanClick(plan.name === t("plans.basic.name") ? "BASIC" : plan.name === t("plans.pro.name") ? "PRO" : plan.name === t("plans.business.name") ? "BUSINESS" : "ENTERPRISE")}
                                disabled={(plan.name === t("plans.basic.name") ? "BASIC" : plan.name === t("plans.pro.name") ? "PRO" : plan.name === t("plans.business.name") ? "BUSINESS" : "ENTERPRISE") === businessPlan}
                                className={`w-full py-4 rounded-2xl font-bold transition-all text-center ${(plan.name === t("plans.basic.name") ? "BASIC" : plan.name === t("plans.pro.name") ? "PRO" : plan.name === t("plans.business.name") ? "BUSINESS" : "ENTERPRISE") === businessPlan
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                                    : plan.popular
                                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                    }`}
                            >
                                {(plan.name === t("plans.basic.name") ? "BASIC" : plan.name === t("plans.pro.name") ? "PRO" : plan.name === t("plans.business.name") ? "BUSINESS" : "ENTERPRISE") === businessPlan
                                    ? "خطتك الحالية"
                                    : plan.button}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
