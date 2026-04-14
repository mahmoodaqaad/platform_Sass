"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    HiChevronLeft,
    HiViewGrid,
    HiCalendar,
    HiShoppingBag,
    HiUsers,
    HiCog,
    HiShieldCheck,
    HiOutlineOfficeBuilding,
    HiOutlineGlobeAlt
} from "react-icons/hi";
import Logout from "../Logout";
import { User } from "@/prisma/generated/prisma/client";
import { Business } from "@/lib/types";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    business?: Business;
}

const Sidebar = ({ isOpen, onClose, business }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    const t = useTranslations("Navigation");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                if (res.data.authenticated) setUser(res.data.user);
            } catch { }
        };
        fetchUser();
    }, []);

    const menuItems = getMenuItems(t, user);

    const isLinkActive = (href: string) => pathname === href;

    const sidebarVariants = {
        desktop: {
            width: isCollapsed ? 100 : 280,
            x: 0,
            transition: { type: "spring" as const, stiffness: 300, damping: 30 }
        },
        mobileOpen: {
            x: 0,
            width: 280,
            transition: { type: "spring" as const, stiffness: 300, damping: 30 }
        },
        mobileClosed: {
            x: "100%",
            width: 280,
            transition: { type: "spring" as const, stiffness: 300, damping: 30 }
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                variants={sidebarVariants}
                animate={isOpen ? "mobileOpen" : (typeof window !== 'undefined' && window.innerWidth < 1024 ? "mobileClosed" : "desktop")}
                className={`fixed lg:sticky top-4 bottom-4 right-4 z-50 flex flex-col bg-zinc-950/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden ${isOpen ? "right-4" : ""
                    }`}
            >
                {/* Collapse Toggle - Only on Desktop */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -left-3 top-12 w-6 h-6 bg-indigo-600 rounded-full items-center justify-center text-white border-2 border-zinc-950 z-20 hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20"
                >
                    <HiChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Brand */}
                <div className="p-8 pb-4 flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
                            <span className="text-white font-black text-2xl italic">M</span>
                        </div>
                        {(!isCollapsed || isOpen) && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xl font-black text-white tracking-tighter"
                            >
                                MY PLATFORM
                            </motion.span>
                        )}
                    </Link>
                </div>

                {/* Live Site Shortcut */}
                {(!isCollapsed || isOpen) && (user?.role === "OWNER" || user?.role === "STAFF") && business && (
                    <div className="px-6 mb-4">
                        <Link
                            href={`/${business.slug}`}
                            target="_blank"
                            className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition-all group"
                        >
                            <HiOutlineGlobeAlt className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-[10px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">Live Site</span>
                            <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        </Link>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = isLinkActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => { if (onClose) onClose(); }}
                                className={`flex items-center gap-4 p-4 rounded-3xl transition-all group relative overflow-hidden ${isActive ? 'text-white' : 'text-zinc-500 hover:text-indigo-300'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-glow"
                                        className="absolute inset-0 bg-linear-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-3xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className={`text-2xl z-10 transition-colors ${isActive ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'group-hover:text-indigo-400'}`}>
                                    {item.icon}
                                </span>
                                {(!isCollapsed || isOpen) && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-bold z-10 text-sm tracking-wide"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute right-2 w-1.5 h-8 bg-indigo-500 rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User */}
                <div className="p-4 mt-auto">
                    <Logout dash={true} isCollapsed={isCollapsed && !isOpen} setUser={setUser} />
                </div>
            </motion.div>
        </>
    );
};

const getMenuItems = (t: (key: string) => string, user: User | null) => {
    if (!user) return [];

    const common = [{ name: t("overview"), icon: <HiViewGrid />, href: `/${user.role.toLowerCase()}` }];

    if (user.role === "ADMIN") {
        return [
            ...common,
            { name: t("users"), icon: <HiShieldCheck />, href: "/admin/users" },
            { name: t("businesses"), icon: <HiOutlineOfficeBuilding />, href: "/admin/businesses" },
            { name: t("orgSettings"), icon: <HiCog />, href: "/admin/settings" },
        ];
    }

    if (user.role === "OWNER") {
        return [
            ...common,
            { name: t("appointments"), icon: <HiCalendar />, href: "/owner/appointments" },
            { name: t("services"), icon: <HiShoppingBag />, href: "/owner/services" },
            { name: t("staff"), icon: <HiUsers />, href: "/owner/staff" },
            { name: t("customers"), icon: <HiUsers />, href: "/owner/customers" },
            { name: t("websiteBuilder"), icon: <HiOutlineGlobeAlt />, href: "/owner/website" },
            { name: t("settings"), icon: <HiCog />, href: "/owner/settings" },
        ];
    }

    if (user.role === "STAFF") {
        return [
            ...common,
            { name: t("schedule"), icon: <HiCalendar />, href: "/staff/schedule" },
            { name: t("customerList"), icon: <HiUsers />, href: "/staff/customers" },
        ];
    }

    return common;
};

export default Sidebar;
