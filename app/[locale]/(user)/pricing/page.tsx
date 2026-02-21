import React from "react";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function PricingPage() {
    return (
        <main className="pt-20 bg-[#050505] text-white min-h-screen">
            <div className="bg-zinc-950 pt-20 pb-10 border-b border-zinc-900">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Pricing Plans</h1>
                    <p className="text-zinc-500 text-lg max-w-2xl">
                        Transparent, flexible pricing designed to scale with your business goals.
                    </p>
                </div>
            </div>
            <Pricing />
            <Footer />
        </main>
    );
}
