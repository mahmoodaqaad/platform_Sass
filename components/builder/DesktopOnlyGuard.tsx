"use client";

import React from "react";
import { HiOutlineComputerDesktop, HiOutlineChevronLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

const DesktopOnlyGuard: React.FC = () => {
    const router = useRouter();

    return (
        <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden min-h-[500px]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-md w-full space-y-8">
                {/* Icon Container */}
                <div className="relative inline-flex mb-8">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    <div className="relative w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center text-indigo-500 shadow-2xl">
                        <HiOutlineComputerDesktop className="text-5xl" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Desktop Access Required
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        To provide the best editing experience, the Website Builder is designed exclusively for large screens.
                    </p>
                    <p className="text-zinc-500 text-sm italic">
                        Please open this page on a computer or laptop.
                    </p>
                </div>

                <div className="pt-8">
                    <Button 
                        onClick={() => router.push("/owner")}
                        className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-2xl flex items-center justify-center gap-2 group transition-all"
                    >
                        <HiOutlineChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                        Go Back to Dashboard
                    </Button>
                </div>

                <div className="pt-12 flex items-center justify-center gap-6 text-zinc-600">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-12 border-2 border-zinc-800 rounded-lg flex items-start justify-center p-1">
                            <div className="w-1 h-3 bg-zinc-800 rounded-full" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Mobile</span>
                    </div>
                    <div className="w-8 h-px bg-zinc-800" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-10 border-2 border-indigo-500/50 bg-indigo-500/5 rounded-md flex items-center justify-center">
                            <div className="w-4 h-4 bg-indigo-500/20 rounded-sm" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-tighter text-indigo-400">Desktop</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopOnlyGuard;
