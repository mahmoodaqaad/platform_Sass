"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiTrash, HiCurrencyDollar, HiClock, HiDocumentText } from "react-icons/hi";

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newService, setNewService] = useState({
        name: "",
        description: "",
        duration: "30",
        price: ""
    });

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            const data = await res.json();
            setServices(data.services || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const [error, setError] = useState<string | null>(null);

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newService),
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddModal(false);
                setNewService({ name: "", description: "", duration: "30", price: "" });
                fetchServices();
            } else {
                setError(data.message || "حدث خطأ غير متوقع");
            }
        } catch (error) {
            console.error(error);
            setError("حدث خطأ في الاتصال بالخادم");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">إدارة الخدمات</h1>
                    <p className="text-zinc-500 mt-1">إضافة وتعديل الخدمات التي تقدمها لعملائك.</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="py-3! px-6! text-sm bg-indigo-600 hover:bg-indigo-500 font-bold">
                    <HiPlus className="text-xl" />
                    إضافة خدمة جديدة
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/20 transition-all group">
                        <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                        <p className="text-zinc-500 text-sm mb-6 line-clamp-2 font-medium">{service.description || "لا يوجد وصف لهذه الخدمة."}</p>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-full border border-white/5">
                                <HiClock className="text-indigo-400" /> {service.duration} دقيقة
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-full border border-white/5">
                                <HiCurrencyDollar className="text-emerald-400" /> ${service.price.toString()}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 py-3! px-0! text-xs font-black uppercase tracking-widest border-white/5 hover:border-indigo-500/50">تعديل</Button>
                            <button className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all">
                                <HiTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {services.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 text-zinc-800 border-2 border-dashed border-zinc-800">
                        <HiPlus className="text-4xl" />
                    </div>
                    <h3 className="text-2xl font-black text-white">لا توجد خدمات حالياً</h3>
                    <p className="text-zinc-500 max-w-xs mt-2 font-medium">لم تقم بإضافة أي خدمات بعد. ابدأ الآن بالضغط على الزر أعلاه.</p>
                </div>
            )}

            {/* Add Service Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                            dir="rtl"
                        >
                            <div className="absolute top-0 left-0 p-8">
                                <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white transition-colors text-xl">✕</button>
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2">خدمة جديدة</h2>
                            <p className="text-zinc-500 text-sm mb-10 font-medium">أضف خدمة جديدة إلى قائمة حجزك.</p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-xs font-bold flex items-center gap-2"
                                >
                                    <span>⚠️</span>
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleAddService} className="space-y-6">
                                <Input label="اسم الخدمة" icon={<HiPlus />} value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} required />
                                <Input label="الوصف" icon={<HiDocumentText />} value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="المدة (دقائق)" icon={<HiClock />} type="number" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} required />
                                    <Input label="السعر ($)" icon={<HiCurrencyDollar />} type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} required />
                                </div>
                                <Button type="submit" className="w-full py-4 text-sm font-black bg-indigo-600 hover:bg-indigo-500">حفظ الخدمة</Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
