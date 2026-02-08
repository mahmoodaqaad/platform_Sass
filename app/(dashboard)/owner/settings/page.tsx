"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { HiOutlineCog6Tooth, HiOutlineBuildingOffice, HiOutlineBell, HiOutlineShieldCheck, HiOutlineCreditCard, HiOutlineCamera } from "react-icons/hi2"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { HiOutlinePlus } from "react-icons/hi"

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("business")

    const tabs = [
        { id: "business", name: "بيانات العمل", icon: <HiOutlineBuildingOffice /> },
        { id: "notifications", name: "التنبيهات", icon: <HiOutlineBell /> },
        { id: "security", name: "الأمان", icon: <HiOutlineShieldCheck /> },
        { id: "billing", name: "الاشتراكات", icon: <HiOutlineCreditCard /> },
    ]

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white flex items-center gap-4">
                    <HiOutlineCog6Tooth className="text-indigo-500" />
                    الإعدادات
                </h1>
                <p className="text-zinc-500 mt-2 font-medium">إدارة تفاصيل عملك، التنبيهات، وخيارات الأمان.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Tabs Sidebar */}
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

                {/* Form Content */}
                <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32" />

                    {activeTab === "business" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8 relative"
                            dir="rtl"
                        >
                            <div className="flex items-center gap-8 mb-10">
                                <div className="relative group">
                                    <div className="w-24 h-24 bg-zinc-800 rounded-3xl border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-indigo-500/50 group-hover:text-indigo-500 transition-all cursor-pointer">
                                        <HiOutlineCamera className="text-3xl" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs shadow-lg">
                                        <HiOutlinePlus />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">شعار العمل</h3>
                                    <p className="text-zinc-500 text-sm font-medium">يفضل استخدام صورة مربعة بحجم 512x512 بكسل.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="اسم العمل" icon={<HiOutlineBuildingOffice />} placeholder="مثلاً: صالون الحلاقة الراقي" />
                                <Input label="رقم السجل التجاري (اختياري)" icon={<HiOutlineShieldCheck />} placeholder="0000000000" />
                                <Input label="البريد الإلكتروني للعمل" icon={<HiOutlineBuildingOffice />} placeholder="business@example.com" />
                                <Input label="رقم الهاتف" icon={<HiOutlineBuildingOffice />} placeholder="+966 50 000 0000" />
                            </div>

                            <div className="space-y-4">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest mr-2">العنوان والوصف</label>
                                <textarea
                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-white font-medium focus:border-indigo-500/50 outline-none transition-all h-32"
                                    placeholder="اكتب وصفاً مختصراً لعملك..."
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <Button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-sm font-black">حفظ التغييرات</Button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab !== "business" && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-xl font-bold text-white">هذه الصفحة ستكون متاحة قريباً</h3>
                            <p className="text-zinc-500 mt-2 font-medium">نحن نعمل على تجهيز باقي الإعدادات لتجربة أفضل.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
