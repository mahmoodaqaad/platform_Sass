"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineEllipsisVertical,
    HiOutlineXMark,
    HiOutlinePlus,
    HiOutlineShoppingBag,
    HiOutlineEnvelope,
    HiOutlinePhone
} from "react-icons/hi2"
import axios from "axios"

interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
}

interface Customer {
    id: string;
    name: string;
    email: string;
}

interface Appointment {
    id: string;
    startTime: string;
    status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
    service: Service;
    customer: Customer;
}

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
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [services, setServices] = useState<Service[]>([])
    const [, setCustomers] = useState<Customer[]>([])

    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        serviceId: "",
        startTime: "",
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [booksRes, servRes, custRes] = await Promise.all([
                axios.get("/api/bookings"),
                axios.get("/api/services"),
                axios.get("/api/owner/customers")
            ])
            setAppointments(booksRes.data.bookings || [])
            setServices(servRes.data)
            setCustomers(custRes.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post("/api/bookings", formData)
            setShowAddModal(false)
            setFormData({ customerName: "", customerEmail: "", serviceId: "", startTime: "" })
            fetchData()
        } catch (error) {
            console.error(error)
            alert("حدث خطأ أثناء إضافة الحجز")
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

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4">
                        <HiOutlineCalendar className="text-indigo-500" />
                        المواعيد والحجوزات
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">متابعة كافة الحجوزات القادمة والسابقة لعملك.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5">
                        تحميل التقرير
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <HiOutlinePlus className="text-xl" />
                        حجز يدوي جديد
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest text-xs opacity-50">قائمة المواعيد</h3>
                    <div className="flex gap-2">
                        {["الكل", "اليوم", "معلق", "مكتمل"].map(tab => (
                            <button key={tab} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === "الكل" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-white/[0.01]">
                            <tr>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">العميل</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">الخدمة</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">التاريخ والوقت</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">السعر</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">الحالة</th>
                                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">جاري التحميل...</td></tr>
                                ) : appointments.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-20 text-center text-zinc-500 font-bold">لا يوجد حجوزات مسجلة بعد.</td></tr>
                                ) : appointments.map((app, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={app.id}
                                        className="hover:bg-white/[0.03] transition-all group"
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
                                                    {new Date(app.startTime).toLocaleDateString('ar-EG')}
                                                </p>
                                                <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
                                                    <HiOutlineClock className="text-zinc-500" />
                                                    {new Date(app.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="text-white font-black">${app.service?.price}</span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                                {app.status === "CONFIRMED" ? "مؤكد" : app.status === "PENDING" ? "انتظار" : app.status === "COMPLETED" ? "مكتمل" : "ملغي"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <button className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                                                <HiOutlineEllipsisVertical className="text-xl" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
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

                                <h2 className="text-3xl font-black text-white mb-2">حجز يدوي جديد</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium italic">أضف موعداً جديداً لعملائك يدوياً في النظام.</p>

                                <form onSubmit={handleAddBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Input
                                            label="اسم العميل"
                                            icon={<HiOutlineUser />}
                                            value={formData.customerName}
                                            onChange={(e: any) => setFormData({ ...formData, customerName: e.target.value })}
                                            required
                                            placeholder="أدخل اسم العميل"
                                        />
                                    </div>
                                    <Input
                                        label="البريد الإلكتروني"
                                        icon={<HiOutlineEnvelope />}
                                        type="email"
                                        value={formData.customerEmail}
                                        onChange={(e: any) => setFormData({ ...formData, customerEmail: e.target.value })}
                                        required
                                        placeholder="customer@example.com"
                                    />
                                    <Select
                                        label="الخدمة"
                                        icon={<HiOutlineShoppingBag />}
                                        value={formData.serviceId}
                                        onChange={(e: any) => setFormData({ ...formData, serviceId: e.target.value })}
                                        required
                                    >
                                        <option value="">اختر الخدمة...</option>
                                        {services.map(s => <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>)}
                                    </Select>
                                    <div className="md:col-span-2">
                                        <Input
                                            label="وقت البدء"
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
                                            تأكيد الحجز
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

export default AppointmentsPage
