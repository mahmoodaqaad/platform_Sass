"use client"

import React, { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineOfficeBuilding,
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlinePencilAlt,
    HiOutlineTrash,
    HiOutlineGlobeAlt,
    HiOutlineCheckCircle,
    HiOutlineX,
    HiOutlineMail,
    HiOutlineStar,
    HiOutlineClock,
    HiDocumentText,
    HiPhone,
    HiHome
} from "react-icons/hi"
import { MdBusiness, MdCalendarMonth, MdOutlineWorkOutline } from "react-icons/md"
import Image from "next/image"
import LogoUpload from "@/components/dashboard/LogoUpload"
import { Link } from "@/i18n/routing"
import Modles from "@/components/Modles"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { useTranslations, useLocale } from "next-intl"
import { Business, UserEmail } from "@/lib/types"



export default function BusinessesPage() {
    const t = useTranslations("D.admin.businesses");
    const locale = useLocale();
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [filterType, setFilterType] = useState("ALL")
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
    const [userEmails, setUserEmails] = useState<UserEmail[]>([])
    const [editForm, setEditForm] = useState({
        name: "", slug: "", status: "", type: "", description: "", address: "", phone: "", logo: "",
    })
    const [addForm, setAddForm] = useState({
        name: "", slug: "", ownerEmail: "", type: "", description: "", address: "", phone: "", status: "", logo: "", numMonth: "", plan: ""
    })

    useEffect(() => {
        fetchBusinesses()
    }, [])

    useEffect(() => {
        if (showAddModal) {
            fetchUserEmails()
        }
    }, [showAddModal])

    const fetchUserEmails = async () => {
        try {
            const res = await axios.get("/api/admin/users/emails")
            setUserEmails(res.data)
        } catch (error) {
            console.error("Fetch emails error:", error)
        }
    }
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

        setEditForm({
            name: biz.name,
            slug: biz.slug,
            status: biz.status,
            type: biz.type,
            description: biz.description,
            address: biz.address,
            phone: biz.phone,
            logo: biz.logo || ""
        })
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
            const err = error as AxiosError<{ message: string }>
            console.error("Update error:", err)
            alert(err.response?.data?.message || "Error updating business")
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post("/api/admin/businesses", addForm)

            setShowAddModal(false)
            setAddForm({ name: "", slug: "", ownerEmail: "", type: "", description: "", address: "", phone: "", status: "", logo: "", numMonth: "", plan: "" })
            fetchBusinesses()
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            console.error("Add error:", err)
            alert(err.response?.data?.message || "Error adding business")
        }
    }

    const openDeleteModal = (biz: Business) => {
        setSelectedBusiness(biz)
        setShowDeleteModal(true)
    }

    const handleDelete = async () => {
        try {
            if (!selectedBusiness) return
            await axios.delete("/api/admin/businesses", { data: { id: selectedBusiness.id } })
            fetchBusinesses()
            setShowDeleteModal(false)
        } catch (error: any) {
            console.log(error.response);
        }
    }

    const filteredBusinesses = businesses.filter(biz => {
        const matchesSearch =
            biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            biz.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            biz.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            biz.phone.includes(searchQuery)

        const matchesStatus = filterStatus === "ALL" || biz.status === filterStatus
        const matchesType = filterType === "ALL" || biz.type === filterType

        return matchesSearch && matchesStatus && matchesType
    })

    const typed = [
        "CLINIC", "GYM", "HOTEL", "RESTAURANT", "SALON", "SPA", "STORE", "OTHER"]


    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineOfficeBuilding className="text-indigo-500" />
                        {t("title")}
                    </h1>
                    <p className="text-zinc-500 font-medium">{t("subtitle")}</p>
                </div>
                <button
                    onClick={() => {
                        setShowAddModal(true)
                    }}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <HiOutlinePlus className="text-2xl" />
                    {t("addBusiness")}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: t("stats.total"), value: businesses.length, color: "from-blue-500 to-indigo-600", icon: <HiOutlineOfficeBuilding /> },
                    { label: t("stats.active"), value: businesses.filter(b => b.status === "ACTIVE").length, color: "from-emerald-500 to-teal-600", icon: <HiOutlineCheckCircle /> },
                    { label: t("stats.proPlans"), value: businesses.filter(b => b.plan !== "BASIC").length, color: "from-purple-500 to-pink-600", icon: <HiOutlineStar /> },
                    { label: t("stats.pending"), value: businesses.filter(b => b.status === "PENDING").length, color: "from-amber-500 to-orange-600", icon: <HiOutlineClock /> },
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
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors text-xl" />
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 font-medium"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none min-w-[160px]">
                        <Select
                            label={t("filterStatus")}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            options={[
                                { value: "ALL", label: "All" },
                                { value: "ACTIVE", label: "ACTIVE" },
                                { value: "INACTIVE", label: "INACTIVE" },
                                { value: "SUSPENDED", label: "SUSPENDED" },
                                { value: "PENDING", label: "PENDING" },
                            ]}
                            className="h-[54px]"
                        />
                    </div>

                    <div className="relative flex-1 lg:flex-none min-w-[160px]">
                        <Select
                            label={t("filterType")}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            options={[
                                { value: "ALL", label: "All Types" },
                                ...typed.map(t => ({ value: t, label: t }))
                            ]}
                            className="h-[54px]"
                        />
                    </div>

                    {(searchQuery || filterStatus !== "ALL" || filterType !== "ALL") && (
                        <button
                            onClick={() => {
                                setSearchQuery("")
                                setFilterStatus("ALL")
                                setFilterType("ALL")
                            }}
                            className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all"
                            title={t("reset")}
                        >
                            <HiOutlineX className="text-xl" />
                        </button>
                    )}
                </div>
            </div>

            {/* List Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                    <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 rounded-3xl">
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">{t("stats.total")}</p>
                        <h4 className="text-3xl font-black text-white">{businesses.length}</h4>
                    </div>
                    <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-8 rounded-3xl">
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">{t("stats.active")}</p>
                        <h4 className="text-3xl font-black text-white">{businesses.filter(b => b.status === "ACTIVE").length}</h4>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-zinc-950/50 border-b border-zinc-800">
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">{t("table.business")}</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">{t("table.owner")}</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500 text-center">{t("table.stats")}</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">{t("table.subscription")}</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">{t("table.status")}</th>
                                <th className="px-8 py-6 text-sm font-black text-zinc-500">{t("table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            <AnimatePresence>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">{t("table.loading")}</td>
                                    </tr>
                                ) : filteredBusinesses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">{t("table.noResults")}</td>
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
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-xl overflow-hidden relative">
                                                    {biz?.logo ? (
                                                        <Image src={biz?.logo} alt={biz.name} fill className="object-cover" />
                                                    ) : (
                                                        <HiOutlineOfficeBuilding className="text-2xl" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white group-hover:text-indigo-400 transition-colors">{biz.name}</p>
                                                    <p className="text-zinc-500 text-xs mt-0.5 font-bold">{t("table.startDate")}: {new Date(biz.createdAt).toLocaleDateString(locale)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold">{biz.ownerName}</span>
                                                <span className="text-zinc-500 text-xs font-medium">{biz.ownerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-white font-black">{biz.serviceCount}</p>
                                                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{t("table.service")}</p>
                                                </div>
                                                <div className="w-px h-8 bg-white/5" />
                                                <div className="text-center">
                                                    <p className="text-white font-black">{biz.staffCount}</p>
                                                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{t("table.staff")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${biz.plan === "BASIC" ? "text-zinc-500" : "text-indigo-400"
                                                    }`}>
                                                    {t("table.plan")} {biz.plan}
                                                </span>
                                                <span className="text-white text-xs font-bold">
                                                    {biz.subscriptionEnd ? new Date(biz.subscriptionEnd).toLocaleDateString(locale) : t("table.lifetime")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-6 ">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black ring-1 ${biz.status === "ACTIVE"
                                                ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                                                : biz.status === "PENDING" ?
                                                    "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20" :
                                                    "bg-red-500/10 text-red-400 ring-red-500/20"
                                                }`}>
                                                {biz.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/businesses/${biz.id}`}
                                                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg"
                                                    title="View Details"
                                                >
                                                    <HiOutlineGlobeAlt className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleEditClick(biz)}
                                                    className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all shadow-lg"
                                                >
                                                    <HiOutlinePencilAlt className="text-xl" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(biz)}
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
                    <div className="fixed inset-0 z-100 flex items-center justify-center   overflow-y-auto p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md  overflow-y-auto"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-12 relative cursor-pointer">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="absolute top-8 right-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-100 transition-all"
                                >
                                    <HiOutlineX className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black text-white mb-2 relative">{t("modal.editTitle")}</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium relative italic">{t("modal.editSubtitle")}</p>

                                <form onSubmit={handleUpdate} className="space-y-6 relative">
                                    <div className="grid grid-cols-2 gap-2">

                                        <Input
                                            label={t("modal.name")}
                                            icon={<HiOutlineOfficeBuilding />}
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label={t("modal.slug")}
                                            icon={<HiOutlineGlobeAlt />}
                                            value={editForm.slug}
                                            onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                            required
                                        />

                                        <Select
                                            label={t("modal.type")}
                                            icon={<MdOutlineWorkOutline />}
                                            value={editForm.type}
                                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                            options={[
                                                { value: "", label: "Choose type..." },
                                                ...typed.map(b => ({ value: b, label: b }))
                                            ]}
                                        />

                                        <Input
                                            label={t("modal.description")}
                                            icon={<HiDocumentText />}
                                            type="text"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label={t("modal.phone")}
                                            icon={<HiPhone />}
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            required
                                            type="number"
                                        />
                                        <Input
                                            label={t("modal.address")}
                                            icon={<HiHome />}
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            required
                                        />
                                        <div className="col-span-2">
                                            <LogoUpload
                                                value={editForm.logo}
                                                onChange={(val) => setEditForm(prev => ({ ...prev, logo: val }))}
                                            />
                                        </div>



                                        <Select
                                            label={t("table.status")}
                                            icon={<HiOutlineCheckCircle />}
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            options={[
                                                { value: "ACTIVE", label: "ACTIVE" },
                                                { value: "INACTIVE", label: "INACTIVE" },
                                                { value: "SUSPENDED", label: "SUSPENDED" },
                                                { value: "PENDING", label: "PENDING" },
                                            ]}
                                        />

                                        <div className="flex items-center gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                            >
                                                {t("modal.save")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowEditModal(false)}
                                                className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all"
                                            >
                                                {t("modal.cancel")}
                                            </button>
                                        </div>
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
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4  overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md  overflow-y-auto"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="cursor-pointer  bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-12 relative">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-8 right-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-100 transition-all"
                                >
                                    <HiOutlineX className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black text-white mb-2 relative">{t("modal.addTitle")}</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium relative italic">{t("modal.addSubtitle")}</p>

                                <form onSubmit={handleAdd} className="space-y-6 ">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            label={t("modal.name")}
                                            icon={<HiOutlineOfficeBuilding />}
                                            value={addForm.name}
                                            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                            placeholder="e.g. Elegance Salon"
                                            required
                                        />
                                        <Input
                                            label={t("modal.slug")}
                                            icon={<HiOutlineGlobeAlt />}
                                            value={addForm.slug}
                                            onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                                            placeholder="e.g. elegance-salon"
                                            required
                                        />
                                        <Select
                                            label={t("modal.ownerEmail")}
                                            icon={<HiOutlineMail />}
                                            value={addForm.ownerEmail}
                                            onChange={(e) => setAddForm({ ...addForm, ownerEmail: e.target.value })}
                                            options={[
                                                { value: "", label: "Choose owner..." },
                                                ...userEmails.map(u => ({
                                                    value: u.email,
                                                    label: `${u.email} ${u.name ? `(${u.name})` : ""}`
                                                }))
                                            ]}
                                            required
                                        />
                                        <Select
                                            label={t("modal.type")}
                                            icon={<MdOutlineWorkOutline />}
                                            value={addForm.type}
                                            onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                                            options={[
                                                { value: "", label: "Choose type..." },
                                                ...typed.map(b => ({ value: b, label: b }))
                                            ]}
                                            required
                                        />

                                        <Input
                                            label={t("modal.description")}
                                            icon={<HiDocumentText />}
                                            type="text"
                                            value={addForm.description}
                                            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                            placeholder="Description"
                                            required
                                        />
                                        <Input
                                            label={t("modal.phone")}
                                            icon={<HiPhone />}
                                            value={addForm.phone}
                                            onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                                            placeholder="+123456789"
                                            required
                                            type="number"
                                        />
                                        <Input
                                            label={t("modal.address")}
                                            icon={<HiHome />}
                                            // type="email"
                                            value={addForm.address}
                                            onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                                            placeholder="Full Address"
                                            required
                                        />
                                        <Select
                                            label={t("modal.months")}
                                            icon={<MdCalendarMonth />}
                                            value={addForm.numMonth}
                                            onChange={(e) => setAddForm({ ...addForm, numMonth: e.target.value })}
                                            options={[
                                                { value: "", label: "Choose duration" },
                                                ...[1, 3, 6, 12].map(u => ({
                                                    value: u,
                                                    label: `${u} Months`
                                                }))
                                            ]}
                                            required
                                        />
                                        <Select
                                            label={t("modal.plan")}
                                            icon={<MdBusiness />}
                                            value={addForm.plan}
                                            onChange={(e) => setAddForm({ ...addForm, plan: e.target.value })}
                                            options={[
                                                { value: "", label: "Choose plan..." },
                                                ...["BASIC", "PRO", "BUSINESS", "ENTERPRISE"].map(u => ({ value: u, label: u }))
                                            ]}
                                            required
                                        />
                                        <div className="col-span-2">
                                            <LogoUpload
                                                value={addForm.logo}
                                                onChange={(val) => setAddForm(prev => ({ ...prev, logo: val }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                        >
                                            {t("modal.create")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all"
                                        >
                                            {t("modal.cancel")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* delete modle  */}

            <AnimatePresence>
                {showDeleteModal && selectedBusiness &&
                    <Modles
                        setShowDeleteModal={setShowDeleteModal}
                        selectedItem={selectedBusiness}
                        handleDeleteItem={handleDelete}
                        title={t("modal.deleteTitle")}
                        description={t("modal.deleteDescription", { name: selectedBusiness.name })}
                        buttonText={t("modal.deleteConfirm")}
                    />
                }
            </AnimatePresence>
        </div>
    )
}
