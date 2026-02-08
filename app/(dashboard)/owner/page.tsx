import React from "react";
import Button from "@/components/ui/Button";
import { HiPlus, HiArrowSmUp, HiArrowSmDown, HiTrendingUp } from "react-icons/hi";

export default function OwnerDashboard() {
    const stats = [
        { name: "إجمالي الإيرادات", value: "$45,231.89", change: "+20.1%", trend: "up", color: "text-emerald-400" },
        { name: "المواعيد المحجوزة", value: "356", change: "+12.5%", trend: "up", color: "text-indigo-400" },
        { name: "الطلبات المعلقة", value: "12", change: "-2.4%", trend: "down", color: "text-rose-400" },
        { name: "العملاء النشطون", value: "1,248", change: "+4.3%", trend: "up", color: "text-purple-400" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white">نظرة عامة على العمل</h1>
                    <p className="text-zinc-500 mt-2 font-medium">مرحباً بعودتك! إليك ملخص لما حدث اليوم في عملك.</p>
                </div>
                <Button className="py-3! px-6! text-sm font-bold bg-indigo-600 hover:bg-indigo-500">
                    <HiPlus className="text-xl" />
                    إجراء سريع
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-indigo-500/20 transition-all group">
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-4">{stat.name}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                            <div className={`flex items-center gap-1 text-xs font-black ${stat.color} bg-white/5 px-3 py-1 rounded-full border border-white/5`}>
                                {stat.trend === "up" ? <HiArrowSmUp /> : <HiArrowSmDown />}
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity Mini-Section */}
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <HiTrendingUp className="text-indigo-400" />
                            مخطط الأداء
                        </h3>
                        <button className="text-zinc-500 text-xs font-black uppercase hover:text-white transition-colors tracking-widest">عرض التقرير</button>
                    </div>
                    <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50">
                        <span className="text-zinc-600 font-medium italic">سيتم عرض البيانات الحقيقية قريباً</span>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-indigo-600 to-purple-800 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/10 blur-3xl rounded-full" />
                    <h3 className="text-2xl font-black mb-6 relative">نصيحة للمحترفين</h3>
                    <p className="opacity-80 leading-relaxed mb-8 relative font-medium">
                        يمكنك الآن أتمتة تذكيرات المواعيد لعملائك. الشركات التي تستخدم هذه الميزة قللت من عدم الحضور بنسبة 35%.
                    </p>
                    <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-zinc-100 transition-all active:scale-95 relative">
                        تفعيل الآن
                    </button>
                </div>
            </div>
        </div>
    );
}
