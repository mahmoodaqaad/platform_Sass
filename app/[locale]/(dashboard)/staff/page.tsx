"use client"
import React, { useEffect, useState } from 'react'
import { HiOutlineCalendarDays, HiOutlineUserGroup, HiOutlineClock, HiOutlineChevronRight } from 'react-icons/hi2'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import axios from 'axios'

const StaffDashboard = () => {
    const t = useTranslations("D.staff.dashboard");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/staff/stats");
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch staff stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const stats = [
        { label: t("stats.appointments"), value: data?.stats?.today || 0, icon: HiOutlineCalendarDays, color: "text-indigo-500" },
        { label: t("stats.hours"), value: data?.stats?.workingHours || "0h", icon: HiOutlineClock, color: "text-emerald-500" },
        { label: t("stats.completed"), value: data?.stats?.completed || 0, icon: HiOutlineUserGroup, color: "text-purple-500" },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white">{t("title")}</h1>
                <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="p-8 rounded-4xl bg-zinc-900 border border-white/5">
                        <stat.icon className={`text-3xl ${stat.color} mb-4`} />
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Today's Schedule */}
            <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white">{t("schedule.title")}</h3>
                    <Link href="/staff/schedule" className="text-indigo-400 text-sm font-bold hover:underline flex items-center gap-1">
                        {t("schedule.viewAll")} <HiOutlineChevronRight />
                    </Link>
                </div>
                <div className="space-y-4">
                    {data?.recent?.length > 0 ? data.recent.map((app: any) => (
                        <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all gap-4">
                            <div className="flex items-center gap-6">
                                <div className="text-indigo-400 font-black text-lg min-w-[100px]">{app.time}</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">{app.client}</h4>
                                    <p className="text-zinc-500 text-sm font-medium">{app.service}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase w-fit ${app.status === 'In Progress' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-zinc-500'
                                }`}>
                                {app.status === 'Upcoming' ? t("status.upcoming") : app.status === 'In Progress' ? t("status.inProgress") : t("status.completed")}
                            </span>
                        </div>
                    )) : (
                        <p className="text-zinc-500 text-center py-10 font-bold">لا توجد مواعيد قادمة اليوم</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StaffDashboard
