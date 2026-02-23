"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    HiOutlineCalendarDays,
    HiOutlineClock,
    HiOutlineMapPin,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiCheck,
    HiOutlineXMark as HiCloseIcon
} from "react-icons/hi2"
import axios from "axios"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"

interface AppointmentData {
    id: string;
    customerName: string;
    serviceName: string;
    serviceDur: number;
    startTime: string;
    status: string;
}

const StaffSchedule = () => {
    const t = useTranslations("D.staff.schedule");
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [appointments, setAppointments] = useState<AppointmentData[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    const hours = Array.from({ length: 16 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`) // 08:00 to 23:00

    useEffect(() => {
        fetchAppointment()
    }, [])

    const fetchAppointment = async () => {
        try {
            setLoading(true)
            const res = await axios.get("/api/staff/schedule")
            setAppointments(res.data)
        } catch (error) {
            console.error("Fetch schedule error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (appointmentId: string, status: string) => {
        try {
            setUpdating(appointmentId)
            await axios.patch("/api/staff/schedule", { appointmentId, status })
            toast.success(status === 'COMPLETED' ? "تم إكمال الحجز وتسجيل الإيرادات" : "تم إلغاء الحجز")
            fetchAppointment()
        } catch (error) {
            console.error("Update status error:", error)
            toast.error("فشل تحديث الحالة")
        } finally {
            setUpdating(null)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10';
            case 'PENDING': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20 shadow-indigo-500/10';
            case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/20 shadow-red-500/10';
            case 'COMPLETED': return 'bg-sky-500/20 text-sky-400 border-sky-500/20 shadow-sky-500/10';
            default: return 'bg-zinc-900 border-white/5';
        }
    }

    const handlePrevDay = () => {
        const d = new Date(selectedDate)
        d.setDate(d.getDate() - 1)
        setSelectedDate(d)
    }

    const handleNextDay = () => {
        const d = new Date(selectedDate)
        d.setDate(d.getDate() + 1)
        setSelectedDate(d)
    }

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const filteredAppointments = appointments.filter(a => {
        const appDate = new Date(a.startTime);
        return appDate.toDateString() === selectedDate.toDateString();
    });

    const displayDate = selectedDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineCalendarDays className="text-indigo-500" />
                        {t("title")}
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
                </div>
                <div className="flex bg-zinc-900 border border-white/5 rounded-2xl p-2 gap-2">
                    <button
                        onClick={handleNextDay}
                        className="p-3 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all">
                        <HiOutlineChevronRight />
                    </button>
                    <div className="px-6 flex items-center font-bold text-white text-sm min-w-[200px] justify-center text-center">
                        {displayDate}
                    </div>
                    <button
                        onClick={handlePrevDay}
                        className="p-3 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all">
                        <HiOutlineChevronLeft />
                    </button>
                </div>
            </div>

            {/* Schedule View */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -ml-32 -mt-32" />

                <div className="relative space-y-6">
                    {hours.map((hour, i) => {
                        const app = filteredAppointments?.find(a => {
                            const time = new Date(a.startTime);
                            const h = time.getHours().toString().padStart(2, '0');
                            return h === hour.split(":")[0];
                        })
                        return (
                            <div key={i} className="flex gap-8 group">
                                <div className="w-20 pt-2 text-right">
                                    <span className="text-zinc-500 font-black text-xs uppercase tracking-widest group-hover:text-white transition-colors">{hour}</span>
                                </div>

                                <div className="flex-1 relative">
                                    {/* Line */}
                                    <div className="absolute top-4 left-0 right-0 h-px bg-white/5 group-hover:bg-white/10 transition-colors" />

                                    {app ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`relative z-10 -mt-2 p-6 rounded-3xl border ${getStatusColor(app.status)} shadow-xl backdrop-blur-sm group-hover:translate-x-2 transition-all`}
                                            dir="rtl"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <h3 className="font-black text-lg">{app.customerName}</h3>
                                                    {(app.status !== 'COMPLETED' && app.status !== 'CANCELLED') && (
                                                        <div className="flex items-center gap-2 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleStatusUpdate(app.id, 'COMPLETED')}
                                                                disabled={!!updating}
                                                                className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                                                                title={t("complete")}
                                                            >
                                                                <HiCheck className="text-lg" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(app.id, 'CANCELLED')}
                                                                disabled={!!updating}
                                                                className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                                                                title={t("cancel")}
                                                            >
                                                                <HiCloseIcon className="text-lg" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                                        {app.status === 'CONFIRMED' ? t("confirmed") :
                                                            app.status === 'COMPLETED' ? 'مكتمل' :
                                                                app.status === 'CANCELLED' ? 'ملغي' :
                                                                    app.status}
                                                    </span>
                                                    <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-lg">
                                                        {new Date(app.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 text-xs font-bold opacity-80">
                                                    <HiOutlineClock className="text-lg" />
                                                    {t("duration", { duration: app.serviceDur })}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold opacity-80">
                                                    <HiOutlineMapPin className="text-lg" />
                                                    {t("station")}
                                                </div>
                                                <div className="mr-auto text-xs font-black px-4 py-1.5 bg-white/10 rounded-full border border-white/5 text-white/90">
                                                    {app.serviceName}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/5">
                                            <span className="text-zinc-500 text-xs font-bold font-mono">+ {t("addBreak")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default StaffSchedule
