"use client";

import React, { useState, useEffect } from "react";
import {  usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import axios from "axios";
import Logout from "./Logout";
import { User } from "@/prisma/generated/prisma/client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [platformName, setPlatformName] = useState("Platform");
    const pathname = usePathname();
    const t = useTranslations("Common");
    const { data: session, status } = useSession();

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

    // Sync NextAuth session to user state
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setUser({
                // @ts-ignore
                id: session.user.id || "",
                name: session.user.name || "",
                email: session.user.email || "",
                // @ts-ignore
                role: session.user.role || "USER",
            } as any);
            setLoading(false);
        } else if (status === "unauthenticated") {
            // Only fetch from legacy API if NextAuth says unauthenticated
            const checkAuth = async () => {
                try {
                    const res = await axios.get("/api/auth/me");
                    if (res.data.authenticated) {
                        setUser(res.data.user);
                    } else {
                        setUser(null);
                    }
                } catch {
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };
            checkAuth();
        }
    }, [pathname, session, status]);

    // Detect scroll for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Predefined platform routes that should show the global header
    const platformRoutes = ["/", "/explore", "/pricing", "/contact", "/login", "/register"];

    // Do not show header on dashboard pages or business-specific slug pages
    const isDashboard = pathname.startsWith("/admin") ||
        pathname.startsWith("/owner") ||
        pathname.startsWith("/staff");

    const isPlatformPage = platformRoutes.includes(pathname);

    if (isDashboard) return null;

    if (!isPlatformPage) {
        return (
            <div className="fixed bottom-6 left-6 z-40">
                <Link
                    href="/"
                    className="flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-2xl hover:bg-black transition-all group active:scale-95"
                >
                    <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                        <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors pr-2">
                        {platformName}
                    </span>
                </Link>
            </div>
        );
    }

    const isAuthPage = pathname === "/login" || pathname === "/register";

    const navLinks = [
        { name: t("home"), href: "/" },
        { name: t("explore"), href: "/explore" },
        // { name: tNav("rooms"), href: "/rooms" }, // Added rooms as example, check if needed
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
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-sm font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-white/70 hover:text-white"
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
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
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-xl font-medium transition-all ${isActive
                                                ? "text-white bg-white/10 px-4 py-2 rounded-xl border-l-4 border-indigo-500"
                                                : "text-white/80 hover:text-white px-4 py-2"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
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
    );
};

export default Header;