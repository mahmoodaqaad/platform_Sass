import axios from 'axios';
import { User } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { SetStateAction, useState } from 'react'
import { HiLogout, HiX } from 'react-icons/hi';
import { signOut } from 'next-auth/react';

import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

const Logout = ({ dash = true, setUser, isCollapsed }: { dash: boolean, setUser: React.Dispatch<SetStateAction<User | null>>, isCollapsed: boolean }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter()
    const t = useTranslations("Common")
    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            await axios.post("/api/auth/logout");
            setShowLogoutModal(false);
            if (!dash) {
                setUser(null);
            }
            router.push("/");
            router.refresh();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const modalMarkup = (
        <AnimatePresence>
            {showLogoutModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative"
                    >
                        {/* Decorative Blur */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -mr-16 -mt-16" />

                        <div className="relative text-center" dir="rtl">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiX className="text-4xl text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t("logout.title")}</h3>
                            <p className="text-zinc-400 mb-8 font-medium">{t("logout.subtitle")}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="py-4 px-6 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all active:scale-95"
                                >
                                    {t("logout.no")}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="py-4 px-6 rounded-2xl bg-linear-to-r from-red-600 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-red-600/20 transition-all active:scale-95"
                                >
                                    {t("logout.ok")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {
                !dash ?
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="px-4 py-2 text-red-400 hover:text-red-300 font-medium transition"
                    >
                        {t("logout.btn")}
                    </button>

                    : <div className="p-4 overflow-hidden">
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full flex items-center gap-4 p-4 rounded-4xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all group"
                        >
                            <HiLogout className="text-2xl transition-transform group-hover:scale-110" />
                            {!isCollapsed && <span className="font-bold text-sm tracking-wide">{t("logout.btn")}</span>}
                        </button>
                    </div>
            }

            {mounted && createPortal(modalMarkup, document.body)}
        </>
    )
}

export default Logout