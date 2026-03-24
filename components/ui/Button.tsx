"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    isLoading?: boolean;
    theme: string
}

const Button = ({ children, variant = "primary", isLoading, className = "", theme = "indigo", ...props }: ButtonProps) => {
    const baseStyles = "px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: `bg-${theme}-600 hover:bg-${theme}-500 text-white shadow-lg shadow-${theme}-600/20`,
        secondary: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20",
        outline: "bg-transparent border border-zinc-800 hover:border-zinc-700 text-white",
        ghost: "bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white",

    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : children}
        </button>
    );
};

export default Button;
