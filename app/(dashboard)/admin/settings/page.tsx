"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { HiOutlineShieldCheck, HiOutlineGlobeAlt, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState("general")

    const tabs = [
        { id: "general", name: "عام", icon: <HiOutlineGlobeAlt /> },
        { id: "revenue", name: "الأرباح والاشتراكات", icon: <HiOutlineCurrencyDollar /> },
        { id: "users", name: "إدارة النظام", icon: <HiOutlineShieldCheck /> },
        { id: "limits", name: "حدود الباقات", icon: <HiOutlineAdjustmentsHorizontal /> },
    ]

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white flex items-center gap-4">
                    <HiOutlineAdjustmentsHorizontal className="text-indigo-500" />
                    إعدادات المنصة العامة
                </h1>
                <p className="text-zinc-500 mt-2 font-medium">التحكم في الإعدادات العالمية للمنصة، الباقات، والعمولات.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Tabs */}
                <div className="w-full lg:w-72 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32" />

                    {activeTab === "general" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8 relative"
                            dir="rtl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="اسم المنصة" icon={<HiOutlineGlobeAlt />} placeholder="Booking SaaS" />
                                <Input label="رابط الدعم الفني" icon={<HiOutlineGlobeAlt />} placeholder="https://support.example.com" />
                                <Input label="البريد الرسمي" icon={<HiOutlineGlobeAlt />} placeholder="admin@example.com" />
                                <div className="space-y-4">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest mr-2">حالة التسجيل</label>
                                    <div className="flex bg-zinc-950 p-2 rounded-2xl border border-white/5 gap-2">
                                        <button className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold text-xs border border-emerald-500/20">مفتوح</button>
                                        <button className="flex-1 py-3 text-zinc-600 rounded-xl font-bold text-xs hover:text-zinc-400 transition-colors">مغلق</button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <Button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-sm font-black">تحديث الإعدادات</Button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab !== "general" && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-xl font-bold text-white">إمارة الأرباح والنظام</h3>
                            <p className="text-zinc-500 mt-2 font-medium">هذه الخيارات تتطلب ربط نظام Stripe أولاً.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
