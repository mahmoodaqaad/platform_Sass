"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import axios from "axios";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

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
            } catch (err) {
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

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
            setUser(null);
            setShowLogoutModal(false); // Close modal after successful logout
            router.push("/");
            router.refresh();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (isDashboard) return null;

    const isAuthPage = pathname === "/login" || pathname === "/register";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "/contact" },
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
            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative"
                        >
                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -mr-16 -mt-16" />

                            <div className="relative text-center">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <HiX className="text-4xl text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">تسجيل الخروج؟</h3>
                                <p className="text-zinc-400 mb-8 font-medium">هل أنت متأكد أنك تريد مغادرة المنصة؟ سنفتقدك!</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="py-4 px-6 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all active:scale-95"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="py-4 px-6 rounded-2xl bg-linear-to-r from-red-600 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-red-600/20 transition-all active:scale-95"
                                    >
                                        خروج
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            Platform
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
                        {isAuthPage ? (
                            <Link
                                href="/"
                                className="px-6 py-2 rounded-xl text-white font-medium border border-white/10 hover:bg-white/5 transition"
                            >
                                Back to Home
                            </Link>
                        ) : loading ? (
                            <div className="w-24 h-10 bg-white/5 animate-pulse rounded-xl" />
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href={getDashboardLink()}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="px-4 py-2 text-red-400 hover:text-red-300 font-medium transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-white/80 hover:text-white font-medium transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    {!isAuthPage && (
                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                        </button>
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
                                            <Link
                                                href={getDashboardLink()}
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-4 text-center rounded-xl bg-white/5 text-white font-medium"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => { setShowLogoutModal(true); setIsOpen(false); }}
                                                className="w-full py-4 text-center rounded-xl bg-red-500/10 text-red-500 font-medium"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-4 text-center rounded-xl bg-white/5 text-white font-medium"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-4 text-center rounded-xl bg-indigo-600 text-white font-medium"
                                            >
                                                Get Started
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