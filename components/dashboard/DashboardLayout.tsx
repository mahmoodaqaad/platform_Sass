"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";

import { User } from "@/prisma/generated/prisma/client";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const t = useTranslations("Roles");
    const tCommon = useTranslations("Common");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                if (res.data.authenticated) setUser(res.data.user);
            } catch { }
        };
        fetchUser();
    }, []);

    const getRoleName = (role: string) => {
        if (role === "ADMIN") return t("admin");
        if (role === "OWNER") return t("owner");
        if (role === "STAFF") return t("staff");
        return t("user");
    };

    return (
        <div className="flex min-h-screen bg-[#050505]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                {/* Dashboard Top Header */}
                <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="font-bold uppercase tracking-widest text-xs text-indigo-400">
                            {t("dashboardTitle")}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <LanguageSwitcher />

                        <div className="flex flex-col items-end">
                            <span className="text-white font-bold text-sm">{user?.name || "..."}</span>
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-tighter text-right">
                                {user ? getRoleName(user.role) : tCommon("loading")}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-px">
                            <div className="w-full h-full rounded-[11px] bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                                <Image
                                    src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=transparent&color=fff`}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-10">
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
