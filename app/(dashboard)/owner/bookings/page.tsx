"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiCheckCircle, HiCalendar, HiUser, HiSparkles } from "react-icons/hi";

export default function OwnerBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/bookings")
            .then(res => res.json())
            .then(data => setBookings(data.bookings || []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-white">Appointments</h1>
                <p className="text-zinc-500 mt-1">Track and manage your customer bookings.</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950/50 border-b border-zinc-800">
                        <tr>
                            <th className="px-10 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Customer</th>
                            <th className="px-10 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Service</th>
                            <th className="px-10 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Date & Time</th>
                            <th className="px-10 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                            <th className="px-10 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold">
                                            <HiUser />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{booking.customer.name}</p>
                                            <p className="text-zinc-500 text-sm">{booking.customer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="bg-zinc-950 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-500/20">
                                        {booking.service.name}
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-white font-medium">{new Date(booking.startTime).toLocaleDateString()}</p>
                                    <p className="text-zinc-500 text-sm">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                        <HiCheckCircle /> {booking.status}
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <button className="text-zinc-500 hover:text-white font-bold text-sm transition-colors">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <HiCalendar className="text-6xl text-zinc-800 mx-auto mb-6" />
                        <p className="text-zinc-500 font-medium">No appointments found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
