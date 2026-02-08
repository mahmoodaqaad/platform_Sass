"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineUsers,
    HiOutlineUser,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineStar,
    HiOutlineMagnifyingGlass,
    HiOutlinePlus,
    HiOutlineXMark,
    HiOutlineCurrencyDollar,
    HiOutlineHashtag
} from "react-icons/hi2"
import axios from "axios"

const Input = ({ label, icon, ...props }: any) => (
    <div className="space-y-2 group">
        <label className="text-sm font-bold text-zinc-400 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
            {icon}
            {label}
        </label>
        <input
            {...props}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-600"
        />
    </div>
)

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    bookingCount: number;
    totalSpent: number;
    status: "VIP" | "REGULAR" | "NEW";
}

const CustomersPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const res = await axios.get("/api/owner/customers")
            setCustomers(res.data)
        } catch (error) {
            console.error("Fetch error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post("/api/owner/customers", formData)
            setShowAddModal(false)
            setFormData({ name: "", email: "", phone: "" })
            fetchCustomers()
        } catch (error) {
            console.error("Add error:", error)
        }
    }

    const handleStatusChange = async (id: string, newStatus: "VIP" | "REGULAR" | "NEW") => {
        setUpdatingId(id)
        try {
            await axios.patch("/api/owner/customers", { id, status: newStatus })
            fetchCustomers()
        } catch (error) {
            console.error("Status update error:", error)
        } finally {
            setUpdatingId(null)
        }
    }

    const getStatusStyle = (status: "VIP" | "REGULAR" | "NEW") => {
        switch (status) {
            case "VIP": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "REGULAR": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "NEW": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
        }
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    )

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineUsers className="text-indigo-500" />
                        قائمة العملاء
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">إدارة بيانات عملائك وتتبع تاريخ تعاملاتهم.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <HiOutlinePlus className="text-xl" />
                    إضافة عميل جديد
                </button>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 h-16 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center px-6 gap-4 group focus-within:border-indigo-500/50 transition-all">
                    <HiOutlineMagnifyingGlass className="text-zinc-500 text-xl group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="ابحث بالاسم، البريد، أو رقم الهاتف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full font-medium"
                        dir="rtl"
                    />
                </div>
                <div className="h-16 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-center gap-3 px-6">
                    <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">إجمالي العملاء:</span>
                    <span className="text-white font-black text-xl">{customers.length}</span>
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-zinc-500 font-bold">جاري التحميل...</div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-zinc-500 font-bold">لا يوجد عملاء مطابقين للبحث.</div>
                    ) : filteredCustomers.map((customer, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={customer.id}
                            className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                        >
                            {/* Bg Decoration */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -ml-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

                            <div className="relative flex items-start justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                        <HiOutlineUser className="text-3xl text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-white leading-none">{customer.name}</h3>
                                            <select
                                                disabled={updatingId === customer.id}
                                                value={customer.status}
                                                onChange={(e) => handleStatusChange(customer.id, e.target.value as "VIP" | "REGULAR" | "NEW")}
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-transparent outline-none cursor-pointer hover:scale-105 transition-all appearance-none ${getStatusStyle(customer.status)} ${updatingId === customer.id ? 'opacity-50' : ''}`}
                                            >
                                                <option value="NEW">جديد</option>
                                                <option value="REGULAR">دائم</option>
                                                <option value="VIP">مميز (VIP)</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <a href={`mailto:${customer.email}`} className="text-zinc-500 text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
                                                <HiOutlineEnvelope />
                                                {customer.email}
                                            </a>
                                            {customer.phone && (
                                                <a href={`tel:${customer.phone}`} className="text-zinc-500 text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
                                                    <HiOutlinePhone />
                                                    {customer.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all">
                                    <HiOutlineStar />
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <HiOutlineHashtag className="text-indigo-400 text-xs" />
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">عدد الحجوزات</p>
                                    </div>
                                    <p className="text-white font-black text-xl">{customer.bookingCount || 0}</p>
                                </div>
                                <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <HiOutlineCurrencyDollar className="text-emerald-400 text-xs" />
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">إجمالي المشتريات</p>
                                    </div>
                                    <p className="text-emerald-400 font-black text-xl">${customer.totalSpent || 0}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-12 relative">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-8 left-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-500 transition-all"
                                >
                                    <HiOutlineXMark className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black text-white mb-2">إضافة عميل جديد</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium italic">سجل بيانات العميل الجديد في نظامك.</p>

                                <form onSubmit={handleAddCustomer} className="space-y-6">
                                    <Input
                                        label="الاسم الكامل"
                                        icon={<HiOutlineUser />}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="مثال: أحمد محمد"
                                    />
                                    <Input
                                        label="البريد الإلكتروني"
                                        icon={<HiOutlineEnvelope />}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        placeholder="example@mail.com"
                                        type="email"
                                    />
                                    <Input
                                        label="رقم الهاتف (اختياري)"
                                        icon={<HiOutlinePhone />}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+966 5x xxx xxxx"
                                    />

                                    <div className="md:col-span-2 flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                        >
                                            إضافة العميل
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CustomersPage
