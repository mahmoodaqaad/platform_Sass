"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { HiSearch, HiFilter, HiGlobe, HiArrowRight } from "react-icons/hi";
import { HiMapPin } from "react-icons/hi2";
import { BiLoaderAlt } from "react-icons/bi";

interface Business {
    id: string;
    name: string;
    slug: string;
    type: string;
    description: string | null;
    logo: string | null;
    address: string | null;
    plan: string;
    defaultLanguage: string | null;
}

const ExploreList = () => {
    const t = useTranslations("Explore");
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const categories = [
        { key: "ALL", label: t("allCategories") },
        { key: "SALON", label: t("categories.SALON") },
        { key: "CLINIC", label: t("categories.CLINIC") },
        { key: "SPA", label: t("categories.SPA") },
        { key: "GYM", label: t("categories.GYM") },
        { key: "RESTAURANT", label: t("categories.RESTAURANT") },
        { key: "HOTEL", label: t("categories.HOTEL") },
        { key: "STORE", label: t("categories.STORE") },
        { key: "OTHER", label: t("categories.OTHER") },
    ];

    const fetchBusinesses = async () => {
        setLoading(true);
        try { 
            const response = await axios.get("/api/public/businesses", {
                params: {
                    q: searchQuery,
                    type: selectedCategory
                }
            });
            setBusinesses(response.data);
        } catch (error) {
            console.error("Error fetching businesses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchBusinesses();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchQuery, selectedCategory]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="min-h-screen bg-black text-white pt-32 pb-20 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black mb-6 bg-linear-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent"
                    >
                        {t("title")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/60 mb-12"
                    >
                        {t("subtitle")}
                    </motion.p>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <div className="relative flex-1 w-full">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                className="w-full bg-transparent border-none outline-0 py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:ring-0 text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide px-2">
                            <HiFilter className="text-white/40 w-5 h-5 md:hidden" />
                            {categories.slice(0, 4).map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.key
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-white/5 text-white/60 hover:bg-white/10"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Expanded categories for desktop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 flex flex-wrap justify-center gap-2"
                    >
                        {categories.slice(4).map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.key
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white/5 text-white/40 hover:bg-white/10"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Businesses Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <BiLoaderAlt className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-white/40 font-medium">Fetching best businesses...</p>
                    </div>
                ) : businesses.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {businesses.map((business) => (
                                <motion.div
                                    key={business.id}
                                    variants={cardVariants}
                                    layout
                                    className="group relative"
                                >
                                    {/* Glass Card */}
                                    <Link href={business.slug} target="_blank" className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-[32px] p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 flex flex-col">
                                        {/* Business Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/10 border border-white/10 transition-transform duration-500 group-hover:scale-110">
                                                {business.logo ? (
                                                    <Image
                                                        src={business.logo}
                                                        alt={business.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-linear-to-br from-indigo-500/20 to-purple-600/20">
                                                        {business.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            {(business.plan === "BUSINESS" || business.plan === "PRO") && (
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold tracking-widest uppercase">
                                                    {business.plan}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                                                {business.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                                                    {t(`categories.${business.type as any}`)}
                                                </span>
                                                {business.address && (
                                                    <span className="flex items-center gap-1">
                                                        <HiMapPin className="w-3 h-3" />
                                                        {business.address.split(",")[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white/60 line-clamp-2 text-sm leading-relaxed mb-6">
                                                {business.description || "No description available yet."}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <Link
                                                href={`/${business.defaultLanguage || "ar"}/${business.slug}`}
                                                className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group/link"
                                            >
                                                {t("visitWebsite")}
                                                <HiArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                            </Link>
                                            <div className="flex items-center gap-3">
                                                <button className="p-2 rounded-full bg-white/5 text-white/40 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all">
                                                    <HiGlobe className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-[34px] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <HiSearch className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{t("noResults")}</h3>
                        <p className="text-white/40">Try adjusting your filters or search keywords.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("ALL") }}
                            className="mt-6 text-indigo-400 font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default ExploreList;
