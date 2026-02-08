"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiCheck, HiStar } from "react-icons/hi";

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for individuals and side projects.",
        features: [
            "Up to 3 projects",
            "Standard analytics",
            "Public cloud hosting",
            "Community support"
        ],
        button: "Get Started",
        popular: false
    },
    {
        name: "Professional",
        price: "49",
        description: "The complete toolkit for scaling businesses.",
        features: [
            "Unlimited projects",
            "Advanced AI analytics",
            "Private node deployment",
            "24/7 Priority support",
            "Custom domains"
        ],
        button: "Try Pro Free",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Dedicated infrastructure for massive scale.",
        features: [
            "Everything in Pro",
            "White-glove migration",
            "SLA guarantees",
            "Dedicated account manager",
            "Custom legal terms"
        ],
        button: "Contact Sales",
        popular: false
    }
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-[#050505] text-white relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        Flexible <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Pricing</span> for Every Stage
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 text-lg max-w-2xl mx-auto"
                    >
                        Start for free and scale as you grow. No hidden fees, just transparent value.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-10 rounded-[2.5rem] border ${plan.popular
                                ? "bg-zinc-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 relative"
                                : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                                } transition-all flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 shadow-lg shadow-indigo-500/20">
                                    <HiStar />
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-zinc-500 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-black tracking-tight">
                                    {plan.price !== "Custom" ? `$${plan.price}` : plan.price}
                                </span>
                                {plan.price !== "Custom" && <span className="text-zinc-500">/mo</span>}
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <HiCheck className="text-indigo-400 w-5 h-5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                }`}>
                                {plan.button}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
