"use client"

import React, { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineOfficeBuilding,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlinePlus,
    HiOutlinePencilAlt,
    HiOutlineTrash,
    HiOutlineGlobeAlt,
    HiOutlineUsers,
    HiOutlineCheckCircle,
    HiOutlineX,
    HiOutlineMail
} from "react-icons/hi"

interface Business {
    id: string
    name: string
    slug: string
    ownerName: string
    ownerEmail: string
    staffCount: number
    status: string
    createdAt: string
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
}

const Input = ({ label, icon, ...props }: InputProps) => (
    <div className="space-y-2 group">
        <label className="text-sm font-bold text-zinc-400 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
            {icon}
            {label}
        </label>
        <input
            {...props}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
        />
    </div>
)

export default function BusinessesPage() {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
    const [editForm, setEditForm] = useState({ name: "", slug: "", status: "" })
    const [addForm, setAddForm] = useState({ name: "", slug: "", ownerEmail: "" })

    useEffect(() => {
        fetchBusinesses()
    }, [])

    const fetchBusinesses = async () => {
        try {
            const res = await axios.get("/api/admin/businesses")
            setBusinesses(res.data)
        } catch (error) {
            console.error("Fetch businesses error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (biz: Business) => {
        setSelectedBusiness(biz)
        setEditForm({ name: biz.name, slug: biz.slug, status: biz.status })
        setShowEditModal(true)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedBusiness) return
        try {
            await axios.put("/api/admin/businesses", { id: selectedBusiness.id, ...editForm })
            setShowEditModal(false)
            fetchBusinesses()
        } catch (error) {
            console.error("Update error:", error)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post("/api/admin/businesses", addForm)
            setShowAddModal(false)
            setAddForm({ name: "", slug: "", ownerEmail: "" })
            fetchBusinesses()
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            console.error("Add error:", err)
            alert(err.response?.data?.message || "حدث خطأ أثناء إضافة العمل")
        }
    }

    const handleDelete = async (biz: Business) => {
        if (!confirm(`هل أنت متأكد من حذف "${biz.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return
        try {
            await axios.delete("/api/admin/businesses", { data: { id: biz.id } })
            fetchBusinesses()
        } catch (error) {
            console.error("Delete error:", error)
        }
    }

    const filteredBusinesses = businesses.filter(biz =>
        biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineOfficeBuilding className="text-indigo-500" />
                        إدارة الأعمال
                    </h1>
                    <p className="text-zinc-500 font-medium">متابعة المشاريع والشركات المسجلة في المنصة.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <HiOutlinePlus className="text-2xl" />
                    إضافة عمل جديد
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "إجمالي الأعمال", value: businesses.length, color: "from-blue-500 to-indigo-600", icon: <HiOutlineOfficeBuilding /> },
                    { label: "الأعمال النشطة", value: businesses.filter(b => b.status === "يعمل").length, color: "from-emerald-500 to-teal-600", icon: <HiOutlineCheckCircle /> },
                    { label: "إجمالي الموظفين", value: businesses.reduce((acc, b) => acc + b.staffCount, 0), color: "from-amber-500 to-orange-600", icon: <HiOutlineUsers /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-zinc-500 font-bold text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl bg-linear-to-br ${stat.color} text-white text-2xl shadow-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors text-xl" />
                    <input
                        type="text"
                        placeholder="ابحث باسم العمل، المالك، او Slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 font-medium"
                    />
                </div>
                <button className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all">
                    <HiOutlineFilter className="text-xl" />
                    تصفية
                </button>
            </div>

            {/* List Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                    <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 rounded-3xl">
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">إجمالي الشركات</p>
                        <h4 className="text-3xl font-black text-white">{businesses.length}</h4>
                    </div>
                    <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-8 rounded-3xl">
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">شركات نشطة</p>
                        <h4 className="text-3xl font-black text-white">{businesses.filter(b => b.status === "يعمل").length}</h4>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-zinc-950/50 border-b border-zinc-800">
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">العمل</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">المالك</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">Slug</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500 flex items-center gap-2">عدد الموظفين</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">الحالة</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            <AnimatePresence>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">جاري تحميل البيانات...</td>
                                    </tr>
                                ) : filteredBusinesses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">لم يتم العثور على نتائج.</td>
                                    </tr>
                                ) : filteredBusinesses.map((biz, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={biz.id}
                                        className="hover:bg-white/2 transition-all group border-b border-white/5"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-xl">
                                                    <HiOutlineOfficeBuilding className="text-2xl" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-white group-hover:text-indigo-400 transition-colors">{biz.name}</p>
                                                    <p className="text-zinc-500 text-xs mt-0.5 font-bold">تاريخ البدء: {new Date(biz.createdAt).toLocaleDateString('ar-EG')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold">{biz.ownerName}</span>
                                                <span className="text-zinc-500 text-xs font-medium">{biz.ownerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-zinc-400 text-sm whitespace-nowrap">
                                            <span className="bg-zinc-800/50 px-3 py-1.5 rounded-lg">/{biz.slug}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-zinc-400 font-bold">
                                                <HiOutlineUsers className="text-lg text-indigo-500" />
                                                <span>{biz.staffCount} موظف</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black ring-1 ${biz.status === "يعمل"
                                                ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 ring-red-500/20"
                                                }`}>
                                                {biz.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(biz)}
                                                    className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/10"
                                                >
                                                    <HiOutlinePencilAlt className="text-xl" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(biz)}
                                                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all shadow-lg"
                                                >
                                                    <HiOutlineTrash className="text-xl" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && selectedBusiness && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-12 relative">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="absolute top-8 left-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-500 transition-all"
                                >
                                    <HiOutlineX className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black text-white mb-2 relative">تعديل العمل</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium relative italic">تعديل البيانات الأساسية للمشروع.</p>

                                <form onSubmit={handleUpdate} className="space-y-6 relative">
                                    <Input
                                        label="اسم العمل"
                                        icon={<HiOutlineOfficeBuilding />}
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Slug (رابط مخصص)"
                                        icon={<HiOutlineGlobeAlt />}
                                        value={editForm.slug}
                                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                        required
                                    />

                                    <div className="space-y-2 group">
                                        <label className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                                            <HiOutlineCheckCircle />
                                            الحالة
                                        </label>
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium appearance-none"
                                        >
                                            <option value="يعمل">يعمل</option>
                                            <option value="متوقف">متوقف</option>
                                            <option value="قيد المراجعة">قيد المراجعة</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                        >
                                            حفظ التعديلات
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
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

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-12 relative">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-8 left-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-500 transition-all"
                                >
                                    <HiOutlineX className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black text-white mb-2 relative">إضافة عمل جديد</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium relative italic">قم بإنشاء مشروع جديد وتعيين مالك له.</p>

                                <form onSubmit={handleAdd} className="space-y-6 relative">
                                    <Input
                                        label="اسم العمل"
                                        icon={<HiOutlineOfficeBuilding />}
                                        value={addForm.name}
                                        onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                        placeholder="مثال: صالون الأناقة"
                                        required
                                    />
                                    <Input
                                        label="Slug (الرابط)"
                                        icon={<HiOutlineGlobeAlt />}
                                        value={addForm.slug}
                                        onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                                        placeholder="مثال: elegance-salon"
                                        required
                                    />
                                    <Input
                                        label="بريد المالك الإلكتروني"
                                        icon={<HiOutlineMail />}
                                        type="email"
                                        value={addForm.ownerEmail}
                                        onChange={(e) => setAddForm({ ...addForm, ownerEmail: e.target.value })}
                                        placeholder="owner@example.com"
                                        required
                                    />

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                        >
                                            إنشاء العمل
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
