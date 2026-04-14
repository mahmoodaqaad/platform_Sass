"use client";

import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiTrash, HiCurrencyDollar, HiClock, HiDocumentText } from "react-icons/hi";
import axios from "axios";
import Image from "next/image";
import ImageUpload from "@/components/ui/ImageUpload";
import { useTranslations } from "next-intl";
import { Service } from "@/lib/types";

export default function ServicesPage() {
    const t = useTranslations("D.owner.services");
    const tEmpty = useTranslations("D.owner.services.empty");

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [defaultLang, setDefaultLang] = useState("ar");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: "30",
        price: "",
        image: "",
        isActive: true
    });

    const dictModal = {
        ar: {
            addTitle: "إضافة خدمة جديدة",
            editTitle: "تعديل الخدمة",
            addSubtitle: "أدخل تفاصيل الخدمة الجديدة أدناه",
            editSubtitle: "قم بتعديل تفاصيل الخدمة",
            name: "اسم الخدمة",
            description: "وصف الخدمة",
            duration: "المدة (بالدقائق)",
            price: "السعر",
            save: "حفظ الخدمة",
            update: "تحديث الخدمة",
            error: "حدث خطأ، يرجى المحاولة مرة أخرى"
        },
        en: {
            addTitle: "Add New Service",
            editTitle: "Edit Service",
            addSubtitle: "Enter the details of the new service below",
            editSubtitle: "Update the service details",
            name: "Service Name",
            description: "Service Description",
            duration: "Duration (minutes)",
            price: "Price",
            save: "Save Service",
            update: "Update Service",
            error: "An error occurred, please try again"
        }
    };

    const dictDelete = {
        ar: {
            title: "حذف الخدمة",
            confirm: "تأكيد الحذف",
            cancel: "إلغاء"
        },
        en: {
            title: "Delete Service",
            confirm: "Confirm Delete",
            cancel: "Cancel"
        }
    };

    const tMod = (key: keyof typeof dictModal.en) => dictModal[defaultLang as keyof typeof dictModal]?.[key] || dictModal.en[key];
    const tDel = (key: string, props?: { name?: string }) => {
        if (key === "description") {
            return defaultLang === "en" 
                ? `Are you sure you want to delete the service "${props?.name || ''}"? This action cannot be undone.`
                : `هل أنت متأكد من حذف الخدمة "${props?.name || ''}"؟ لا يمكن التراجع عن هذا الإجراء.`;
        }
        return dictDelete[defaultLang as keyof typeof dictDelete]?.[key as keyof typeof dictDelete.en] || dictDelete.en[key as keyof typeof dictDelete.en];
    };

    const dir = defaultLang === "ar" ? "rtl" : "ltr";

    const fetchServices = useCallback(async () => {
        try {
            const separator = showArchived ? "&" : "?";
            const res = await axios.get(`/api/services${showArchived ? "?archived=true" : ""}${separator}t=${new Date().getTime()}`);
            setServices(res.data || []);
        } finally {
            setLoading(false);
        }
    }, [showArchived]);

    const fetchBusiness = useCallback(async () => {
        try {
            const res = await axios.get('/api/owner/business');
            if (res.data?.business?.defaultLanguage) {
                setDefaultLang(res.data.business.defaultLanguage);
            }
        } catch (error) {
            console.error("Error fetching business language", error);
        }
    }, []);

    useEffect(() => { 
        fetchBusiness();
        fetchServices(); 
    }, [fetchBusiness, fetchServices]);

    const [error, setError] = useState<string | null>(null);

    const handleOpenModal = (service: Service | null = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name || "",
                description: service.description || "",
                duration: (service.duration || 30).toString(),
                price: (service.price || 0).toString(),
                image: service.image || "",
                isActive: service.isActive ?? true
            });
        } else {
            setEditingService(null);
            setFormData({ name: "", description: "", duration: "30", price: "", image: "", isActive: true });
        }
        setShowModal(true);
        setError(null);
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const url = "/api/services";
            const method = editingService ? "PATCH" : "POST";
            const payload = editingService ? { ...formData, id: editingService.id } : formData;
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (res.ok) {
                setShowModal(false);
                fetchServices();
            } else {
                setError(data.message || tMod("error"));
            }
        } catch (error) {
            console.error(error);
            setError(tMod("error"));
        }
    };

    const confirmDelete = async () => {
        if (!serviceToDelete) return;
        try {
            await axios.delete(`/api/services?id=${serviceToDelete.id}`);
            setShowDeleteModal(false);
            setServiceToDelete(null);
            fetchServices();
        } catch {
            alert(tMod("error"));
        }
    };

    const handleRestore = async (service: Service) => {
        try {
            await axios.patch("/api/services", { id: service.id, isActive: true });
            fetchServices();
        } catch {
            alert(tMod("error"));
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white">{t("title")}</h1>
                    <p className="text-zinc-500 mt-2 font-medium">{t("subtitle")}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="flex p-1 bg-zinc-900/80 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setShowArchived(false)}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition-all ${!showArchived ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}
                        >
                            {t("active")}
                        </button>
                        <button
                            onClick={() => setShowArchived(true)}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition-all ${showArchived ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}
                        >
                            {t("archived")}
                        </button>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="py-3! px-6! text-sm bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2">
                        <HiPlus className="text-xl" />
                        {t("addService")}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.filter(s => showArchived ? !s.isActive : s.isActive).map((service) => (
                    <div key={service.id} className={`p-0 rounded-[2.5rem] bg-zinc-900/50 border transition-all overflow-hidden group ${service.isActive ? "border-zinc-800 hover:border-indigo-500/20" : "border-zinc-800/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"}`}>
                        <div className="h-48 bg-zinc-800 relative overflow-hidden">
                            {service.image ? (
                                <Image
                                    src={service.image || "/placeholder-service.jpg"}
                                    alt={service.name || "Service"}
                                    unoptimized
                                    width={400}
                                    height={200}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-linear-to-br from-zinc-800 to-zinc-900">
                                    <HiPlus className="text-5xl opacity-20" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                {t("duration", { min: service.duration || 0 })}
                            </div>
                            {!service.isActive && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="px-4 py-2 bg-zinc-900/80 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                        {t("archivedLabel")}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-8">
                            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                            <p className="text-zinc-500 text-sm mb-6 line-clamp-2 font-medium h-10">{service.description || t("noDesc")}</p>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-full border border-white/5">
                                    <HiCurrencyDollar className="text-emerald-400" /> ${service.price.toString()}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {service.isActive ? (
                                    <>
                                        <Button
                                            onClick={() => handleOpenModal(service)}
                                            variant="outline"
                                            className="flex-1 py-3! px-0! text-xs font-black uppercase tracking-widest border-white/5 hover:border-indigo-500/50"
                                        >
                                            {t("edit")}
                                        </Button>
                                        <button
                                            onClick={() => {
                                                setServiceToDelete(service);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <HiTrash />
                                        </button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => handleRestore(service)}
                                        className="w-full py-3! text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500"
                                    >
                                        {t("restore")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {services.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center cursor-pointer">
                    <div onClick={() => {
                        setShowModal(true)
                    }} className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 text-zinc-800 border-2 border-dashed border-zinc-800">
                        <HiPlus className="text-4xl" />
                    </div>
                    <h3 className="text-2xl font-black text-white">{tEmpty("title")}</h3>
                    <p className="text-zinc-500 max-w-xs mt-2 font-medium">{tEmpty("description")}</p>
                </div>
            )}

            {/* Premium Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
                        />
                        <motion.div
                            dir={dir}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
                        >
                            <div className="absolute top-4 right-4 md:top-8 md:start-8 md:right-auto">
                                <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors text-xl p-2 bg-white/5 rounded-xl">✕</button>
                            </div>
                            <div className="mt-8 md:mt-0">
                                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{editingService ? tMod("editTitle") : tMod("addTitle")}</h2>
                                <p className="text-zinc-500 text-sm mb-10 font-medium">{editingService ? tMod("editSubtitle") : tMod("addSubtitle")}</p>
                            </div>

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

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input label={tMod("name")} icon={<HiPlus />} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <ImageUpload
                                    value={formData.image}
                                    onChange={(val) => setFormData({ ...formData, image: val })}
                                    onUploading={setIsUploading}
                                />
                                <Input label={tMod("description")} icon={<HiDocumentText />} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label={tMod("duration")} icon={<HiClock />} type="number" value={formData.duration} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration: e.target.value })} required />
                                    <Input label={tMod("price")} icon={<HiCurrencyDollar />} type="number" value={formData.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <Button type="submit" isLoading={isUploading} disabled={isUploading} className="w-full py-4 text-sm font-black bg-indigo-600 hover:bg-indigo-500">
                                    {editingService ? tMod("update") : tMod("save")}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Premium Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            dir={dir}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-900 border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl text-center"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <HiTrash className="text-4xl" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">{tDel("title")}</h2>
                            <p className="text-zinc-400 text-sm mb-10 leading-relaxed font-medium">
                                {tDel("description", { name: serviceToDelete?.name })}
                            </p>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={confirmDelete}
                                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold"
                                >
                                    {tDel("confirm")}
                                </Button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl font-bold transition-all"
                                >
                                    {tDel("cancel")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
