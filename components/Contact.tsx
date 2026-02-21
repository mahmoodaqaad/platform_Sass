"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiMail, HiPhone, HiLocationMarker, HiArrowRight } from "react-icons/hi";
import { useTranslations } from "next-intl";

const Contact = () => {
    const t = useTranslations("Contact");
    const tInfo = useTranslations("Contact.info");
    const tForm = useTranslations("Contact.form");

    return (
        <section id="contact" className="py-24 bg-[#050505] text-white relative overflow-hidden">
            {/* Abstract Background Element */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] z-0 translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Contact Info */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black mb-8"
                        >
                            {t("title")} <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">{t("titleHighlight")}</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-400 text-lg mb-12 max-w-md"
                        >
                            {t("subtitle")}
                        </motion.p>

                        <div className="space-y-8">
                            {[
                                { icon: <HiMail />, label: tInfo("email"), val: "mahmmodaqaad@gmil.com" },
                                { icon: <HiPhone />, label: tInfo("phone"), val: "+970 599 23041" },
                                { icon: <HiLocationMarker />, label: tInfo("office"), val: "Palestine, Gaza" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-center gap-6 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-sm font-medium">{item.label}</p>
                                        <p className="text-white font-bold text-lg">{item.val}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-[2.5rem] bg-zinc-950/50 border border-zinc-900 backdrop-blur-3xl shadow-2xl"
                    >
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 px-1">{tForm("fullName")}</label>
                                    <input
                                        type="text"
                                        placeholder={tForm("fullNamePlaceholder")}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 px-1">{tForm("email")}</label>
                                    <input
                                        type="email"
                                        placeholder={tForm("emailPlaceholder")}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 px-1">{tForm("subject")}</label>
                                <input
                                    type="text"
                                    placeholder={tForm("subjectPlaceholder")}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 px-1">{tForm("message")}</label>
                                <textarea
                                    rows={4}
                                    placeholder={tForm("messagePlaceholder")}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 group"
                            >
                                {tForm("submit")}
                                <HiArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
