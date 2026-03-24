"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    HiOutlineOfficeBuilding, HiOutlineLink, HiHome, HiPhone,
    HiDocumentText, HiOutlineSparkles
} from "react-icons/hi";
import {
    MdContentCut, MdMedicalServices, MdSpa, MdFitnessCenter,
    MdRestaurant, MdHotel, MdStorefront, MdMoreHoriz
} from "react-icons/md";
import axios from "axios";
import LogoUpload from "@/components/dashboard/LogoUpload";
import { useTranslations, useLocale } from "next-intl";

const BUSINESS_TYPES = [
    { value: "SALON", icon: MdContentCut },
    { value: "CLINIC", icon: MdMedicalServices },
    { value: "SPA", icon: MdSpa },
    { value: "GYM", icon: MdFitnessCenter },
    { value: "RESTAURANT", icon: MdRestaurant },
    { value: "HOTEL", icon: MdHotel },
    { value: "STORE", icon: MdStorefront },
    { value: "OTHER", icon: MdMoreHoriz },
];

export default function OnboardingPage() {
    const router = useRouter();
    const t = useTranslations("Onboarding");
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [error, setError] = useState("");
    const [sessionStorageData, setSessionStorageData] = useState({
        plan: "",
        duration: "",
        AllPaied: 0
    });
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        type: "SALON",
        description: "",
        logo: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        const init = async () => {
            // 1. Check if user is logged in
            try {
                await axios.get("/api/auth/me");
            } catch {
                // Not logged in → go to register with redirect
                router.replace(`/${locale}/register?redirect=/${locale}/onboarding`);
                return;
            }

            // 2. Read sessionStorage for plan info
            const plan = sessionStorage.getItem("selected_plan") || "BASIC";
            const duration = sessionStorage.getItem("subscription_duration") || "";
            const allPaied = Number(sessionStorage.getItem("user_allpaides")) || 0;

            setSessionStorageData({ plan, duration, AllPaied: allPaied });
            setAuthChecked(true);
        };

        init();
    }, [router, locale]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");


        try {
            await axios.post("/api/business", { ...formData, ...sessionStorageData });

            // Clear sessionStorage after successful setup
            sessionStorage.removeItem("selected_plan");
            sessionStorage.removeItem("subscription_duration");
            sessionStorage.removeItem("user_allpaides");

            await axios.post("/api/auth/logout");
            router.push(`/${locale}/login?redirect=true`);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError(t("unexpectedError"));
        } finally {
            setLoading(false);
        }
    };

    if (!authChecked) {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className="mt-10 min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
                        <HiOutlineSparkles className="text-4xl text-white" />
                    </div>
                    <h1 className="text-4xl font-black mb-3">{t("title")}</h1>
                    <p className="text-zinc-500 text-lg">{t("subtitle")}</p>
                    {sessionStorageData.plan === "BASIC" && (
                        <span className="inline-block mt-3 px-3 py-1 text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
                            {t("freeBadge")}
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 backdrop-blur-xl">
                    <Input
                        label={t("fields.name")}
                        icon={<HiOutlineOfficeBuilding />}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        required
                    />

                    <Input
                        label={t("fields.slug")}
                        icon={<HiOutlineLink />}
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        required
                    />

                    <div className="flex gap-3">
                        <Input
                            label={t("fields.description")}
                            icon={<HiDocumentText />}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        <Input
                            label={t("fields.phone")}
                            type="number"
                            icon={<HiPhone />}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-between">
                        <div className="flex-1">
                            <Input
                                label={t("fields.address")}
                                icon={<HiHome />}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <LogoUpload
                                value={formData.logo}
                                onChange={(val) => setFormData(prev => ({ ...prev, logo: val }))}
                            />
                        </div>
                    </div>

                    {/* Business Type Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t("typeLabel")}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {BUSINESS_TYPES.map(({ value, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: value })}
                                    className={`p-3 rounded-2xl border transition-all text-sm font-bold flex flex-col items-center gap-1 ${formData.type === value
                                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                                            : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                        }`}
                                >
                                    <Icon className="text-2xl" />
                                    <span className="text-[10px] text-center">{t(`types.${value}`)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}

                    <Button type="submit" isLoading={loading} className="w-full">
                        {t("submit")}
                    </Button>
                </form>
            </motion.div>
        </main>
    );
}
