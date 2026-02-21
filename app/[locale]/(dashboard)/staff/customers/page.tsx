"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineUsers, HiOutlinePhone, HiOutlineEnvelope, HiOutlineChatBubbleLeftEllipsis, HiOutlineMagnifyingGlass } from "react-icons/hi2"

const StaffCustomers = () => {
    const [customers, setCustomers] = useState<any[]>([])

    useEffect(() => {
        const mockCustomers = [
            { id: 1, name: "عبدالله العبدالله", lastVisit: "2024-02-05", note: "يفضل تقصير الجوانب أكثر", phone: "+966 50 111 2222" },
            { id: 2, name: "فيصل السيف", lastVisit: "2024-01-20", note: "حساسية من بعض أنواع الشامبو", phone: "+966 55 333 4444" },
            { id: 3, name: "ماجد المهندس", lastVisit: "2024-02-01", note: "يحب القهوة السوداء عند الوصول", phone: "+966 54 555 6666" },
        ]
        setCustomers(mockCustomers)
    }, [])

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineUsers className="text-indigo-500" />
                        قائمة العملاء
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">عرض العملاء الذين قمت بخدمتهم وملاحظاتهم الخاصة.</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center px-6 gap-4 h-14 w-full md:w-96 focus-within:border-indigo-500/50 transition-all">
                    <HiOutlineMagnifyingGlass className="text-zinc-500" />
                    <input type="text" placeholder="بحث عن عميل..." className="bg-transparent border-none outline-none text-white w-full text-sm" dir="rtl" />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {customers.map((c, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={c.id}
                            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                            dir="rtl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                    <span className="text-xl font-black text-indigo-400">{c.name[0]}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{c.name}</h3>
                                    <p className="text-zinc-500 text-xs font-medium">آخر زيارة: {c.lastVisit}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 mb-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 flex items-center gap-2">
                                    <HiOutlineChatBubbleLeftEllipsis className="text-indigo-500" />
                                    ملاحظات الموظف
                                </p>
                                <p className="text-zinc-400 text-sm font-medium italic">"{c.note}"</p>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 h-12 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all text-xs font-bold border border-white/5">
                                    <HiOutlinePhone className="text-lg" />
                                    اتصال
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 h-12 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all text-xs font-bold border border-white/5">
                                    <HiOutlineEnvelope className="text-lg" />
                                    رسالة
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default StaffCustomers
