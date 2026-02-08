import React from 'react'
import { HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlineChevronRight } from 'react-icons/hi2'
import Link from 'next/link'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'

const AdminOverview = () => {
    const stats = [
        { name: "إجمالي المستخدمين", value: "1,250", icon: HiOutlineUserGroup, color: "text-blue-400", bg: "bg-blue-500/10" },
        { name: "الشركات المسجلة", value: "48", icon: HiOutlineOfficeBuilding, color: "text-indigo-400", bg: "bg-indigo-500/10" },
        { name: "الإيرادات الشهرية", value: "$4,500", icon: HiOutlineCurrencyDollar, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { name: "معدل النمو", value: "+12%", icon: HiOutlineChartBar, color: "text-purple-400", bg: "bg-purple-500/10" },
    ]

    const recentUsers = [
        { id: 1, name: "Ahmed Ali", role: "OWNER", status: "Active" },
        { id: 2, name: "Sara Mohamed", role: "USER", status: "Pending" },
        { id: 3, name: "John Doe", role: "STAFF", status: "Active" },
    ]

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white">لوحة تحكم المدير العام</h1>
                <p className="text-zinc-500 mt-2 font-medium">مرحباً بك في مركز إدارة المنصة. إليك ملخص لأخر التطورات.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-indigo-500/20 transition-all group">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border border-white/5`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.name}</p>
                        <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Users List */}
                <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white">أحدث الأعضاء</h3>
                        <Link href="/admin/users" className="text-indigo-400 text-sm font-bold hover:underline flex items-center gap-1">
                            عرض الكل <HiOutlineChevronRight />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-indigo-400">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{user.name}</h4>
                                        <span className="text-zinc-500 text-xs font-medium uppercase tracking-tighter">{user.role}</span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                    }`}>
                                    {user.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-linear-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
                    <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/10 blur-3xl rounded-full" />
                    <h3 className="text-2xl font-black mb-6 relative">حالة النظام</h3>
                    <div className="space-y-6 relative">
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span>قاعدة البيانات</span>
                                <span className="text-emerald-400">مثالي</span>
                            </div>
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-[94%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span>سرعة الاستجابة</span>
                                <span>120ms</span>
                            </div>
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[85%]" />
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-10 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-zinc-100 transition-all active:scale-95">
                        تحميل تقرير كامل
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminOverview
