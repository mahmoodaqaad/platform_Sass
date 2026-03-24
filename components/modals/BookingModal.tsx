"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark, HiOutlineCalendarDays, HiOutlineClock, HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import axios from "axios";
import { toast } from "react-toastify";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: any;
    business: any;
}

const BookingModal = ({ isOpen, onClose, service, business }: BookingModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        date: "",
        time: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.date || !formData.time) {
            toast.error("Please select a date and time");
            return;
        }

        setLoading(true);
        try {
            // Combine date and time into a single strings
            const startTime = new Date(`${formData.date}T${formData.time}`).toISOString();

            await axios.post("/api/public/bookings", {
                serviceId: service.id,
                businessId: business.id,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                startTime
            });

            toast.success("Booking request sent! We will contact you soon.");
            onClose();
        } catch (error: any) {
            console.error("Booking error:", error);
            toast.error(error.response?.data?.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    const themeColor = business?.themeColor || "indigo";
    const bgClass = `bg-${themeColor}-600`;
    const textClass = `text-${themeColor}-600`;
    const ringClass = `focus:ring-${themeColor}-500`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className={`p-8 ${bgClass} text-white relative`}>
                            <button
                                onClick={onClose}
                                type="button"
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                            >
                                <HiOutlineXMark className="text-xl" />
                            </button>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Service Booking</p>
                            <h2 className="text-3xl font-black">{service.name}</h2>
                            <div className="flex items-center gap-4 mt-6 opacity-90 text-sm font-bold">
                                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                                    <HiOutlineClock className="text-lg" /> {service.duration} Min
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                <span className="text-xl font-black">${service.price.toString()}</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <HiOutlineCalendarDays className={textClass} /> Select Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className={` w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-${themeColor}-500 transition-all h-[64px]`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <HiOutlineClock className={textClass} /> Select Time
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-${themeColor}-500 transition-all h-[64px]`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Input
                                    label="Your Name"
                                    required
                                    icon={<HiOutlineUser />}
                                    placeholder="Enter your full name"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    required
                                    icon={<HiOutlineEnvelope />}
                                    placeholder="Enter your email"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    required
                                    icon={<HiOutlinePhone />}
                                    placeholder="Enter your phone number"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    theme={business.themeColor}
                                    type="submit"
                                    isLoading={loading}
                                    className={`w-full py-5 rounded-[1.5rem] font-black tracking-widest text-xs ${bgClass} hover:opacity-90 transition-opacity`}
                                >
                                    CONFIRM BOOKING
                                </Button>
                            </div>
                            <p className="text-center text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                                By booking you agree to our terms and conditions.
                            </p>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;
