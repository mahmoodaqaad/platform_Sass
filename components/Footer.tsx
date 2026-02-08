"use client";

import React from "react";
import Link from "next/link";
import { SiX, SiLinkedin, SiGithub, SiDiscord } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="bg-[#050505] border-t border-zinc-900 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-black">M</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Platform</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                            The unified operating system for modern business management and digital scaling.
                        </p>
                        <div className="flex gap-4">
                            {[SiX, SiLinkedin, SiGithub, SiDiscord].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 transition-all"
                                >
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        {
                            title: "Product",
                            links: ["Features", "Integrations", "Pricing", "Changelog"]
                        },
                        {
                            title: "Company",
                            links: ["About Us", "Careers", "Blog", "Newsroom"]
                        },
                        {
                            title: "Legal",
                            links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "SLA"]
                        }
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-300">
                                {col.title}
                            </h4>
                            <ul className="space-y-4">
                                {col.links.map((link, lIndex) => (
                                    <li key={lIndex}>
                                        <Link href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:row items-center justify-between pt-10 border-t border-zinc-900 gap-6 text-zinc-600 text-xs">
                    <p>© 2026 MyPlatform Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        System Status: Nominal
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
