"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HiOutlineCog6Tooth, HiOutlineBuildingOffice, HiOutlineBell, HiOutlineShieldCheck, HiOutlineCreditCard, HiOutlineLockClosed, HiOutlineEnvelope, HiOutlineMegaphone } from "react-icons/hi2"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import LogoUpload from "@/components/dashboard/LogoUpload"
import axios from "axios"
import { toast } from "react-toastify"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const SettingsPage = () => {
    const t = useTranslations("D.owner.settings");
    const tTabs = useTranslations("D.owner.settings.tabs");
    const tBusiness = useTranslations("D.owner.settings.business");
    const tToast = useTranslations("D.owner.settings.toast");
    const tNotify = useTranslations("D.owner.settings.notifications");
    const tSecurity = useTranslations("D.owner.settings.security");
    const tBilling = useTranslations("D.owner.settings.billing");

    const [activeTab, setActiveTab] = useState("business")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        phone: "",
        logo: "",
        remindersEnabled: false,
        marketingAutomation: false
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const [businessStat, setBusinessStat] = useState<any>(null)

    const fetchBusiness = React.useCallback(async () => {
        try {
            const res = await axios.get("/api/owner/business")
            const biz = res.data

            setFormData({
                name: biz.name || "",
                description: biz.description || "",
                address: biz.address || "",
                phone: biz.phone || "",
                logo: biz.logo || "",
                remindersEnabled: biz.remindersEnabled || false,
                marketingAutomation: biz.marketingAutomation || false
            })
            setBusinessStat(biz)
        } catch (error) {
            console.error("Error fetching business:", error)
            toast.error(tToast("fetchError"))
        } finally {
            setLoading(false)
        }
    }, [tToast, setBusinessStat])

    useEffect(() => {
        fetchBusiness()
    }, [fetchBusiness])

    const handleSave = async () => {
        setSaving(true)
        try {
            await axios.patch("/api/owner/business", formData)
            toast.success(tToast("success"))
        } catch (error) {
            console.error("Error saving business:", error)
            toast.error(tToast("error"))
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match")
        }
        setSaving(true)
        try {
            await axios.post("/api/auth/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
            toast.success("Password updated successfully")
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password")
        } finally {
            setSaving(false)
        }
    }

    const tabs = [
        { id: "business", name: tTabs("business"), icon: <HiOutlineBuildingOffice /> },
        { id: "notifications", name: tTabs("notifications"), icon: <HiOutlineBell /> },
        { id: "security", name: tTabs("security"), icon: <HiOutlineShieldCheck /> },
        { id: "billing", name: tTabs("billing"), icon: <HiOutlineCreditCard /> },
    ]

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    )


    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white flex items-center gap-4">
                    <HiOutlineCog6Tooth className="text-indigo-500" />
                    {t("title")}
                </h1>
                <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
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
                        >
                            <LogoUpload
                                value={formData.logo}
                                onChange={(val) => setFormData({ ...formData, logo: val })}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={tBusiness("name")}
                                    icon={<HiOutlineBuildingOffice />}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Input
                                    label={tBusiness("phone")}
                                    icon={<HiOutlineBuildingOffice />}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <Input
                                    label={tBusiness("address")}
                                    icon={<HiOutlineBuildingOffice />}
                                    className="md:col-span-2"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-zinc-500 text-xs font-black uppercase tracking-widest mr-2">{tBusiness("descriptionLabel")}</label>
                                <textarea
                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-white font-medium focus:border-indigo-500/50 outline-none transition-all h-32"
                                    placeholder={tBusiness("descriptionPlaceholder")}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    isLoading={saving}
                                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-sm font-black"
                                >
                                    {tBusiness("save")}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "notifications" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8 relative"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 text-xl">
                                            <HiOutlineEnvelope />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{tNotify("email")}</h4>
                                            <p className="text-zinc-500 text-sm">{tNotify("emailDesc")}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, remindersEnabled: !formData.remindersEnabled })}
                                        className={`w-14 h-8 rounded-full transition-all relative ${formData.remindersEnabled ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.remindersEnabled ? 'right-1' : 'right-7'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 text-xl">
                                            <HiOutlineMegaphone />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{tNotify("marketing")}</h4>
                                            <p className="text-zinc-500 text-sm">{tNotify("marketingDesc")}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, marketingAutomation: !formData.marketingAutomation })}
                                        className={`w-14 h-8 rounded-full transition-all relative ${formData.marketingAutomation ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.marketingAutomation ? 'right-1' : 'right-7'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    isLoading={saving}
                                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-sm font-black"
                                >
                                    {tBusiness("save")}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "security" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8 relative"
                        >
                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    label={tSecurity("currentPassword")}
                                    type="password"
                                    icon={<HiOutlineLockClosed />}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                                <Input
                                    label={tSecurity("newPassword")}
                                    type="password"
                                    icon={<HiOutlineLockClosed />}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                                <Input
                                    label={tSecurity("confirmPassword")}
                                    type="password"
                                    icon={<HiOutlineLockClosed />}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <Button
                                    onClick={handleChangePassword}
                                    isLoading={saving}
                                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-sm font-black"
                                >
                                    {tSecurity("update")}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "billing" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8 relative"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-xl">
                                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">{tBilling("currentPlan")}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-black text-white">{businessStat?.plan || "FREE"}</span>
                                        <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-black">
                                            {businessStat?.planActive ? tBilling("active") : tBilling("expired")}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-xl">
                                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">{tBilling("nextBilling")}</h4>
                                    <span className="text-xl font-bold text-white">
                                        {businessStat?.subscriptionEnd ? new Date(businessStat.subscriptionEnd).toLocaleDateString() : "---"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 bg-indigo-600 rounded-4xl text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
                                <div className="relative">
                                    <h3 className="text-2xl font-black">{tBilling("upgrade")}</h3>
                                    <p className="text-white/70 font-medium mt-1">Get more features and remove limits</p>
                                </div>
                                <Button
                                    onClick={() => {
                                        sessionStorage.setItem("upgrade_mode", "true");
                                        router.push("/pricing")
                                    }}
                                    className="relative px-8 py-3 bg-white text-indigo-600! hover:bg-zinc-100 font-black"
                                >
                                    {tBilling("upgrade")}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
