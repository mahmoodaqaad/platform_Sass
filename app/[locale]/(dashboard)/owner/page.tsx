"use client"
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import {
    HiPlus,
    HiArrowSmUp,
    HiArrowSmDown,
    HiSparkles,
    HiBell,
    HiMail,
    HiCalendar,
    HiOutlineCalendar
} from "react-icons/hi";
import axios from "axios";
import SubscriptionWarning from "@/components/owner/SubscriptionWarning";
import { toast } from "react-toastify"
import { useTranslations, useLocale } from "next-intl";
import { AppointmentData, BusinessData } from "@/lib/types";
import { Link } from "@/i18n/routing";



export default function OwnerDashboard() {
    const t = useTranslations("D.owner.overview");
    const tStats = useTranslations("D.owner.overview.stats");
    const tRecent = useTranslations("D.owner.overview.recent");
    const tAuto = useTranslations("D.owner.overview.automation");
    const tAppStatus = useTranslations("D.owner.appointments.status");

    const locale = useLocale();

    const [business, setBusiness] = useState<BusinessData | null>(null);
    const [recentAppointments, setRecentAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{
        revenue: { value: string | number; change: string; trend: string };
        appointments: { value: string | number; change: string; trend: string };
        customers: { value: string | number; change: string; trend: string };
        pendingOrders: { value: string | number };
    } | null>(null);
    const fetchData = async () => {
        try {
            const [bizRes, statsRes, appointmentsRes] = await Promise.all([
                axios.get("/api/owner/business"),
                axios.get("/api/owner/stats"),
                axios.get("/api/owner/appointments?limit=8")
            ]);
            console.log(statsRes);
            
            setBusiness(bizRes.data);
            setStats(statsRes.data);
            setRecentAppointments(appointmentsRes.data.appointments || []);
        } catch (error) {
            console.error("Fetch data error:", error);
        } finally {
            setLoading(false);
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    if (!mounted) return null;

    const toggleAutomation = async (type: 'remindersEnabled' | 'marketingAutomation', current: boolean) => {
        try {
            await axios.post("/api/owner/automation", { [type]: !current });
            setBusiness((prev) => prev ? { ...prev, [type]: !current } : null);
            toast.success(tAuto("updated"));
        } catch {
            toast.error(tAuto("failed"));
        }
    };



    const statCards = [
        {
            name: tStats("revenue"),
            value: stats ? `₪${stats.revenue.value}` : "₪0",
            change: stats?.revenue.change,
            trend: stats?.revenue.trend,
            color: "text-emerald-400"
        },
        {
            name: tStats("appointments"),
            value: stats?.appointments.value || "0",
            change: stats?.appointments.change,
            trend: stats?.appointments.trend,
            color: "text-indigo-400"
        },
        {
            name: tStats("customers"),
            value: stats?.customers.value || "0",
            change: stats?.customers.change,
            trend: stats?.customers.trend,
            color: "text-purple-400"
        },
        {
            name: tStats("pending"),
            value: stats?.pendingOrders.value || "0",
            change: "",
            trend: "neutral",
            color: "text-rose-400"
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white">{t("title", { name: business?.name || "Member" })}</h1>
                    <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
                </div>
                <Button theme="primary" className="w-full md:w-auto py-3! px-6! text-sm font-bold shadow-lg shadow-indigo-600/20">
                    <HiPlus className="text-xl" />
                    {t("quickAction")}
                </Button>
            </div>

            {/* Subscription Warning */}
            {business && business.plan && (
                <SubscriptionWarning
                    plan={business.plan as "BASIC" | "PRO" | "BUSINESS" | "ENTERPRISE"}
                    subscriptionEnd={business.subscriptionEnd ? new Date(business.subscriptionEnd) : null}
                />
            )}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => {
                    const CardContent = (
                        <div className="p-8 rounded-4xl bg-zinc-900 border border-white/5 hover:border-indigo-500/20 transition-all group h-full cursor-pointer">
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-4">{stat.name}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                                {stat.change && (
                                    <div className={`flex items-center gap-1 text-xs font-black ${stat.color} bg-white/5 px-3 py-1 rounded-full border border-white/5`}>
                                        {stat.trend === "up" ? <HiArrowSmUp /> : stat.trend === "down" ? <HiArrowSmDown /> : null}
                                        {stat.change}
                                    </div>
                                )}
                            </div>
                        </div>
                    );

                    return stat.name === tStats("revenue") ? (
                        <Link key={i} href="/owner/revenue" className="block transform hover:scale-[1.02] transition-transform">
                            {CardContent}
                        </Link>
                    ) : (
                        <div key={i}>{CardContent}</div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity Mini-Section */}
                <div className="lg:col-span-2 p-8 rounded-4xl bg-zinc-900 border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <HiSparkles className="text-indigo-400" />
                            {tRecent("title")}
                        </h3>
                        <Link href={"/owner/appointments"} className="text-zinc-500 text-xs font-black uppercase hover:text-blue-500 transition-colors tracking-widest">{tRecent("viewAll")}</Link>
                    </div>

                    {recentAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {recentAppointments.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/2 border border-white/5 hover:border-indigo-500/20 transition-all group overflow-hidden relative">
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-xl border border-indigo-500/20">
                                            {app.customer?.name?.charAt(0) || <HiOutlineCalendar />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="text-white font-bold text-lg">{app.customer?.name || "Unknown"}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${app.status === 'CONFIRMED' || app.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                                                        'bg-zinc-500/10 text-zinc-400'
                                                    }`}>
                                                    {tAppStatus((app.status?.toLowerCase() as "pending" | "confirmed" | "cancelled" | "completed") || 'pending')}
                                                </span>
                                            </div>
                                            <p className="text-zinc-500 font-medium text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                {app.service?.name || "Service"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="text-left">
                                            <p className="text-white font-black text-lg">
                                                {app.startTime ? new Date(app.startTime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                            </p>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight">
                                                {app.startTime ? new Date(app.startTime).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' }) : "---"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                <HiCalendar className="text-3xl text-zinc-700" />
                            </div>
                            <span className="text-zinc-600 font-bold">{tRecent("noAppointments")}</span>
                        </div>
                    )}
                </div>

                {/* Automation & Tips */}
                <div className="space-y-8">
                    {/* Automation Card */}
                    <div className="p-8 rounded-4xl bg-zinc-900 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full" />
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <HiSparkles className="text-amber-400" />
                            {tAuto("title")}
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                        <HiBell className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{tAuto("reminders")}</p>
                                        <p className="text-zinc-500 text-xs">{tAuto("remindersDesc")}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleAutomation('remindersEnabled', !!business?.remindersEnabled)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${business?.remindersEnabled ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-zinc-800'
                                        }`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${business?.remindersEnabled ? 'left-7' : 'left-1'
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                                        <HiMail className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{tAuto("marketing")}</p>
                                        <p className="text-zinc-500 text-xs">{tAuto("marketingDesc")}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleAutomation('marketingAutomation', !!business?.marketingAutomation)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${business?.marketingAutomation ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-zinc-800'
                                        }`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${business?.marketingAutomation ? 'left-7' : 'left-1'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-4xl bg-linear-to-br from-indigo-600 to-purple-800 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/10 blur-3xl rounded-full" />
                        <h3 className="text-2xl font-black mb-4 relative">{t("tip.title")}</h3>
                        <p className="opacity-80 leading-relaxed mb-6 relative font-medium text-sm">
                            {t("tip.description")}
                        </p>
                        <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-zinc-100 transition-all active:scale-95 relative text-sm">
                            {t("tip.button")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
