"use client"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineOfficeBuilding, HiOutlineUsers,
    HiOutlineClock, HiOutlineMap,
    HiOutlinePhone, HiOutlineMail, HiOutlineStar,
    HiArrowRight, HiOutlineCheckCircle,
    HiDocumentText, HiOutlineExternalLink,
    HiOutlinePencilAlt, HiOutlineCreditCard, HiOutlineX,
    HiOutlineGlobeAlt
} from "react-icons/hi"
import Image from "next/image"
import LogoUpload from "@/components/dashboard/LogoUpload"
import { MdOutlineWorkOutline, MdCalendarMonth } from "react-icons/md"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { useTranslations, useLocale } from "next-intl"
import { BusinessDetail } from "@/lib/types"


 
export default function BusinessDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations("D.admin.businessDetails")
    const tSections = useTranslations("D.admin.businessDetails.sections")
    const tFields = useTranslations("D.admin.businessDetails.fields")
    const tEdit = useTranslations("D.admin.businessDetails.editModal")
    const tExtend = useTranslations("D.admin.businessDetails.extendModal")

    const [business, setBusiness] = useState<BusinessDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showExtendModal, setShowExtendModal] = useState(false)
    const [editForm, setEditForm] = useState({
        name: "", slug: "", status: "", type: "", description: "", address: "", phone: "", logo: ""
    })
    const [monthsToAdd, setMonthsToAdd] = useState(1)

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`/api/admin/businesses/${id}`)
                setBusiness(res.data)

                // Pre-fill edit form
                setEditForm({
                    name: res.data.name,
                    slug: res.data.slug,
                    status: res.data.status,
                    type: res.data.type,
                    description: res.data.description || "",
                    address: res.data.address || "",
                    phone: res.data.phone || "",
                    logo: res.data.logo || ""
                })
            } catch (error) {
                console.error("Fetch detail error:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDetail()
    }, [id])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!business) return
        try {
            await axios.put("/api/admin/businesses", { id: business.id, ...editForm })
            setShowEditModal(false)
            // Refresh data
            const res = await axios.get(`/api/admin/businesses/${id}`)
            setBusiness(res.data)
            alert(tEdit("updateSuccess"))
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            alert(err.response?.data?.message || tEdit("updateError"))
        }
    }

    const handleExtendSubscription = async () => {
        if (!business) return
        try {
            await axios.post("/api/admin/businesses/subscription", {
                businessId: business.id,
                monthsToAdd
            })
            setShowExtendModal(false)
            // Refresh data
            const res = await axios.get(`/api/admin/businesses/${id}`)
            setBusiness(res.data)
            alert(tExtend("success"))
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            alert(err.response?.data?.message || tExtend("error"))
        }
    }

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!business) return <div className="text-white text-center py-20">{t("notFound")}</div>

    const getDaysRemaining = () => {
        if (!business.subscriptionEnd) return null
        const end = new Date(business.subscriptionEnd)
        const now = new Date()
        const diff = end.getTime() - now.getTime()
        return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    const daysRemaining = getDaysRemaining()

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all"
                >
                    <HiArrowRight className="text-xl" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white">{t("title")}</h1>
                    <p className="text-zinc-500 font-medium">{t("subtitle", { name: business.name })}</p>
                </div>
                <div className={`${locale === 'ar' ? 'mr-auto' : 'ml-auto'} flex items-center gap-3`}>
                    <Link
                        href={`/${business.slug}`}
                        target="_blank"
                        className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-white font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
                    >
                        <HiOutlineExternalLink />
                        {t("visitWebsite")}
                    </Link>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
                    >
                        <HiOutlinePencilAlt />
                        {t("editData")}
                    </button>
                    <button
                        onClick={() => setShowExtendModal(true)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                        <HiOutlineCreditCard />
                        {t("extendSubscription")}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-3xl rounded-full" />

                        <div className="relative mb-8">
                            <div className="w-32 h-32 bg-zinc-800 rounded-[2.5rem] mx-auto flex items-center justify-center text-indigo-400 shadow-2xl overflow-hidden border-4 border-white/5 group-hover:scale-105 transition-transform">
                                {business.logo ? (
                                    <Image src={business.logo} alt={business.name} fill className="object-cover" />
                                ) : (
                                    <HiOutlineOfficeBuilding className="text-5xl" />
                                )}
                            </div>
                            <div className={`absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-4 ring-zinc-900 shadow-xl ${business.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                                }`}>
                                {business.status}
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2">{business.name}</h2>
                        <p className="text-indigo-400 font-bold mb-8">/{business.slug}</p>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            {[
                                { label: tSections("services"), value: business._count.services, icon: <HiOutlineStar /> },
                                { label: tSections("staff"), value: business._count.members, icon: <HiOutlineUsers /> },
                            ].map((stat, i) => (
                                <div key={i} className="bg-black/20 p-4 rounded-3xl border border-white/5 hover:border-indigo-500/20 transition-all">
                                    <div className="text-zinc-500 text-lg mb-1 mx-auto flex justify-center">{stat.icon}</div>
                                    <p className="text-xl font-black text-white">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subscription Card */}
                    <div className="bg-linear-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                        <h3 className="text-xl font-black mb-6 relative flex items-center gap-3">
                            <HiOutlineCheckCircle />
                            {tSections("subscriptionStatus")}
                        </h3>

                        <div className="space-y-6 relative">
                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{tFields("currentPlan")}</p>
                                <p className="text-2xl font-black uppercase">{business.plan} PLAN</p>
                            </div>

                            <div className="flex justify-between items-center px-2">
                                <div className="flex items-center gap-3">
                                    <HiOutlineClock className="text-xl opacity-60" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{tFields("expiresOn")}</p>
                                        <p className="font-bold">
                                            {business.subscriptionEnd ? new Date(business.subscriptionEnd).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : tFields("notAvailable")}
                                        </p>
                                    </div>
                                </div>
                                {daysRemaining !== null && (
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-black ring-1 ${daysRemaining <= 7 ? "bg-red-500 text-white ring-red-400" : "bg-white/10 text-white ring-white/20"
                                        }`}>
                                        {tFields("daysRemaining", { count: daysRemaining })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 space-y-10">
                        <section className="space-y-6">
                            <h3 className={`text-xl font-black text-white border-indigo-500 ${locale === 'ar' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>{tSections("basicInfo")}</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <DetailItem icon={<HiOutlineOfficeBuilding />} label={tFields("businessType")} value={business.type} />
                                <DetailItem icon={<HiOutlineClock />} label={tFields("joinDate")} value={new Date(business.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')} />
                                <DetailItem icon={<HiOutlinePhone />} label={tFields("phoneNumber")} value={business.phone || tFields("notAvailable")} />
                                <DetailItem icon={<HiOutlineMap />} label={tFields("address")} value={business.address || tFields("notAvailable")} />
                            </div>
                            <div className="pt-6 border-t border-white/5">
                                <DetailItem icon={<HiDocumentText className="text-xl shrink-0 mt-1" />} label={tFields("businessDescription")} value={business.description || tFields("noDescription")} />
                            </div>
                        </section>

                        <section className="space-y-6 pt-10 border-t border-white/5">
                            <h3 className={`text-xl font-black text-white border-indigo-500 ${locale === 'ar' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>{tSections("ownerData")}</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <DetailItem icon={<HiOutlineUsers />} label={tFields("ownerName")} value={business.owner.name} />
                                <DetailItem icon={<HiOutlineMail />} label={tFields("email")} value={business.owner.email} />
                            </div>
                        </section>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10">
                        <h3 className="text-xl font-black text-white mb-6">{tSections("accountActivity")}</h3>
                        <div className="flex items-center justify-center h-40 border-2 border-dashed border-zinc-800 rounded-3xl">
                            <p className="text-zinc-600 font-medium italic">{t("activityPlaceholder")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                                    className="absolute top-8 right-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-100 transition-all"
                                >
                                    <HiOutlineX className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black text-white mb-2">{tEdit("title")}</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium italic">{tEdit("subtitle")}</p>

                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <Input
                                                label={tEdit("businessName")}
                                                icon={<HiOutlineOfficeBuilding />}
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <Input
                                                label={tEdit("slug")}
                                                icon={<HiOutlineGlobeAlt />}
                                                value={editForm.slug}
                                                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <Input
                                                label={tEdit("description")}
                                                icon={<HiDocumentText />}
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 md:col-span-1">
                                            <Select
                                                label={tEdit("businessType")}
                                                icon={<MdOutlineWorkOutline />}
                                                value={editForm.type}
                                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                options={[
                                                    { value: "CLINIC", label: "CLINIC" },
                                                    { value: "GYM", label: "GYM" },
                                                    { value: "HOTEL", label: "HOTEL" },
                                                    { value: "RESTAURANT", label: "RESTAURANT" },
                                                    { value: "SALON", label: "SALON" },
                                                    { value: "SPA", label: "SPA" },
                                                    { value: "STORE", label: "STORE" },
                                                    { value: "OTHER", label: "OTHER" },
                                                ]}
                                            />
                                        </div>

                                        <div className="col-span-2 md:col-span-1">
                                            <Select
                                                label={tEdit("status")}
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
                                        </div>

                                        <div className="col-span-2">
                                            <Input
                                                label={tEdit("phoneNumber")}
                                                icon={<HiOutlinePhone />}
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <Input
                                                label={tEdit("address")}
                                                icon={<HiOutlineMap />}
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <LogoUpload
                                                value={editForm.logo}
                                                onChange={(val) => setEditForm(prev => ({ ...prev, logo: val }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                        >
                                            {tEdit("saveChanges")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Extend Subscription Modal */}
            <AnimatePresence>
                {showExtendModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowExtendModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-12 relative text-white">
                                <button
                                    onClick={() => setShowExtendModal(false)}
                                    className="absolute top-8 right-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-100 transition-all"
                                >
                                    <HiOutlineX className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black mb-2">{tExtend("title")}</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium italic">{tExtend("subtitle")}</p>

                                <div className="space-y-6">
                                    <Select
                                        label={tExtend("duration")}
                                        icon={<MdCalendarMonth />}
                                        value={monthsToAdd}
                                        onChange={(e) => setMonthsToAdd(Number(e.target.value))}
                                        options={[
                                            { value: 1, label: tExtend("oneMonth") },
                                            { value: 3, label: tExtend("threeMonths") },
                                            { value: 6, label: tExtend("sixMonths") },
                                            { value: 12, label: tExtend("oneYear") },
                                        ]}
                                    />

                                    <button
                                        onClick={handleExtendSubscription}
                                        className="w-full px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <HiOutlineCheckCircle className="text-xl" />
                                        {tExtend("confirm")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex gap-4">
            <div className="p-3 bg-zinc-950 border border-white/5 rounded-2xl text-indigo-400 h-fit">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{label}</p>
                <p className="font-bold text-white text-lg">{value}</p>
            </div>
        </div>
    )
}
