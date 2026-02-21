import React from "react";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
    return (
        <main className="pt-20 bg-[#050505] text-white min-h-screen">
            <div className="bg-zinc-950 pt-20 pb-10 border-b border-zinc-900">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Our Features</h1>
                    <p className="text-zinc-500 text-lg max-w-2xl">
                        Deep dive into the specialized tools and infrastructure that power the MyPlatform ecosystem.
                    </p>
                </div>
            </div>
            <Features />
            <Footer />
        </main>
    );
}
