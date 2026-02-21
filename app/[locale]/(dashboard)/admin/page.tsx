"use client"
import { useEffect, useState } from 'react'
import { HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlineChevronRight } from 'react-icons/hi2'
import { Link } from '@/i18n/routing'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'

interface Stat {
    name: string;
    value: string;
    icon: any;
    color: string;
    bg: string;
    change?: string;
    active?: number;
    type: string;
}

interface RecentUser {
    id: string;
    name: string;
    role: string;
    status: string;
    createdAt: string;
}

const AdminOverview = () => {
    const t = useTranslations("D.admin.overview");
    const tRoles = useTranslations("Roles");
    const locale = useLocale();
    const [stats, setStats] = useState<Stat[]>([])
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
    const [health, setHealth] = useState({ database: 0, responseTime: "0ms", dbLatency: "0ms", integrityScore: 100 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/admin/stats")

                const { stats: apiStats, recentUsers: apiUsers, health: apiHealth } = res.data

                // Map icons and colors to backend data
                const mappedStats = apiStats.map((s: any) => {
                    const base = { name: s.name, value: s.value, type: s.type }
                    if (s.type === "users") return { ...base, icon: HiOutlineUserGroup, color: "text-blue-400", bg: "bg-blue-500/10", change: s.change }
                    if (s.type === "businesses") return { ...base, icon: HiOutlineOfficeBuilding, color: "text-indigo-400", bg: "bg-indigo-500/10", active: s.active }
                    if (s.type === "revenue") return { ...base, icon: HiOutlineCurrencyDollar, color: "text-emerald-400", bg: "bg-emerald-500/10" }
                    if (s.type === "growth") return { ...base, icon: HiOutlineChartBar, color: "text-purple-400", bg: "bg-purple-500/10" }
                    return base
                })

                setStats(mappedStats)
                setRecentUsers(apiUsers)
                setHealth(apiHealth)
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-black text-white">{t("title")}</h1>
                <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-indigo-500/20 transition-all group"
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border border-white/5`}>
                            {stat.icon && <stat.icon className="text-2xl" />}
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">
                                    {t(`stats.${stat.type}` as any)}
                                </p>
                                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                            </div>
                            {stat.change && (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg font-black">
                                    {t("stats.thisMonth", {count:stat.change})}
                                </span>
                            )}
                        </div>
                        {stat.active !== undefined && (
                            <p className="text-[10px] text-zinc-600 mt-4 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                {t("stats.activeNow", { count: stat.active })}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Users List */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t("recentUsers.title")}</h3>
                        <Link href="/admin/users" className="text-indigo-400 text-sm font-bold hover:underline flex items-center gap-1">
                            {t("recentUsers.viewAll")} <HiOutlineChevronRight className='rtl:rotate-180' />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentUsers.length > 0 ? recentUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center font-black text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                                        {(user.name?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold group-hover:text-indigo-300 transition-colors">{user.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                                                {tRoles(user.role.toLowerCase() as any)}
                                            </span>
                                            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                            <span className="text-zinc-600 text-[10px] font-medium">{new Date(user.createdAt).toLocaleDateString(locale)}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ${user.status === 'Active'
                                    ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20'
                                    : 'bg-orange-500/10 text-orange-500 ring-orange-500/20'
                                    }`}>
                                    {user.status === 'Active' ? t("recentUsers.active") : t("recentUsers.noUsers")}
                                </span>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-zinc-600 font-bold italic border border-white/5 border-dashed rounded-3xl">{t("recentUsers.noUsers")}</p>
                        )}
                    </div>
                </motion.div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full group-hover:bg-indigo-600/20 transition-all" />
                    <h3 className="text-2xl font-black mb-10 relative flex items-center gap-3 justify-end text-right">
                        {t("health.title")}
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </h3>

                    <div className="space-y-10 relative">
                        <div className="group/stat">
                            <div className="flex justify-between text-sm font-bold mb-3">
                                <span className="text-zinc-400 group-hover/stat:text-white transition-colors">{t("health.dbConnection")} ({health.dbLatency})</span>
                                <span className="text-emerald-400 font-black">{health.database.toFixed(0)}%</span>
                            </div>
                            <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${health.database}%` }}
                                    className="h-full bg-linear-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                />
                            </div>
                        </div>

                        <div className="group/stat">
                            <div className="flex justify-between text-sm font-bold mb-3">
                                <span className="text-zinc-400 group-hover/stat:text-white transition-colors">{t("health.responseTime")}</span>
                                <span className="text-indigo-400 font-black">{health.responseTime}</span>
                            </div>
                            <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "92%" }}
                                    // animate={{ width: `${100 - Number(health?.responseTime?.replace("ms", ""))}%` }}
                                    className="h-full bg-linear-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                />
                            </div>
                        </div>

                        <div className="pt-8 grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">{t("health.dataIntegrity")}</p>
                                <p className="text-lg font-black text-white">{health.integrityScore}%</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">{t("health.availability")}</p>
                                <p className="text-lg font-black text-white">99.9%</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20">
                        {t("health.downloadReport")}
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default AdminOverview
