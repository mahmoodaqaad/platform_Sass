"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    error?: string;
}

const Input = ({ label, icon, error, children, ...props }: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setHasValue(!!e.target.value);
        props.onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    return (
        <div className="w-full">
            <div className="relative group">
                {/* Border Glow Effect */}
                <div
                    className={`absolute -inset-px rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 opacity-0 group-focus-within:opacity-100 transition-opacity blur-[2px]`}
                />

                <div className={`relative flex items-center bg-zinc-900 border ${error ? 'border-red-500/50' : 'border-zinc-800'} rounded-2xl transition-all h-[64px]`}>
                    {icon && (
                        <div className={`pl-5 text-xl transition-colors ${isFocused ? 'text-indigo-400' : 'text-zinc-500'}`}>
                            {icon}
                        </div>
                    )}

                    <div className="relative flex-1 h-full">
                        <input
                            {...props}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onChange={(e) => {
                                setHasValue(!!e.target.value);
                                props.onChange?.(e);
                            }}
                            className={`w-full h-full bg-transparent px-5 pt-5 pb-1 text-white outline-none placeholder-transparent`}
                            placeholder={label}
                        />

                        {/* Floating Label */}
                        <label
                            className={`absolute left-5 pointer-events-none transition-all duration-200 
                ${(isFocused || hasValue)
                                    ? "top-2 text-xs font-bold text-indigo-400 uppercase tracking-widest"
                                    : "top-1/2 -translate-y-1/2 text-base text-zinc-500"}`}
                        >
                            {label}
                        </label>
                    </div>

                    {children}
                </div>
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 ml-4 text-xs font-medium text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
