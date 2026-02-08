"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineUserGroup, HiOutlineUser, HiOutlinePlus, HiOutlinePencilSquare, HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineTrash } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Business {
    id: string;
    name: string;
    slug: string;
}

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
        businessName: "",
        businessSlug: "",
        businessId: ""
    })

    const roles = ["USER", "OWNER", "STAFF", "ADMIN"]

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users')
            setUsers(res.data)
        } catch (err) {
            console.error("Failed to fetch users", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchBusinesses = async () => {
        try {
            const res = await axios.get('/api/admin/businesses')
            setBusinesses(res.data)
        } catch (err) {
            console.error("Failed to fetch businesses", err)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/auth/me")
                if (res.data.authenticated) setCurrentUser(res.data.user)
            } catch (error) {
                console.error(error)
            }
        }
        checkAuth()
        fetchUsers()
        fetchBusinesses()
    }, [])


    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post("/api/admin/users", formData)
            setShowAddModal(false)
            setFormData({ name: "", email: "", password: "", role: "USER", businessName: "", businessSlug: "", businessId: "" })
            fetchUsers()
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.message || "حدث خطأ أثناء إضافة المستخدم")
        }
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser) return
        try {
            const res = await axios.put("/api/admin/users", { id: selectedUser.id, ...formData })
            if (res.data.message.includes("مستخدم بالفعل")) {
                alert(res.data.message)
            }
            setShowEditModal(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.message || "حدث خطأ أثناء تحديث المستخدم")
        }
    }

    const openEditModal = (user: User) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            businessName: "",
            businessSlug: "",
            businessId: ""
        })
        setShowEditModal(true)
    }

    const openDeleteModal = (user: User) => {
        setSelectedUser(user)
        setShowDeleteModal(true)
    }

    const handleDeleteUser = async () => {
        if (!selectedUser) return
        try {
            await axios.delete("/api/admin/users", { data: { id: selectedUser.id } })
            setShowDeleteModal(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black p-8 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black p-4 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-white flex items-center gap-4">
                                <HiOutlineUserGroup className="text-indigo-500" />
                                إدارة المستخدمين
                            </h1>
                            <p className="text-zinc-500 mt-2 font-medium">عرض، تعديل، وإضافة المستخدمين للمنصة.</p>
                        </div>
                        <button
                            onClick={() => {
                                setFormData({
                                    name: "",
                                    email: "",
                                    password: "",
                                    role: "USER",
                                    businessName: "",
                                    businessSlug: "",
                                    businessId: ""
                                })
                                setShowAddModal(true)
                            }}
                            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <HiOutlinePlus className="text-xl" />
                            إضافة مستخدم جديد
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {users.map((user) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={user.id}
                            className="bg-zinc-900/50 border border-white/5 rounded-4xl p-6 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-linear-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                                    <HiOutlineUser className="text-2xl text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                    <p className="text-zinc-500 text-sm font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-zinc-500 text-xs uppercase tracking-widest font-black mb-1">الصلاحية</span>
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${user.role === "ADMIN" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                        user.role === "OWNER" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                            user.role === "STAFF" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                "bg-zinc-800 text-zinc-500 border-white/5"
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                                <div className="h-10 w-px bg-white/5 mx-2" />
                                <div className="text-right">
                                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-black mb-1">Joined</p>
                                    <p className="text-white font-medium text-sm">
                                        {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => openEditModal(user)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all border border-white/5"
                                >
                                    <HiOutlinePencilSquare className="text-xl" />
                                </button>
                                {currentUser?.id !== user.id && (
                                    <button
                                        onClick={() => openDeleteModal(user)}
                                        className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400/50 hover:text-red-400 transition-all border border-red-500/20"
                                    >
                                        <HiOutlineTrash className="text-xl" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modals */}
                <AnimatePresence>
                    {(showAddModal || showEditModal) && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                                className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-4xl p-10 shadow-2xl overflow-hidden"
                                dir="rtl"
                            >
                                <h2 className="text-3xl font-black text-white mb-2">
                                    {showAddModal ? "إضافة مستخدم جديد" : "تعديل بيانات المستخدم"}
                                </h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium">
                                    {showAddModal ? "أدخل بيانات الحساب الجديد وصلاحياته." : "تحديث معلومات الحساب الحالي."}
                                </p>

                                <form onSubmit={showAddModal ? handleAddUser : handleUpdateUser} className="space-y-6">
                                    <Input
                                        label="الاسم الكامل"
                                        icon={<HiOutlineUser />}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="البريد الإلكتروني"
                                        type='email'
                                        icon={<HiOutlineEnvelope />}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                    {showAddModal && (
                                        <Input
                                            label="كلمة المرور"
                                            type="password"
                                            icon={<HiOutlineLockClosed />}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    )}
                                    <div className="space-y-4">
                                        <label className="text-zinc-400 text-xs font-black uppercase tracking-widest mr-2 flex items-center gap-2">
                                            <HiOutlineShieldCheck className="text-indigo-500" />
                                            الصلاحية (الرتبة)
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {roles.map(r => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, role: r })}
                                                    className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.role === r
                                                        ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                                                        : "bg-zinc-950 text-zinc-500 border-white/5 hover:border-white/10"
                                                        }`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Conditional Fields for OWNER */}
                                    <AnimatePresence mode="wait">
                                        {formData.role === "OWNER" && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="space-y-6 pt-4 border-t border-white/5"
                                            >
                                                <p className="text-emerald-500 text-xs font-black">بيانات العمل (اختياري - سيتم إنشاؤه تلقائياً إذا تركت فارغة)</p>
                                                <Input
                                                    label="اسم العمل"
                                                    value={formData.businessName}
                                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                    placeholder="مثال: صالون الأوائل"
                                                />
                                                <Input
                                                    label="رابط العمل (Slug)"
                                                    value={formData.businessSlug}
                                                    onChange={(e) => setFormData({ ...formData, businessSlug: e.target.value })}
                                                    placeholder="مثال: al-awail-salon"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Conditional Fields for STAFF */}
                                        {formData.role === "STAFF" && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="space-y-4 pt-4 border-t border-white/5"
                                            >
                                                <label className="text-zinc-400 text-xs font-black uppercase tracking-widest mr-2">تعيين الموظف لعمل محدد</label>
                                                <select
                                                    value={formData.businessId}
                                                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                                                >
                                                    <option value="">اختر العمل...</option>
                                                    {businesses.map(b => (
                                                        <option key={b.id} value={b.id}>{b.name}</option>
                                                    ))}
                                                </select>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <Button type="submit" className="w-full py-4 text-sm font-black bg-indigo-600 hover:bg-indigo-500 mt-4">
                                        {showAddModal ? "إنشاء الحساب" : "حفظ التغييرات"}
                                    </Button>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowDeleteModal(false)}
                                className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-4xl p-10 shadow-2xl overflow-hidden text-center"
                                dir="rtl"
                            >
                                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                    <HiOutlineTrash className="text-4xl text-red-500" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">هل أنت متأكد؟</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium">
                                    أنت على وشك حذف حساب <span className="text-white font-bold">{selectedUser?.name}</span>. هذا الإجراء دائم ولا يمكن التراجع عنه.
                                </p>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleDeleteUser}
                                        className="flex-1 py-4 text-sm font-black bg-red-600 hover:bg-red-500"
                                    >
                                        نعم، احذف الحساب
                                    </Button>
                                    <Button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 py-4 text-sm font-black bg-zinc-800 hover:bg-zinc-700 text-white"
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    )
}

export default AdminUsers
