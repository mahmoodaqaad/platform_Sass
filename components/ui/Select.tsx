"use client";

import React, { useState } from "react"
import { motion } from "framer-motion"
import { HiChevronDown } from "react-icons/hi"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    icon?: React.ReactNode
    options: { value: string | number; label: string }[]
    error?: string
}

const Select = ({ label, icon, options, error, className = "", ...props }: SelectProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

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
                        <select
                            {...props}
                            onFocus={(e) => {
                                setIsFocused(true);
                                props.onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setIsFocused(false);
                                setHasValue(!!e.target.value);
                                props.onBlur?.(e);
                            }}
                            onChange={(e) => {
                                setHasValue(!!e.target.value);
                                props.onChange?.(e);
                            }}
                            className={`w-full h-full bg-transparent px-5 pt-5 pb-1 text-white outline-none appearance-none cursor-pointer font-medium ${className}`}
                        >
                            {!props.value && !props.defaultValue && <option value="" disabled hidden></option>}
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {/* Floating Label */}
                        <label
                            className={`absolute right-5 pointer-events-none transition-all duration-200 
                ${(isFocused || hasValue)
                                    ? "top-2 text-xs font-bold text-indigo-400 uppercase tracking-widest"
                                    : "top-1/2 -translate-y-1/2 text-base text-zinc-500"}`}
                        >
                            {label}
                        </label>

                        {/* Chevron Icon */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                            <HiChevronDown className="text-xl" />
                        </div>
                    </div>
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
    )
}

export default Select
