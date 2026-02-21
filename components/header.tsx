"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import axios from "axios";
import Logout from "./Logout";
import { User } from "@/prisma/generated/prisma/client";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [platformName, setPlatformName] = useState("Platform");
    const pathname = usePathname();
    const t = useTranslations("Common");
    const tNav = useTranslations("Navigation");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get("/api/settings/public");
                setPlatformName(res.data.platformName);
            } catch (error) {
                console.error("Header settings fetch error:", error);
            }
        };
        fetchSettings();
    }, []);

    // Do not show header on dashboard pages
    const isDashboard = pathname.startsWith("/admin") ||
        pathname.startsWith("/owner") ||
        pathname.startsWith("/staff");

    // Fetch user status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                if (res.data.authenticated) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch {
                // Not authenticated
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [pathname]);

    // Detect scroll for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isDashboard) return null;

    const isAuthPage = pathname === "/login" || pathname === "/register";

    const navLinks = [
        { name: t("home"), href: "/" },
        { name: tNav("rooms"), href: "/rooms" }, // Added rooms as example, check if needed
        { name: t("pricing"), href: "/pricing" },
        { name: t("contact"), href: "/contact" },
    ];

    const getDashboardLink = () => {
        if (!user) return "/login";
        if (user.role === "ADMIN") return "/admin";
        if (user.role === "OWNER") return "/owner";
        if (user.role === "STAFF") return "/staff";
        return "/";
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "py-4 bg-black/60 backdrop-blur-md border-b border-white/10"
                    : "py-6 bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/70">
                            {platformName}
                        </span>
                    </Link>

                    {/* Desktop Navigation - Hidden on Auth Pages */}
                    {!isAuthPage && (
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher />

                        {isAuthPage ? (
                            <Link
                                href="/"
                                className="px-6 py-2 rounded-xl text-white font-medium border border-white/10 hover:bg-white/5 transition"
                            >
                                {t("home")}
                            </Link>
                        ) : loading ? (
                            <div className="w-24 h-10 bg-white/5 animate-pulse rounded-xl" />
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                {(user.role === "ADMIN" || user.role === "OWNER" || user.role === "STAFF") && (
                                    <Link
                                        href={getDashboardLink()}
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition"
                                    >
                                        {t("dashboard")}
                                    </Link>
                                )}
                                <Logout dash={false} isCollapsed={false} setUser={setUser} />
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-white/80 hover:text-white font-medium transition"
                                >
                                    {t("login")}
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                                >
                                    {t("register")}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    {!isAuthPage && (
                        <div className="flex items-center gap-2 md:hidden">
                            <LanguageSwitcher />
                            <button
                                className="text-white p-2"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Drawer */}
                <AnimatePresence>
                    {isOpen && !isAuthPage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10 overflow-hidden"
                        >
                            <div className="px-6 py-8 flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-xl font-medium text-white/80 hover:text-white"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <hr className="border-white/10" />
                                <div className="flex flex-col gap-4">
                                    {user ? (
                                        <>
                                            {(user.role === "ADMIN" || user.role === "OWNER" || user.role === "STAFF") && (
                                                <Link
                                                    href={getDashboardLink()}
                                                    onClick={() => setIsOpen(false)}
                                                    className="w-full py-4 text-center rounded-xl bg-white/5 text-white font-medium"
                                                >
                                                    {t("dashboard")}
                                                </Link>
                                            )}
                                            <Logout dash={false} isCollapsed={false} setUser={setUser} />

                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-4 text-center rounded-xl bg-white/5 text-white font-medium"
                                            >
                                                {t("login")}
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-4 text-center rounded-xl bg-indigo-600 text-white font-medium"
                                            >
                                                {t("register")}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;