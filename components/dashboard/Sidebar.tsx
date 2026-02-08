import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import {
    HiChevronLeft,
    HiViewGrid,
    HiCalendar,
    HiShoppingBag,
    HiUsers,
    HiCog,
    HiLogout,
    HiShieldCheck,
    HiOutlineOfficeBuilding
} from "react-icons/hi";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                if (res.data.authenticated) setUser(res.data.user);
            } catch (err) { }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
            router.push("/login");
            router.refresh();
        } catch (err) { }
    };

    const getMenuItems = () => {
        if (!user) return [];

        const common = [{ name: "نظرة عامة", icon: <HiViewGrid />, href: `/${user.role.toLowerCase()}` }];

        if (user.role === "ADMIN") {
            return [
                ...common,
                { name: "المستخدمون", icon: <HiShieldCheck />, href: "/admin/users" },
                { name: "الأعمال", icon: <HiOutlineOfficeBuilding />, href: "/admin/businesses" },
                { name: "إعدادات المنظمة", icon: <HiCog />, href: "/admin/settings" },
            ];
        }

        if (user.role === "OWNER") {
            return [
                ...common,
                { name: "المواعيد", icon: <HiCalendar />, href: "/owner/appointments" },
                { name: "الخدمات", icon: <HiShoppingBag />, href: "/owner/services" },
                { name: "الموظفون", icon: <HiUsers />, href: "/owner/staff" },
                { name: "العملاء", icon: <HiUsers />, href: "/owner/customers" },
                { name: "الإعدادات", icon: <HiCog />, href: "/owner/settings" },
            ];
        }

        if (user.role === "STAFF") {
            return [
                ...common,
                { name: "جدولي", icon: <HiCalendar />, href: "/staff/schedule" },
                { name: "قائمة العملاء", icon: <HiUsers />, href: "/staff/customers" },
            ];
        }

        return common;
    };

    const menuItems = getMenuItems();

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
                <HiChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
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
                    const isActive = pathname === item.href;
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
            <div className="p-4 border-t border-zinc-900">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
                >
                    <HiLogout className="text-2xl" />
                    {!isCollapsed && <span className="font-bold text-sm">تسجيل الخروج</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
