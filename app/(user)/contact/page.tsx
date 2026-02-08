import React from "react";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ContactPage() {
    return (
        <main className="pt-20 bg-[#050505] text-white min-h-screen">
            <div className="bg-zinc-950 pt-20 pb-10 border-b border-zinc-900">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Contact Us</h1>
                    <p className="text-zinc-500 text-lg max-w-2xl">
                        Have questions? We&apos;re here to help you build the future of your business.
                    </p>
                </div>
            </div>
            <Contact />
            <Footer />
        </main>
    );
}
