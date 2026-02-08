"use client"
import React from 'react'
import { HiOutlineCalendarDays, HiOutlineUserGroup, HiOutlineClock, HiOutlineChevronRight } from 'react-icons/hi2'
import Link from 'next/link'

const StaffDashboard = () => {
    const todayAppointments = [
        { id: 1, time: "10:00 AM", client: "Ahmed Ali", service: "حلاقة ذقن", status: "In Progress" },
        { id: 2, time: "11:30 AM", client: "Sara Mohamed", service: "تنظيف بشرة", status: "Upcoming" },
        { id: 3, time: "01:00 PM", client: "John Doe", service: "قص شعر", status: "Upcoming" },
    ]

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white">لوحة تحكم الموظف</h1>
                <p className="text-zinc-500 mt-2 font-medium">مرحباً بك! إليك جدول مواعيدك اليوم.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5">
                    <HiOutlineCalendarDays className="text-3xl text-indigo-500 mb-4" />
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">مواعيد اليوم</p>
                    <h3 className="text-3xl font-black text-white">8</h3>
                </div>
                <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5">
                    <HiOutlineClock className="text-3xl text-emerald-500 mb-4" />
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">ساعات العمل</p>
                    <h3 className="text-3xl font-black text-white">6h / 8h</h3>
                </div>
                <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5">
                    <HiOutlineUserGroup className="text-3xl text-purple-500 mb-4" />
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">العملاء المكتملون</p>
                    <h3 className="text-3xl font-black text-white">5</h3>
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white">جدول اليوم</h3>
                    <Link href="/staff/schedule" className="text-indigo-400 text-sm font-bold hover:underline flex items-center gap-1">
                        عرض الجدول الكامل <HiOutlineChevronRight />
                    </Link>
                </div>
                <div className="space-y-4">
                    {todayAppointments.map(app => (
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
                                {app.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StaffDashboard
