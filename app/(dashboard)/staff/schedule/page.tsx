"use client"
import React from "react"
import { motion } from "framer-motion"
import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2"

const StaffSchedule = () => {
    const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
    const appointments = [
        { time: "10:00", client: "عمر خالد", service: "حلاقة ذقن", duration: "30m", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20" },
        { time: "12:00", client: "إبراهيم محمد", service: "تنظيف بشرة", duration: "60m", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
        { time: "15:00", client: "وليد سليمان", service: "قص شعر", duration: "45m", color: "bg-purple-500/20 text-purple-400 border-purple-500/20" },
    ]

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineCalendarDays className="text-indigo-500" />
                        جدولي الزمني
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">عرض وإدارة مواعيد العمل الخاصة بك لليوم.</p>
                </div>
                <div className="flex bg-zinc-900 border border-white/5 rounded-2xl p-2 gap-2">
                    <button className="p-3 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><HiOutlineChevronRight /></button>
                    <div className="px-6 flex items-center font-bold text-white text-sm">الأحد، 10 فبراير 2024</div>
                    <button className="p-3 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><HiOutlineChevronLeft /></button>
                </div>
            </div>

            {/* Schedule View */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -ml-32 -mt-32" />

                <div className="relative space-y-6">
                    {hours.map((hour, i) => {
                        const app = appointments.find(a => a.time === hour)
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
                                            className={`relative z-10 -mt-2 p-6 rounded-3xl border ${app.color} shadow-xl backdrop-blur-sm group-hover:translate-x-2 transition-all cursor-pointer`}
                                            dir="rtl"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-black text-lg">{app.client}</h3>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">مؤكد</span>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 text-xs font-bold opacity-80">
                                                    <HiOutlineClock className="text-lg" />
                                                    {app.duration}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold opacity-80">
                                                    <HiOutlineMapPin className="text-lg" />
                                                    المحطة الرئيسية
                                                </div>
                                                <div className="mr-auto text-xs font-black px-4 py-1.5 bg-white/10 rounded-full border border-white/5">
                                                    {app.service}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/5">
                                            <span className="text-zinc-500 text-xs font-bold font-mono">+ إضافة فترة راحة</span>
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
