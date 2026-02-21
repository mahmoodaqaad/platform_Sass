"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineUsers, HiOutlineUserPlus, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineTrash } from "react-icons/hi2"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useTranslations } from "next-intl"

interface Staff {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    memberId: string;
}

const OwnerStaffPage = () => {
    const t = useTranslations("D.owner.staff");
    const tEmpty = useTranslations("D.owner.staff.empty");
    const tCard = useTranslations("D.owner.staff.card");
    const tModal = useTranslations("D.owner.staff.modal");

    const [staff, setStaff] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", password: "" })

    const fetchStaff = async () => {
        try {
            const res = await axios.get("/api/owner/staff")
            setStaff(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    const [error, setError] = useState<string | null>(null)

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            await axios.post("/api/owner/staff", formData)
            setShowAddModal(false)
            setFormData({ name: "", email: "", password: "" })
            fetchStaff()
        } catch (error: any) {
            console.error(error)
            setError(error.response?.data?.message || tModal("error"))
        }
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
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <HiOutlineUserPlus className="text-xl" />
                    {t("addStaff")}
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-zinc-500 font-bold">{t("loading")}</div>
                ) : staff.length === 0 ? (
                    <div className="col-span-full py-20 bg-zinc-900/50 border border-white/5 rounded-[3rem] text-center">
                        <HiOutlineUsers className="text-6xl text-zinc-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">{tEmpty("title")}</h3>
                        <p className="text-zinc-500 mt-2">{tEmpty("description")}</p>
                    </div>
                ) : (
                    staff.map((s, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={s.id}
                            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                    <span className="text-2xl font-black text-indigo-400">{s.name ? s.name[0] : "U"}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{s.name || tCard("noName")}</h3>
                                    <p className="text-zinc-500 text-xs font-medium">{s.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="text-right">
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">{tCard("joined")}</p>
                                    <p className="text-zinc-400 text-xs font-bold">{new Date(s.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-red-400/5 hover:bg-red-400/10 rounded-xl text-red-400/50 hover:text-red-400 transition-all border border-red-400/10">
                                        <HiOutlineTrash className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -ml-32 -mt-32" />

                            <h2 className="text-3xl font-black text-white mb-2 relative">{tModal("title")}</h2>
                            <p className="text-zinc-500 text-sm mb-10 font-medium relative">{tModal("subtitle")}</p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-xs font-bold flex items-center gap-2"
                                >
                                    <span>⚠️</span>
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleAddStaff} className="space-y-6 relative">
                                <Input
                                    label={tModal("name")}
                                    icon={<HiOutlineUser />}
                                    value={formData.name}

                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input

                                    label={tModal("email")}
                                    type="email"
                                    name="email"

                                    icon={<HiOutlineEnvelope />}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label={tModal("password")}
                                    type="password"
                                    icon={<HiOutlineLockClosed />}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <Button type="submit" className="w-full py-4 text-sm font-black bg-indigo-600 hover:bg-indigo-500 mt-4">
                                    {tModal("submit")}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default OwnerStaffPage
