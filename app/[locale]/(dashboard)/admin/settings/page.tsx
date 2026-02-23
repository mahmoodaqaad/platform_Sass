"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { HiOutlineShieldCheck, HiOutlineGlobeAlt, HiOutlineCurrencyDollar, HiOutlineAdjustmentsHorizontal, HiOutlineEnvelope, HiOutlinePhone, HiOutlineCheckCircle } from "react-icons/hi2"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Settings } from "@/lib/types"


const AdminSettings = () => {
    const t = useTranslations("D.admin.settings");
    const [activeTab, setActiveTab] = useState("general")
    const [settings, setSettings] = useState<Settings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get("/api/admin/settings")
                setSettings(res.data)
            } catch (error) {
                console.error("Fetch settings error:", error)
                toast.error(t("loading")) // Reusing loading error message or add a specific one
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [t])

    const handleSave = async () => {
        if (!settings) return
        setSaving(true)
        try {
            await axios.put("/api/admin/settings", settings)
            toast.success(t("success"))
        } catch (error) {
            console.error("Save settings error:", error)
            toast.error(t("error"))
        } finally {
            setSaving(false)
        }
    }

    const tabs = [
        { id: "general", name: t("tabs.general"), icon: <HiOutlineGlobeAlt /> },
        { id: "limits", name: t("tabs.limits"), icon: <HiOutlineAdjustmentsHorizontal /> },
        { id: "revenue", name: t("tabs.revenue"), icon: <HiOutlineCurrencyDollar /> },
        { id: "users", name: t("tabs.users"), icon: <HiOutlineShieldCheck /> },
    ]

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!settings) return <div className="text-white">{t("loading")}</div>

    return (
        <div className="space-y-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-black text-white flex items-center gap-4">
                    <HiOutlineAdjustmentsHorizontal className="text-indigo-500" />
                    {t("title")}
                </h1>
                <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Tabs */}
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

                {/* Content */}
                <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32" />

                    {activeTab === "general" && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8 relative"
                        >
                            <h3 className="text-2xl font-black text-white mb-6">{t("general.title")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label={t("general.platformName")}
                                    icon={<HiOutlineGlobeAlt />}
                                    value={settings.platformName}
                                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                />
                                <Input
                                    label={t("general.supportEmail")}
                                    name="email"
                                    icon={<HiOutlineEnvelope />}
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                />
                                <Input
                                    label={t("general.supportPhone")}
                                    icon={<HiOutlinePhone />}
                                    value={settings.supportPhone || ""}
                                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                                />
                                <div className="space-y-4">
                                    <label className="text-zinc-500 text-xs font-black uppercase tracking-widest mr-2">{t("general.registration.legend")}</label>
                                    <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 gap-2">
                                        <button
                                            onClick={() => setSettings({ ...settings, registrationOpen: true })}
                                            className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${settings.registrationOpen ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400"}`}
                                        >
                                            {t("general.registration.open")}
                                        </button>
                                        <button
                                            onClick={() => setSettings({ ...settings, registrationOpen: false })}
                                            className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${!settings.registrationOpen ? "bg-red-500 text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400"}`}
                                        >
                                            {t("general.registration.closed")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "limits" && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 relative">
                            <h3 className="text-2xl font-black text-white mb-6">{t("limits.title")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {Object.keys(settings.tiersConfig).map(tier => (
                                    <div key={tier} className="bg-black/20 border border-white/5 p-6 rounded-3xl">
                                        <h4 className="text-indigo-400 font-black text-sm uppercase tracking-widest mb-6 border-b border-indigo-500/10 pb-4">{tier} {t("limits.tier") }</h4>
                                        <div className="space-y-4">
                                            <Input
                                                label={t("limits.plans.Services")} // Consider translating if needed, though technical terms often stay
                                                type="number"
                                                value={settings.tiersConfig[tier].services}
                                                onChange={(e) => {
                                                    const newConfig = { ...settings.tiersConfig }
                                                    newConfig[tier].services = parseInt(e.target.value)
                                                    setSettings({ ...settings, tiersConfig: newConfig })
                                                }}
                                            />
                                            <Input
                                                label={t("limits.plans.Members")}
                                                type="number"
                                                value={settings.tiersConfig[tier].members}
                                                onChange={(e) => {
                                                    const newConfig = { ...settings.tiersConfig }
                                                    newConfig[tier].members = parseInt(e.target.value)
                                                    setSettings({ ...settings, tiersConfig: newConfig })
                                                }}
                                            />
                                            <Input
                                                label={t("limits.plans.Appointments_Mo")}
                                                type="number"
                                                value={settings.tiersConfig[tier].appointments}
                                                onChange={(e) => {
                                                    const newConfig = { ...settings.tiersConfig }
                                                    newConfig[tier].appointments = parseInt(e.target.value)
                                                    setSettings({ ...settings, tiersConfig: newConfig })
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "revenue" && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 relative">
                            <h3 className="text-2xl font-black text-white mb-6">{t("revenue.title")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label={t("revenue.currency")}
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                />
                                <Input
                                    label={t("revenue.commission")}
                                    type="number"
                                    value={settings.commissionRate}
                                    onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4">
                                <HiOutlineCheckCircle className="text-indigo-400 text-3xl shrink-0" />
                                <p className="text-zinc-500 text-sm font-medium">{t("revenue.note")}</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "users" && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 text-4xl">
                                <HiOutlineShieldCheck />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">{t("users.title")}</h3>
                                <p className="text-zinc-500 mt-2 font-medium max-w-sm">{t("users.description")}</p>
                            </div>
                            <Link
                                href="/admin/settings/roles"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all flex items-center gap-3"
                            >
                                <HiOutlineShieldCheck className="text-indigo-400 text-xl" />
                                {t("users.button")}
                            </Link>
                        </div>
                    )}

                    <div className="pt-10 mt-10 border-t border-white/5 flex justify-end">
                        <Button
                            onClick={handleSave}
                            isLoading={saving}
                            className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/30 font-black"
                        >
                            {t("save")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
