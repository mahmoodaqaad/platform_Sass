"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineUserGroup, HiOutlineUser, HiOutlinePlus, HiOutlinePencilSquare, HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineTrash } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modles from '@/components/Modles'
import { useTranslations, useLocale } from 'next-intl'
import { Business, User } from '@/lib/types'



const AdminUsers = () => {
    const t = useTranslations("D.admin.users");
    const locale = useLocale();
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [error, setError] = useState("")
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterRole, setFilterRole] = useState("ALL")
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
        businessName: "",
        businessSlug: "",
        businessType: "",
        businessId: ""
    })
    const typed = ["CLINIC", "GYM", "HOTEL", "RESTAURANT", "SALON", "SPA", "STORE", "OTHER"]

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
            setError("")
            await axios.post("/api/admin/users", formData)
            setShowAddModal(false)
            setFormData({ name: "", email: "", password: "", role: "USER", businessName: "", businessSlug: "", businessType: "", businessId: "" })
            fetchUsers()
        } catch (error) {
            // console.error(error.response.data.message)
            const message = axios.isAxiosError(error) ? error.response?.data?.message : t("modal.save");
            if (message == "exist_user") {
                setError(t("modal.userExistError"))
            } else {

                setError(message || "Error adding user")
            }

        }
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser) return
        try {
            setError("")
            const res = await axios.put("/api/admin/users", { id: selectedUser.id, ...formData })
            if (res.data.message.includes("exists")) {
                alert(res.data.message)
            }
            setShowEditModal(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (error) {
            // console.error(error.response)
            const message = axios.isAxiosError(error) ? error.response?.data?.message : "Error updating user";
            setError(message || "Error updating user")
        }
    }

    const openEditModal = (user: User) => {
        setError("")
        setSelectedUser(user)

        const ownedBiz = user.ownedBusinesses?.[0];
        const staffBiz = user.memberships?.[0];

        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            businessName: ownedBiz?.name || "",
            businessSlug: ownedBiz?.slug || "",
            businessType: ownedBiz?.type || "",
            businessId: staffBiz?.businessId || ""
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

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.includes(searchQuery)

        const matchesRole = filterRole === "ALL" || user.role === filterRole

        return matchesSearch && matchesRole
    })

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
                <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                        <div>
                            <h1 className="text-4xl font-black text-white flex items-center gap-4">
                                <HiOutlineUserGroup className="text-indigo-500" />
                                {t("title")}
                            </h1>
                            <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
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
                                    businessType: "",
                                    businessId: ""
                                })
                                setError("")
                                setShowAddModal(true)
                            }}
                            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <HiOutlinePlus className="text-xl" />
                            {t("addUser")}
                        </button>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="mb-8 bg-zinc-900/40 border border-white/5 p-4 rounded-3xl flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <HiOutlineUser className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors text-xl" />
                        <input
                            type="text"
                            placeholder={t("searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 font-medium"
                        />
                    </div>
                    <div className="flex gap-4 min-w-[160px]">
                        <Select
                            label={t("filterRole")}
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            options={[
                                { value: "ALL", label: t("allRoles") },
                                ...roles.map(role => ({ value: role, label: role }))
                            ]}
                            className="h-[54px]"
                        />
                    </div>
                    {(searchQuery || filterRole !== "ALL") && (
                        <button
                            onClick={() => {
                                setSearchQuery("")
                                setFilterRole("ALL")
                            }}
                            className="px-5 py-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all font-black text-xs uppercase tracking-widest"
                        >
                            {t("reset")}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
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
                            <div className="text-right">
                                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                <p className="text-zinc-500 text-sm font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-zinc-500 text-xs uppercase tracking-widest font-black mb-1">{t("role")}</span>
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
                                <p className="text-zinc-500 text-xs uppercase tracking-widest font-black mb-1">{t("joined")}</p>
                                <p className="text-white font-medium text-sm">
                                    {new Date(user.createdAt).toLocaleDateString(locale)}
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
                )) : (
                    <div className="py-20 text-center border border-white/5 border-dashed rounded-4xl bg-zinc-900/20">
                        <p className="text-zinc-500 font-bold italic">{t("noUsers")}</p>
                        <button
                            onClick={() => { setSearchQuery(""); setFilterRole("ALL"); }}
                            className="mt-4 text-indigo-400 text-sm font-black hover:underline underline-offset-4"
                        >
                            {t("clearFilters")}
                        </button>
                    </div>
                )}
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

                        >
                            {error && <p className='p-3 text-red-700 bg-red-300 mb-2 rounded'>{error}</p>}

                            <h2 className="text-3xl font-black text-white mb-2">
                                {showAddModal ? t("modal.addTitle") : t("modal.editTitle")}
                            </h2>
                            <p className="text-zinc-500 text-sm mb-10 font-medium">
                                {showAddModal ? t("modal.addSubtitle") : t("modal.editSubtitle")}
                            </p>

                            <form onSubmit={showAddModal ? handleAddUser : handleUpdateUser} className="space-y-6">
                                <Input
                                    label={t("modal.name")}
                                    icon={<HiOutlineUser />}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t("modal.email")}
                                    type='email'
                                    name="email"

                                    icon={<HiOutlineEnvelope />}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                {showAddModal && (
                                    <Input
                                        label={t("modal.password")}
                                        type="password"
                                        icon={<HiOutlineLockClosed />}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                )}
                                {currentUser?.email !== formData.email &&
                                    <div className="space-y-4">
                                        <label className="text-zinc-400 text-xs font-black uppercase tracking-widest mr-2 flex items-center gap-2">
                                            <HiOutlineShieldCheck className="text-indigo-500" />
                                            {t("modal.role")}
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
                                }

                                {/* Conditional Fields for OWNER */}
                                <AnimatePresence mode="wait">
                                    {formData.role === "OWNER" && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="space-y-6 pt-4 border-t border-white/5"
                                        >
                                            <p className="text-emerald-500 text-xs font-black">{t("modal.businessDetails")}</p>
                                            <Input
                                                label={t("modal.businessName")}
                                                value={formData.businessName}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                placeholder="e.g. Al-Awail Salon"
                                            />
                                            <Input
                                                label={t("modal.businessSlug")}
                                                value={formData.businessSlug}
                                                onChange={(e) => setFormData({ ...formData, businessSlug: e.target.value })}
                                                placeholder="e.g. al-awail-salon"
                                            />
                                            <Select
                                                label={t("modal.businessType")}
                                                value={formData.businessType}
                                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                                options={[
                                                    { value: "", label: "Choose type..." },
                                                    ...typed.map(t => ({ value: t, label: t }))
                                                ]}
                                            />
                                            <p className="text-sky-500 text-md font-black">{t("modal.goToBusinesses")}</p>

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
                                            <Select
                                                label={t("modal.assignStaff")}
                                                value={formData.businessId}
                                                onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                                                options={[
                                                    { value: "", label: "Choose business..." },
                                                    ...businesses.map(b => ({ value: b.id, label: b.name }))
                                                ]}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <Button type="submit" className="w-full py-4 text-sm font-black bg-indigo-600 hover:bg-indigo-500 mt-4">
                                    {showAddModal ? t("modal.create") : t("modal.save")}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )
                }

                {showDeleteModal && selectedUser && (
                    <Modles
                        setShowDeleteModal={setShowDeleteModal}
                        selectedItem={selectedUser}
                        handleDeleteItem={handleDeleteUser}
                        title={t("modal.deleteTitle")}
                        description={t("modal.deleteDescription", { name: selectedUser.name })}
                        buttonText={t("modal.deleteConfirm")}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminUsers
