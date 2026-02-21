"use client";
import React from "react";
import BusinessGuard from "@/components/owner/BusinessGuard";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    return (
        <BusinessGuard>
            {children}
        </BusinessGuard>
    );
}
