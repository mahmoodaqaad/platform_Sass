"use client"
import React, { useEffect, useState } from "react";
import {
    HiOutlineCurrencyDollar,
    HiOutlineTrendingUp,
    HiOutlineShoppingBag,
    HiOutlineChartBar,
    HiArrowSmUp,
    HiArrowSmDown,
    HiOutlineClock
} from "react-icons/hi";
import axios from "axios";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface RevenueStats {
    totalRevenue: number;
    currentMonthRevenue: number;
    totalOrders: number;
    averageOrder: number;
    growth: number;
}

interface Transaction {
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: string;
}

interface ServiceStat {
    name: string;
    revenue: number;
    count: number;
}

interface MonthlyData {
    month: string;
    revenue: number;
}

export default function RevenuePage() {
    const t = useTranslations("D.owner.revenue");
    const locale = useLocale();
    const dateLocale = locale === 'ar' ? ar : enUS;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        stats: RevenueStats;
        monthlyData: MonthlyData[];
        recentTransactions: Transaction[];
        topServices: ServiceStat[];
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/owner/revenue");
                setData(res.data);
            } catch (error) {
                console.error("Fetch revenue error:", error);
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

    const maxMonthlyRevenue = Math.max(...data.monthlyData.map(d => d.revenue), 100);

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white">{t("title")}</h1>
                <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-4xl bg-zinc-900 border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                            <HiOutlineCurrencyDollar className="text-2xl" />
                        </div>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{t("totalRevenue")}</p>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-4xl font-black text-white">₪{data.stats.totalRevenue.toLocaleString()}</h3>
                        <div className={`flex items-center gap-1 text-xs font-black ${data.stats.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'} bg-white/5 px-3 py-1 rounded-full border border-white/5`}>
                            {data.stats.growth >= 0 ? <HiArrowSmUp /> : <HiArrowSmDown />}
                            {Math.abs(data.stats.growth).toFixed(1)}%
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-4xl bg-zinc-900 border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <HiOutlineTrendingUp className="text-2xl" />
                        </div>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{t("averageOrder")}</p>
                    </div>
                    <h3 className="text-4xl font-black text-white">₪{data.stats.averageOrder.toFixed(0)}</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-4xl bg-zinc-900 border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                            <HiOutlineShoppingBag className="text-2xl" />
                        </div>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{t("totalOrders")}</p>
                    </div>
                    <h3 className="text-4xl font-black text-white">{data.stats.totalOrders}</h3>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 p-8 rounded-4xl bg-zinc-900 border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                        <HiOutlineChartBar className="text-indigo-400" />
                        {t("revenueTrend")}
                    </h3>

                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {data.monthlyData.map((month, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="w-full relative flex flex-col justify-end h-full">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(month.revenue / maxMonthlyRevenue) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="w-full bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-xl group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all relative"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-zinc-900 px-3 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ₪{month.revenue}
                                        </div>
                                    </motion.div>
                                </div>
                                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{month.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Services */}
                <div className="p-8 rounded-4xl bg-zinc-900 border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-8">{t("topServices")}</h3>
                    <div className="space-y-6">
                        {data.topServices.map((service, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-white font-bold text-sm">{service.name}</p>
                                    <p className="text-zinc-500 text-xs font-black">₪{service.revenue}</p>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(service.revenue / Math.max(...data.topServices.map(s => s.revenue))) * 100}%` }}
                                        className="h-full bg-linear-to-r from-purple-500 to-indigo-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="lg:col-span-3 p-8 rounded-4xl bg-zinc-900 border border-white/5 overflow-hidden">
                    <h3 className="text-xl font-bold text-white mb-8">{t("transactions.title")}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-left">
                                    <th className="pb-4 px-2">{t("transactions.customer")}</th>
                                    <th className="pb-4 px-2">{t("transactions.amount")}</th>
                                    <th className="pb-4 px-2">{t("transactions.date")}</th>
                                    <th className="pb-4 px-2">{t("transactions.status")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-white/2 hover:bg-white/1 transition-colors group">
                                        <td className="py-5 px-2">
                                            <p className="text-white font-bold text-sm">{tx.customer}</p>
                                            <p className="text-zinc-600 text-[10px] tracking-tight">{tx.id}</p>
                                        </td>
                                        <td className="py-5 px-2">
                                            <span className="text-white font-black">₪{tx.amount}</span>
                                        </td>
                                        <td className="py-5 px-2">
                                            <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                                <HiOutlineClock />
                                                {format(new Date(tx.date), "dd MMM yyyy", { locale: dateLocale })}
                                            </div>
                                        </td>
                                        <td className="py-5 px-2">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
