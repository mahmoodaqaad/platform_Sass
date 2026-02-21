import React, { useState } from "react";
import { HiOutlineCloudUpload, HiOutlineX } from "react-icons/hi";
import Image from "next/image";
import axios from "axios";

interface LogoUploadProps {
    value: string;
    onChange: (value: string) => void;
    onUploading?: (uploading: boolean) => void;
}

const LogoUpload = ({ value, onChange, onUploading }: LogoUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        onUploading?.(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("/api/upload", formData);
            const { url } = res.data;
            setPreview(url);
            onChange(url);
        } catch (error) {
            console.error("Logo upload failed:", error);
            alert("فشل في رفع الشعار. يرجى المحاولة مرة أخرى.");
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
            <label className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                <HiOutlineCloudUpload className="text-lg" />
                شعار العمل (Logo)
            </label>

            <div className="relative group">
                {preview ? (
                    <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-zinc-800 group-hover:border-indigo-500/50 transition-all">
                        <Image
                            src={preview}
                            alt="Logo preview"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <HiOutlineX />
                        </button>
                    </div>
                ) : (
                    <label className={`flex flex-col items-center justify-center w-32 h-32 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${uploading ? "bg-zinc-900 border-indigo-500/30" : "border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/5"
                        }`}>
                        {uploading ? (
                            <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        ) : (
                            <>
                                <HiOutlineCloudUpload className="text-3xl text-zinc-600" />
                                <span className="text-[10px] font-bold text-zinc-500 mt-2">رفع شعار</span>
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
            <p className="text-[10px] text-zinc-600 font-medium italic">* يفضل استخدام صور مربعة (PNG/JPG)</p>
        </div>
    );
};

export default LogoUpload;
