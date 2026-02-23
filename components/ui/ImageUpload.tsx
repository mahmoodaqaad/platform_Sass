"use client";

import React, { useState } from "react";
import { HiOutlineCloudUpload, HiOutlineX, HiOutlinePhotograph } from "react-icons/hi";
import Image from "next/image";
import axios from "axios";
import { UploadProps } from "@/lib/types";



const ImageUpload = ({ value, onChange, onUploading, label = "صورة الخدمة" }: UploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت.");
            return;
        }

        setUploading(true);
        onUploading?.(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { url } = res.data;
            setPreview(url);
            onChange(url);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("فشل في رفع الصورة. يرجى المحاولة مرة أخرى.");
        } finally {
            setUploading(false);
            onUploading?.(false);
        }
    };

    const handleClear = () => {
        setPreview("");
        onChange("");
    };

    return (
        <div className="space-y-4">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <HiOutlinePhotograph className="text-lg text-indigo-500" />
                {label}
            </label>

            <div className="relative group">
                {preview ? (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-zinc-800 group-hover:border-indigo-500/50 transition-all">
                        <Image
                            src={preview}
                            alt="Service preview"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute top-4 right-4 p-2 bg-red-500/80 backdrop-blur-md text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95"
                        >
                            <HiOutlineX className="text-xl" />
                        </button>
                    </div>
                ) : (
                    <label className={`flex flex-col items-center justify-center w-full aspect-video rounded-[2rem] border-2 border-dashed transition-all cursor-pointer ${uploading
                        ? "bg-zinc-900 border-indigo-500/30"
                        : "bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 shadow-inner"
                        }`}>
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                <span className="text-sm font-bold text-indigo-400">جاري الرفع...</span>
                            </div>
                        ) : (
                            <>
                                <div className="p-5 rounded-full bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500 mb-4 shadow-2xl">
                                    <HiOutlineCloudUpload className="text-4xl" />
                                </div>
                                <span className="text-sm font-black text-zinc-300">اختر صورة من جهازك</span>
                                <span className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-tighter">PNG, JPG حتى 5 ميجابايت</span>
                            </>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                )}
            </div>
            <p className="text-[10px] text-zinc-600 font-black italic text-right">* سيتم ضغط وتحسين الصورة تلقائياً لسرعة موقعك</p>
        </div>
    );
};

export default ImageUpload;
