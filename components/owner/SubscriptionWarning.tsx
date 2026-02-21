"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { HiOutlineExclamationTriangle, HiOutlineCreditCard } from 'react-icons/hi2'
import Link from 'next/link'

interface Props {
    subscriptionEnd: string | Date | null
    plan: string
}

const SubscriptionWarning = ({ subscriptionEnd, plan }: Props) => {
    if (!subscriptionEnd || plan === "ENTERPRISE") return null

    const endDate = new Date(subscriptionEnd)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Only show if 7 days or less remaining
    if (diffDays > 7) return null

    const isExpired = diffDays <= 0

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-2xl border flex items-center gap-4 ${isExpired
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isExpired ? "bg-red-500/20" : "bg-amber-500/20"
                }`}>
                <HiOutlineExclamationTriangle className="text-2xl" />
            </div>

            <div className="flex-1">
                <h4 className="font-black text-sm uppercase tracking-wide">
                    {isExpired ? "انتهى اشتراكك!" : "قرب انتهاء الاشتراك"}
                </h4>
                <p className="text-xs font-medium opacity-80 mt-1">
                    {isExpired
                        ? `لقد انتهى اشتراك باقة ${plan} الخاصة بك. يرجى التجديد لتجنب توقف الخدمات.`
                        : `باقي ${diffDays} أيام فقط على انتهاء اشتراكك في باقة ${plan}.`}
                </p>
            </div>

            <Link
                href="/pricing"
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${isExpired
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
            >
                <HiOutlineCreditCard />
                تجديد الآن
            </Link>
        </motion.div>
    )
}

export default SubscriptionWarning
