"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { notFound, useRouter } from "next/navigation";
import { HiOutlineOfficeBuilding, HiOutlineLink, HiOutlineSparkles, HiHome, HiPhone, HiDocumentText } from "react-icons/hi";
import axios from "axios";
import LogoUpload from "@/components/dashboard/LogoUpload";
// import { User } from "@/prisma/generated/prisma/browser";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sessionStorageData, setSessionStorageData] = useState({
        plan: "",
        duration: "",
        AllPaied: 0
    })
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        type: "SALON",
        description: "",
        logo: "",
        address: "",
        phone: "",

    });

    useEffect(() => {
        setLoading(true)
        const planse = sessionStorage.getItem("selected_plan") || "";
        const durationse = sessionStorage.getItem("subscription_duration") || "";
        const allpaidse = Number(sessionStorage.getItem("user_allpaides")) || 0;
        console.log(planse);

        setSessionStorageData({
            plan: planse,
            duration: durationse,
            AllPaied: Number(allpaidse),
        })
        setTimeout(() => {

            setLoading(false)
        }, 500);
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // const data = { ...formData, ...sessionStorageData }
            // console.log(data);

            const res = await axios.post("/api/business", { ...formData, ...sessionStorageData });

            console.log(res);


            // Clear sessionStorage after successful setup
            sessionStorage.removeItem("selected_plan");
            sessionStorage.removeItem("subscription_duration");
            sessionStorage.removeItem("user_allpaides");
            await axios.post("/api/auth/logout");

            router.push("/login?redirect=true");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };


    if (loading && (sessionStorageData.AllPaied === 0 || sessionStorageData.duration === "" || sessionStorageData.plan === "")) {

        return notFound()
    }
    return (
        <main className="mt-10 min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
                        <HiOutlineSparkles className="text-4xl text-white" />
                    </div>
                    <h1 className="text-4xl font-black mb-3">لنبدأ رحلة نجاحك!</h1>
                    <p className="text-zinc-500 text-lg">أخبرنا ببعض التفاصيل حول عملك لنقوم بإعداد لوحة التحكم الخاصة بك.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 backdrop-blur-xl">
                    <Input
                        label="اسم العمل (مثلاً: حلاقة أحمد)"
                        icon={<HiOutlineOfficeBuilding />}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        required
                    />

                    <Input
                        label="رابط صفحتك (مثلاً: ahmad-barber)"
                        icon={<HiOutlineLink />}
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        required
                    />

                    <div className="flex gap-3 ">
                        <Input
                            label="العنوان"
                            icon={<HiDocumentText />}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        <Input
                            label="رقم الهاتف"
                            type="number"
                            icon={<HiPhone />}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-between ">
                        <div className="flex-1">

                            <Input
                                className=""
                                label="العنوان"
                                icon={<HiHome />}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex-1">

                            <LogoUpload

                                value={formData.logo}
                                onChange={(val) => setFormData(prev => ({ ...prev, logo: val }))}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-4">نوع التخصص</label>
                        <div className="grid grid-cols-2 gap-4">
                            {["SALON", "CLINIC", "GYM", "STORE"].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`p-4 rounded-2xl border transition-all text-sm font-bold ${formData.type === type
                                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                                        : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}

                    <Button type="submit" isLoading={loading} className="w-full">
                        إنشاء لوحة التحكم الآن
                    </Button>
                </form>
            </motion.div>
        </main>
    );
}
