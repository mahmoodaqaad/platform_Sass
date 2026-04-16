"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import { HiMenuAlt3, HiOutlineGlobeAlt, HiOutlineExternalLink } from "react-icons/hi";
import { Link } from "@/i18n/routing";
import admin from "../../public/image/admin.png"
import owner from "../../public/image/owner.png"
import staff from "../../public/image/staff.png"
import { User } from "@/prisma/generated/prisma/client";
import { Business } from "@/lib/types";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const t = useTranslations("Roles");
    const tCommon = useTranslations("Common");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const meRes = await axios.get("/api/auth/me");
                if (meRes.data.authenticated) {
                    setUser(meRes.data.user);
                    if (meRes.data.user.role === "OWNER" || meRes.data.user.role === "STAFF") {
                        const bizRes = await axios.get("/api/owner/business");
                        setBusiness(bizRes.data);
                    }
                }
            } catch (err) {
                console.error("DashboardLayout fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const getRoleName = (role: string) => {
        if (role === "ADMIN") return t("admin");
        if (role === "OWNER") return t("owner");
        if (role === "STAFF") return t("staff");
        return t("user");
    };

    return (
        <div className="flex min-h-screen bg-[#050505]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} business={business} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Dashboard Top Header */}
                <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-6 md:px-10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-zinc-400 hover:text-white"
                        >
                            <HiMenuAlt3 size={28} />
                        </button>
                        <h2 className="font-black uppercase tracking-[0.2em] text-[10px] md:text-xs text-indigo-400">
                            {t("dashboardTitle")}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Global Site Indicator */}
                        {business && (
                            <Link
                                href={`/${business.slug}`}
                                target="_blank"
                                className="hidden md:flex items-center gap-3 px-4 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl transition-all group"
                            >
                                <div className="relative">
                                    <HiOutlineGlobeAlt size={18} className="text-emerald-500 group-hover:rotate-12 transition-transform" />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse border-2 border-zinc-950" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 leading-tight">Live Site</span>
                                    <span className="text-[9px] font-bold text-zinc-500 tracking-tighter max-w-[100px] truncate">{business.slug}.meta.com</span>
                                </div>
                                <HiOutlineExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors ml-1" />
                            </Link>
                        )}

                        <LanguageSwitcher />

                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-white font-bold text-sm tracking-tight">{user?.name || "..."}</span>
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-tighter text-right">
                                {user ? getRoleName(user.role) : tCommon("loading")}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-px shadow-lg shadow-indigo-500/10">
                            <div className="w-full h-full rounded-[11px] bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                                <Image
                                    src={
                                        user?.image ? user?.image :
                                            user?.role == "ADMIN" ?
                                                admin :
                                                user?.role === "OWNER" ?
                                                    (business?.logo ? business?.logo : owner)
                                                    : staff}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
