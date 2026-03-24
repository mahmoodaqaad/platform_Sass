"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineExclamationCircle, HiOutlineClock, HiOutlineBan, HiOutlineTrash } from "react-icons/hi";
import { motion } from "framer-motion";
import { BusinessGuardProps, BusinessStatus } from "@/lib/types";


export default function BusinessGuard({ children }: BusinessGuardProps) {
    const [statusData, setStatusData] = useState<BusinessStatus | null>(null);
    const [loading, setLoading] = useState(true);
    console.log(statusData);
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await axios.get("/api/owner/business");
                setStatusData({
                    exists: true,
                    status: res.data.status,
                    name: res.data.name
                });
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setStatusData({ exists: false });
                } else {
                    // Start with safe default if error but not 404 (e.g. network error)
                    // We might assume it exists if we can't prove otherwise, or block.
                    // Safer to let it pass or retry? For now, let's assume if it fails it might be auth or critical.
                    // But if it is 404 it means business is deleted.
                    setStatusData({ exists: false });
                }
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // CASE 1: Business Deleted / Not Found
    if (!statusData?.exists) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500"
                >
                    <HiOutlineTrash className="text-5xl" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-4">العمل غير موجود او هناك مشكلة في السيرفر</h2>
                <p className="text-zinc-500 max-w-md text-lg leading-relaxed">
                    يبدو أن هذا العمل تم حذفه من النظام او هناك مشكلة في السيرفر. لا يمكنك الوصول إلى لوحة التحكم حالياً.
                    يرجى التواصل مع الدعم الفني إذا كنت تعتقد أن هذا خطأ.
                </p>
            </div>
        );
    }

    // CASE 2: Business Suspended
    if (statusData.status === "SUSPENDED") {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500"
                >
                    <HiOutlineBan className="text-5xl" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-4">تم إيقاف حسابك</h2>
                <p className="text-zinc-500 max-w-md text-lg leading-relaxed mb-8">
                    تم تعليق نشاط "{statusData.name}" بسبب مخالفة الشروط أو لأسباب إدارية.
                    جميع العمليات متوقفة حالياً.
                </p>
                <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-bold">
                    الحالة: موقوف (SUSPENDED)
                </div>
            </div>
        );
    }

    // CASE 3: Business Inactive
    if (statusData.status === "INACTIVE") {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-zinc-400"
                >
                    <HiOutlineExclamationCircle className="text-5xl" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-4">الحساب غير نشط</h2>
                <p className="text-zinc-500 max-w-md text-lg leading-relaxed mb-8">
                    حساب "{statusData.name}" معطل حالياً.
                    لا يمكنك استقبال حجوزات جديدة أو إدارة العمليات.
                </p>
                <div className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 font-bold">
                    الحالة: غير نشط (INACTIVE)
                </div>
            </div>
        );
    }

    // CASE 4: Business Pending
    if (statusData.status === "PENDING") {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 text-amber-500"
                >
                    <HiOutlineClock className="text-5xl" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-4">قيد المراجعة</h2>
                <p className="text-zinc-500 max-w-md text-lg leading-relaxed mb-8">
                    شكراً لتسجيلك! حسابك "{statusData.name}" قيد المراجعة حالياً من قبل الإدارة.
                    سيتم تفعيل الحساب قريباً.
                </p>
                <div className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 font-bold">
                    الحالة: قيد المراجعة (PENDING)
                </div>
            </div>
        );
    }

    // CASE 5: Active - Render Children
    return <>{children}</>;
}
