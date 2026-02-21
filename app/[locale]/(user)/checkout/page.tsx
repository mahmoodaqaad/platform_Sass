"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCreditCard, HiOutlineShieldCheck, HiOutlineLockClosed, HiCheck, HiArrowLeft, HiCalendarDays } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify"

const planDetails: Record<string, { price: number; color: string }> = {
    PRO: { price: 49, color: "indigo" },
    BUSINESS: { price: 99, color: "purple" }
};

const durations = [
    { label: "شهر واحد", value: 1, discount: 0 },
    { label: "3 أشهر", value: 3, discount: 5 },
    { label: "6 أشهر", value: 6, discount: 10 },
    { label: "سنة كاملة", value: 12, discount: 20 },
];

const CheckoutContent = () => {
    const router = useRouter();
    const plan = sessionStorage.getItem("selected_plan");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
    const [paymentStep, setPaymentStep] = useState(1); // 1: Form, 2: Processing, 3: Success
    const [selectedDuration, setSelectedDuration] = useState(1);

    const isUpgrade = useSearchParams().get("mode") === "upgrade";
    const [upgradeDiscount, setUpgradeDiscount] = useState(0);

    const currentPlan = plan ? planDetails[plan] : null;

    const calculateUpgradeDiscount = (biz: any) => {
        if (!biz?.subscriptionEnd || !biz?.AllPaied || Number(biz.AllPaied) === 0) return;

        const now = new Date();
        const end = new Date(biz.subscriptionEnd);
        const start = new Date(biz.subscriptionStart || now);

        const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        const remainingDays = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
        const daysSinceStart = (now.getTime() - start.getTime()) / (1000 * 3600 * 24);

        if (daysSinceStart <= 3) {
            // Full credit within first 3 days
            setUpgradeDiscount(Number(biz.AllPaied));
        } else if (remainingDays > 0 && totalDays > 0) {
            // Linear pro-rating
            const ratio = remainingDays / totalDays;
            const discount = Number(biz.AllPaied) * ratio;
            setUpgradeDiscount(Math.floor(discount));
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                if (res.data.authenticated) {
                    setUser(res.data.user);
                    if (isUpgrade) {
                        const bizRes = await axios.get("/api/owner/business");
                        calculateUpgradeDiscount(bizRes.data);
                    }
                }
            } catch {
                setUser(null);
            }
        };
        checkAuth();
        if (!plan || !planDetails[plan]) {
            router.push("/");
        }
    }, [plan, router, isUpgrade]);

    const calculateTotal = () => {
        if (!currentPlan) return 0;
        const base = currentPlan.price * selectedDuration;
        const durationObj = durations.find(d => d.value === selectedDuration);
        const discount = durationObj ? (base * durationObj.discount) / 100 : 0;
        const final = base - discount - upgradeDiscount;
        return final > 0 ? final : 0;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPaymentStep(2);

        const total = calculateTotal();
        if (total < 0) return false;

        try {
            if (isUpgrade) {
                await axios.post("/api/owner/business/upgrade", {
                    plan,
                    duration: selectedDuration,
                    paidAmount: total
                });
                sessionStorage.removeItem("upgrade_mode");
            } else {
                sessionStorage.setItem("subscription_duration", selectedDuration.toString());
                sessionStorage.setItem("user_allpaides", total.toString());
            }

            // Simulate payment delay
            setTimeout(() => {
                setPaymentStep(3);
                toast.success("تم تأكيد الدفع بنجاح!");

                setTimeout(() => {
                    if (isUpgrade) {
                        router.push("/owner/settings");
                    } else if (user) {
                        router.push("/onboarding");
                    } else {
                        router.push(`/register?plan=${plan}`);
                    }
                }, 2000);
            }, 2000);
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("حدث خطأ أثناء معالجة الدفع");
            setPaymentStep(1);
            setLoading(false);
        }
    };

    if (!currentPlan) return null;

    const total = calculateTotal();

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
            {/* Background elements */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${currentPlan.color}-600/10 blur-[150px] rounded-full -mr-32 -mt-32`} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl bg-zinc-900/50 border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row"
            >
                {/* Left Side: Summary */}
                <div className={`w-full md:w-5/12 p-10 bg-${currentPlan.color}-500/5 border-l border-white/5`}>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 font-bold"
                    >
                        <HiArrowLeft />
                        العودة للخطط
                    </button>

                    <div className="space-y-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-${currentPlan.color}-500/10 text-${currentPlan.color}-400 text-xs font-black uppercase tracking-widest`}>
                            باقة {plan} المختارة
                        </div>
                        <h2 className="text-4xl font-black">ملخص الطلب</h2>

                        {/* Duration Selector */}
                        <div className="space-y-4 pt-4 border-t border-white/10 mt-6">
                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <HiCalendarDays className="text-lg" />
                                مدة الاشتراك
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {durations.map((d) => (
                                    <button
                                        key={d.value}
                                        onClick={() => setSelectedDuration(d.value)}
                                        className={`p-3 rounded-2xl border text-sm font-bold transition-all ${selectedDuration === d.value
                                            ? `bg-${currentPlan.color}-600 border-${currentPlan.color}-500 text-white shadow-lg`
                                            : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                                            }`}
                                    >
                                        {d.label}
                                        {d.discount > 0 && (
                                            <span className="block text-[10px] opacity-70">خصم {d.discount}%</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center text-zinc-400 font-medium">
                                <span>اسم الخطة:</span>
                                <span className="text-white font-bold">{plan}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 font-medium">
                                <span>المدة:</span>
                                <span className="text-white font-bold">{selectedDuration} شهر</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400 font-medium font-mono" dir="ltr">
                                <span>Base Price:</span>
                                <span className="text-white font-bold">${currentPlan.price * selectedDuration}.00</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-400 font-medium font-mono" dir="ltr">
                                <span>Discount:</span>
                                <span>-${(currentPlan.price * selectedDuration) - (currentPlan.price * selectedDuration - (durations.find(d => d.value === selectedDuration)?.discount || 0) * (currentPlan.price * selectedDuration) / 100)}.00</span>
                            </div>
                            {upgradeDiscount > 0 && (
                                <div className="flex justify-between items-center text-amber-400 font-medium font-mono" dir="ltr">
                                    <span>Upgrade Credit:</span>
                                    <span>-${upgradeDiscount}.00</span>
                                </div>
                            )}
                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-xl font-black">الإجمالي:</span>
                                <span className={`text-3xl font-black text-${currentPlan.color}-400 font-mono`} dir="ltr">${total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="flex-1 p-10 lg:p-14">
                    <AnimatePresence mode="wait">
                        {paymentStep === 1 && (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handlePayment}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black">معلومات الدفع</h3>
                                    <p className="text-zinc-500 font-medium">سيتم تشفير بياناتك وأمانها بالكامل عبر بروتوكولات حماية متقدمة.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-2">صاحب البطاقة</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 flex items-center gap-2 px-6 pr-14 text-white placeholder-zinc-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                placeholder="اسمك الكامل كما على البطاقة"
                                            />
                                            <HiOutlineCreditCard className="absolute top-1/2 right-6 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors text-xl" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-2">رقم البطاقة</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 flex items-center gap-2 px-6 pr-14 text-white placeholder-zinc-700 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-left"
                                                dir="ltr"
                                                placeholder="0000 0000 0000 0000"
                                            />
                                            <HiOutlineCreditCard className="absolute top-1/2 right-6 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors text-xl" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-left" dir="ltr">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">expiry Date</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder-zinc-700 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div className="space-y-2 text-right" dir="rtl">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-2">CVV</label>
                                            <input
                                                type="password"
                                                required
                                                maxLength={3}
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder-zinc-700 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-left"
                                                dir="ltr"
                                                placeholder="***"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-5 rounded-3xl bg-${currentPlan.color}-600 hover:bg-${currentPlan.color}-500 text-white font-black text-lg transition-all shadow-2xl shadow-${currentPlan.color}-600/30 flex items-center justify-center gap-3`}
                                >
                                    <HiOutlineLockClosed />
                                    تأكيد ودفع ${total}.00
                                </button>

                                <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                    <HiOutlineShieldCheck className="text-emerald-500 text-sm" />
                                    Secure SSL encrypted transaction
                                </p>
                            </motion.form>
                        )}

                        {paymentStep === 2 && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20"
                            >
                                <div className={`w-24 h-24 border-4 border-${currentPlan.color}-500 border-t-transparent rounded-full animate-spin`} />
                                <div>
                                    <h3 className="text-3xl font-black">جاري معالجة الدفع...</h3>
                                    <p className="text-zinc-500 mt-2 font-medium">يرجى عدم إغلاق الصفحة أو تحديثها.</p>
                                </div>
                            </motion.div>
                        )}

                        {paymentStep === 3 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20"
                            >
                                <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/30">
                                    <HiCheck />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-emerald-400">تم الدفع بنجاح!</h3>
                                    <p className="text-zinc-400 mt-4 font-medium italic">
                                        شكراً لثقتك بنا. سيتم توجيهك الآن لإكمال إعداد حسابك...
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const Checkout = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <CheckoutContent />
        </Suspense>
    );
};

export default Checkout;
