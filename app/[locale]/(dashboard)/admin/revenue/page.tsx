"use client"
import React, { useEffect, useState } from "react";
import {
    HiOutlineCurrencyDollar,
    
    HiOutlineBriefcase,
    HiOutlineChartBar,
    HiOutlineArrowTrendingUp,
    HiOutlineIdentification
} from "react-icons/hi2"; 
import axios from "axios";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { HiOutlineTrendingUp } from "react-icons/hi";

interface RevenueData {
    summary: {
        totalGMV: number;
        estimatedMRR: number;
        activeSubs: number;
    };
    trends: { month: string; gmv: number; subscriptions: number }[];
    topBusinesses: { name: string; logo: string | null; plan: string; volume: number }[];
    recentActivity: { id: string; name: string; plan: string; createdAt: string }[];
}

const AdminRevenuePage = () => {
    const t = useTranslations("D.admin.overview.revenue");
    const locale = useLocale();
    const [data, setData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/admin/revenue");
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch admin revenue data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        {
            label: t("estimatedMRR"),
            value: `$${data.summary.estimatedMRR.toLocaleString()}`,
            icon: HiOutlineCurrencyDollar,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            desc: "صافي دخل المنصة الشهري"
        },
        {
            label: t("totalGMV"),
            value: `$${data.summary.totalGMV.toLocaleString()}`,
            icon: HiOutlineArrowTrendingUp,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            desc: "إجمالي مبيعات المحلات"
        },
        {
            label: t("activeSubs"),
            value: data.summary.activeSubs,
            icon: HiOutlineIdentification,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            desc: "متاجر مشتركة حالياً"
        }
    ];

    const maxTrendValue = Math.max(...data.trends.map(t => Math.max(t.gmv, t.subscriptions)));

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-black text-white">{t("title")}</h1>
                <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
            </motion.div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border border-white/5 relative z-10`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                            <p className="text-[10px] text-zinc-600 mt-2 font-bold">{stat.desc}</p>
                        </div>
                        <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
                            <stat.icon className="text-8xl" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visual Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{t("chartTitle")}</h3>
                            <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t("subscriptionRevenue")}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> {t("platformThroughput")}
                                </div>
                            </div>
                        </div>
                        <HiOutlineTrendingUp className="text-4xl text-white/5" />
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-white/5">
                        {data.trends.map((month, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                                <div className="w-full flex justify-center gap-1.5 h-full items-end pb-1">
                                    {/* Subscriptions Bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(month.subscriptions / maxTrendValue) * 100}%` }}
                                        className="w-4 bg-linear-to-t from-emerald-600 to-emerald-400 rounded-t-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:brightness-125 transition-all"
                                    />
                                    {/* GMV Bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(month.gmv / maxTrendValue) * 100}%` }}
                                        className="w-4 bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-lg shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:brightness-125 transition-all"
                                    />
                                </div>
                                <span className="text-[10px] font-black text-zinc-600 group-hover:text-white mb-2">{month.month}</span>

                                {/* Tooltip on Hover */}
                                <div className="absolute -top-16 bg-zinc-800 border border-white/10 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none min-w-[120px] shadow-2xl">
                                    <p className="text-[10px] text-emerald-400 font-black mb-1">${month.subscriptions.toLocaleString()}</p>
                                    <p className="text-[10px] text-indigo-400 font-black">${month.gmv.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Performers */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col"
                >
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <HiOutlineChartBar className="text-indigo-500" />
                        {t("topBusinesses")}
                    </h3>
                    <div className="space-y-6 flex-1">
                        {data.topBusinesses.map((biz, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-indigo-400 border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        {biz.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{biz.name}</p>
                                        <p className="text-[10px] text-zinc-600 font-black tracking-tighter uppercase">{biz.plan}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">${biz.volume.toLocaleString()}</p>
                                    <p className="text-[9px] text-zinc-600 font-bold">GMV</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Subscriber Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -ml-32 -mt-32" />

                <div className="relative">
                    <h3 className="text-xl font-bold text-white mb-8">{t("recentActivity")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.recentActivity.map((sub, i) => (
                            <div key={i} className="p-6 bg-black/20 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <HiOutlineBriefcase className="text-emerald-400 text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{sub.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-black uppercase text-emerald-500/80 tracking-widest">{sub.plan}</span>
                                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                        <span className="text-[9px] text-zinc-500 font-bold">{new Date(sub.createdAt).toLocaleDateString(locale)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRevenuePage;
