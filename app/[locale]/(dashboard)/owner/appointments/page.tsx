"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineEllipsisVertical,
    HiOutlineXMark,
    HiOutlinePlus,
    HiOutlineShoppingBag,
    HiOutlineEnvelope,
    HiCheckCircle,
    HiXCircle,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineArrowPath,
} from "react-icons/hi2"
import axios from "axios"
import { toast } from "react-toastify"
import { useTranslations, useLocale } from "next-intl"
import { Appointment, Customer, Service } from "@/lib/types"


const Input = ({ label, icon, ...props }: { label: string; icon: React.ReactNode;[key: string]: any }) => (
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

const Select = ({ label, icon, children, ...props }: { label: string; icon: React.ReactNode; children: React.ReactNode;[key: string]: any }) => (
    <div className="space-y-2 group">
        <label className="text-sm font-bold text-zinc-400 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2">
            {icon}
            {label}
        </label>
        <select
            {...props}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium appearance-none"
        >
            {children}
        </select>
    </div>
)

const AppointmentsPage = () => {
    const t = useTranslations("D.owner.appointments");
    const tStatus = useTranslations("D.owner.appointments.status");
    const tActions = useTranslations("D.owner.appointments.actions");
    const locale = useLocale();

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [services, setServices] = useState<Service[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

    const [filter, setFilter] = useState("all") // Changed default filter to key
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        serviceId: "",
        startTime: "",
    })

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [booksRes, servRes, custRes] = await Promise.all([
                axios.get("/api/owner/appointments"),
                axios.get("/api/services"),
                axios.get("/api/owner/customers")
            ])

            setAppointments(Array.isArray(booksRes.data.appointments) ? booksRes.data.appointments : [])
            setServices(Array.isArray(servRes.data) ? servRes.data : [])
            setCustomers(Array.isArray(custRes.data) ? custRes.data : [])
        } catch {
            toast.error(t("table.loading")) // Reuse loading error or generic error
        } finally {
            setLoading(false)
        }
    }
    const handleStatusUpdate = async (appointmentId: string, status: string) => {
        try {
            await axios.patch("/api/owner/appointments", { appointmentId, status });
            toast.success(tActions("updateSuccess"));
            fetchData();
        } catch {
            toast.error(tActions("updateError"));
        }
    };

    if (!mounted) return null;

    const handleAddBooking = async (e: React.FormEvent) => {
        e.preventDefault()

        // Duplicate Check
        const isDuplicate = appointments.some(app =>
            app.customer?.email === formData.customerEmail &&
            app.service?.id === formData.serviceId &&
            new Date(app.startTime).getTime() === new Date(formData.startTime).getTime()
        );

        if (isDuplicate) {
            const confirmRepeat = window.confirm(t("manualBooking.duplicate"));
            if (!confirmRepeat) return;
        }

        try {
            await axios.post("/api/bookings", formData)
            setShowAddModal(false)
            setFormData({ customerName: "", customerEmail: "", serviceId: "", startTime: "" })
            fetchData()
            toast.success(t("manualBooking.success"))
        } catch (error) {
            console.error(error)
            toast.error(t("manualBooking.error"))
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "PENDING": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "COMPLETED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
            default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
        }
    }

    const filterOptions = ["all", "today", "pending", "completed"];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineCalendar className="text-indigo-500" />
                        {t("title")}
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5">
                        {t("report")}
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <HiOutlinePlus className="text-xl" />
                        {t("newBooking")}
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-zinc-900 border border-white/5 rounded-4xl  shadow-2xl">
                <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest opacity-50">{t("table.listTitle")}</h3>
                    <div className="flex gap-2">
                        {filterOptions.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === tab ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}>
                                {tStatus(tab as any)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start"> {/* Removed dir="rtl" */}
                        <thead className="bg-white/1">
                            <tr>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-start">{t("table.customer")}</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-start">{t("table.service")}</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-start">{t("table.dateTime")}</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-start">{t("table.price")}</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-start">{t("table.status")}</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-start">{t("table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">{t("table.loading")}</td></tr>
                                ) : (() => {
                                    const filtered = appointments.filter(app => {
                                        if (filter === "all") return true;
                                        if (filter === "pending") return app.status === "PENDING";
                                        if (filter === "completed") return app.status === "COMPLETED";
                                        if (filter === "today") {
                                            const today = new Date().toLocaleDateString(locale);
                                            const appDate = new Date(app.startTime).toLocaleDateString(locale);
                                            return today === appDate;
                                        }
                                        return true;
                                    });

                                    if (filtered.length === 0) {
                                        return <tr><td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">{t("table.noResults")}</td></tr>;
                                    }

                                    return filtered.map((app, i) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={app.id}
                                            className="hover:bg-white/3 transition-all group"
                                        >
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                                                        <HiOutlineUser className="text-xl text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-lg">{app.customer?.name}</p>
                                                        <p className="text-zinc-500 text-xs font-medium">{app.customer?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className="text-zinc-300 font-bold">{app.service?.name}</span>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-white font-bold flex items-center gap-2">
                                                        <HiOutlineCalendar className="text-indigo-400" />
                                                        {new Date(app.startTime).toLocaleDateString(locale)}
                                                    </p>
                                                    <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
                                                        <HiOutlineClock className="text-zinc-500" />
                                                        {new Date(app.startTime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className="text-white font-black">${app.service?.price}</span>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                                    {tStatus(app.status.toLowerCase() as any)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-2">
                                                    {/* Primary Actions: Confirm & Cancel */}
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, 'CONFIRMED')}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${app.status === 'CONFIRMED' ? 'bg-emerald-500 text-white cursor-default' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                                                        title={tActions("confirm")}
                                                        disabled={app.status === 'CONFIRMED'}
                                                    >
                                                        <HiCheckCircle className="text-xl" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, 'CANCELLED')}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${app.status === 'CANCELLED' ? 'bg-rose-500 text-white cursor-default' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white'}`}
                                                        title={tActions("cancel")}
                                                        disabled={app.status === 'CANCELLED'}
                                                    >
                                                        <HiXCircle className="text-xl" />
                                                    </button>

                                                    {/* More Actions Dropdown */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveMenuId(activeMenuId === app.id ? null : app.id)}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeMenuId === app.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                                        >
                                                            <HiOutlineEllipsisVertical className="text-xl" />
                                                        </button>

                                                        {activeMenuId === app.id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-40"
                                                                    onClick={() => setActiveMenuId(null)}
                                                                />
                                                                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleStatusUpdate(app.id, 'COMPLETED');
                                                                            setActiveMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 text-start text-sm font-bold text-blue-400 hover:bg-blue-500/10 flex items-center justify-between group transition-colors"
                                                                    >
                                                                        <span>{tActions("complete")}</span>
                                                                        <HiOutlineCheckCircle className="text-lg group-hover:scale-110 transition-transform" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleStatusUpdate(app.id, 'PENDING');
                                                                            setActiveMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 text-start text-sm font-bold text-orange-400 hover:bg-orange-500/10 flex items-center justify-between group transition-colors"
                                                                    >
                                                                        <span>{tActions("waitlist")}</span>
                                                                        <HiOutlineClock className="text-lg group-hover:scale-110 transition-transform" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleStatusUpdate(app.id, 'PENDING'); // or RESET
                                                                            setActiveMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 text-start text-sm font-bold text-zinc-500 hover:bg-white/5 flex items-center justify-between group transition-colors border-t border-white/5 mt-1"
                                                                    >
                                                                        <span>{tActions("reset")}</span>
                                                                        <HiOutlineArrowPath className="text-lg group-hover:rotate-180 transition-transform duration-500" />
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                })()}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Booking Modal */}
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
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="p-12 relative max-h-[90vh] overflow-y-auto">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-8 left-8 p-3 hover:bg-zinc-900 rounded-2xl text-zinc-500 transition-all"
                                >
                                    <HiOutlineXMark className="text-2xl" />
                                </button>

                                <h2 className="text-3xl font-black text-white mb-2">{t("manualBooking.title")}</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium italic">{t("manualBooking.subtitle")}</p>

                                <form onSubmit={handleAddBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Select
                                            label={t("manualBooking.selectCustomer")}
                                            icon={<HiOutlineUser />}
                                            value={selectedCustomerId}
                                            onChange={(e: any) => {
                                                const id = e.target.value;
                                                setSelectedCustomerId(id);
                                                if (id) {
                                                    const cust = customers.find(c => c.id === id);
                                                    if (cust) {
                                                        setFormData({
                                                            ...formData,
                                                            customerName: cust.name,
                                                            customerEmail: cust.email
                                                        });
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="">{t("manualBooking.newOrSearch")}</option>
                                            {customers?.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name} ({c.email})
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            label={t("manualBooking.customerName")}
                                            icon={<HiOutlineUser />}
                                            value={formData.customerName}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, customerName: e.target.value });
                                                if (selectedCustomerId) setSelectedCustomerId(""); // Reset if manually editing
                                            }}
                                            required
                                            placeholder={t("manualBooking.customerName")}
                                        />
                                    </div>
                                    <Input
                                        label={t("manualBooking.customerEmail")}
                                        icon={<HiOutlineEnvelope />}
                                        type="email"
                                        name="email"

                                        value={formData.customerEmail}
                                        onChange={(e: any) => {
                                            setFormData({ ...formData, customerEmail: e.target.value });
                                            if (selectedCustomerId) setSelectedCustomerId(""); // Reset if manually editing
                                        }}
                                        required
                                        placeholder="customer@example.com"
                                    />
                                    <Select
                                        label={t("manualBooking.service")}
                                        icon={<HiOutlineShoppingBag />}
                                        value={formData.serviceId}
                                        onChange={(e: any) => setFormData({ ...formData, serviceId: e.target.value })}
                                        required
                                    >
                                        <option value="">{t("manualBooking.selectService")}</option>
                                        {services?.map(s => <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>)}
                                    </Select>
                                    <div className="md:col-span-2">
                                        <Input
                                            label={t("manualBooking.startTime")}
                                            icon={<HiOutlineClock />}
                                            type="datetime-local"
                                            value={formData.startTime}
                                            onChange={(e: any) => setFormData({ ...formData, startTime: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                                        >
                                            {t("manualBooking.confirm")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all"
                                        >
                                            {t("manualBooking.cancel")}
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

export default AppointmentsPage
