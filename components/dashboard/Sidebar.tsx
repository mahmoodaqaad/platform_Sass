"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
import { User } from "@prisma/client";

const Sidebar = () => {
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

    const getMenuItems = () => {
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

    const menuItems = getMenuItems();

    // Check if path is active (ignoring locale prefix which usePathname from @/i18n/routing already does)
    const isLinkActive = (href: string) => {
        return pathname === href;
    };

    return (
        <motion.div
            animate={{ width: isCollapsed ? 88 : 280 }}
            className="h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col sticky top-0"
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-zinc-950 z-20 hover:scale-110 transition-transform"
            >


                <HiChevronLeft className={`transition-transform duration-300  ${isCollapsed ? 'rotate-180' : ''}`} />

            </button>

            {/* Brand */}
            <Link href="/" className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                    <span className="text-white font-bold text-xl">M</span>
                </div>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-bold text-white tracking-tight"
                    >
                        MyPlatform
                    </motion.span>
                )}
            </Link>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = isLinkActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${isActive ? 'text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl"
                                />
                            )}
                            <span className={`text-2xl z-10 ${isActive ? 'text-indigo-400' : ''}`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-bold z-10 text-sm"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <Logout dash={true} isCollapsed={isCollapsed} setUser={setUser} />

        </motion.div>
    );
};

export default Sidebar;
