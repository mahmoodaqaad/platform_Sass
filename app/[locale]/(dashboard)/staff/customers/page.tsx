"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineUsers, HiOutlinePhone, HiOutlineEnvelope, HiOutlineChatBubbleLeftEllipsis, HiOutlineMagnifyingGlass } from "react-icons/hi2"
import axios from "axios"
import { Customer } from "@/lib/types"
import Link from "next/link"
import Button from "@/components/ui/Button"
import { IoReload } from "react-icons/io5"
import { useTranslations } from "next-intl"

const StaffCustomers = () => {
    const t = useTranslations("D.staff.customers");
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const res = await axios.get("/api/staff/customers")

            console.log(res);
            setCustomers(res.data)
        } catch (error) {
            console.error("Fetch error:", error)
        } finally {
            setLoading(false)
        }

    }
    const filteredCustomers = customers.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.phone?.includes(search) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.notes?.toLowerCase().includes(search.toLowerCase())
    )
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineUsers className="text-indigo-500" />
                        {t("title")}
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
                </div>
                <div className="flex gap-2">

                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center px-6 gap-4 h-14 w-full md:w-96 focus-within:border-indigo-500/50 transition-all">
                        <HiOutlineMagnifyingGlass className="text-zinc-500" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text" placeholder={t("searchPlaceholder")} className="bg-transparent border-none outline-none text-white w-full text-sm" dir="rtl" />
                    </div>
                    <Button
                        onClick={() => setSearch("")}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400">
                        <IoReload />
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredCustomers.length > 0 ?
                        filteredCustomers.map((c, i) => (
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
                                        <span className="text-xl font-black text-indigo-400">{(c.name || "?")[0]}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{c.name}</h3>
                                        <p className="text-zinc-500 text-xs font-medium">
                                            {t("lastVisit")}: {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 mb-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 flex items-center gap-2">
                                        <HiOutlineChatBubbleLeftEllipsis className="text-indigo-500" />
                                        {t("notes")}
                                    </p>
                                    {c.notes || c.note ?
                                        <p className="text-zinc-400 text-sm font-medium italic">&quot;{c.notes || c.note}&quot;</p>
                                        :
                                        <p className="text-zinc-400 text-sm font-medium italic">لا يوجد ملاحظات حالية</p>
                                    }
                                </div>

                                <div className="flex gap-2">
                                    {c.phone &&

                                        <Link href={`tel:${c.phone}`} className="flex-1 flex items-center justify-center gap-2 h-12 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all text-xs font-bold border border-white/5">
                                            <HiOutlinePhone className="text-lg" />
                                            {t("call")}
                                        </Link>
                                    }
                                    {c.email &&

                                        <Link href={`mailto:${c.email}`} className="flex-1 flex items-center justify-center gap-2 h-12 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all text-xs font-bold border border-white/5">
                                            <HiOutlineEnvelope className="text-lg" />
                                            {t("message")}
                                        </Link>
                                    }
                                </div>
                            </motion.div>
                        )) :
                        <motion.p
                            className="text-white text-center py-10 w-full col-span-full font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            لم يتم العثور على نتائج
                        </motion.p>
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}

export default StaffCustomers
