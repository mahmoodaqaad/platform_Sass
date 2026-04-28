"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import Button from "../ui/Button";

interface SectionProps {
    section: any;
    
    business: any;
    isEditing?: boolean;
}

const getRadiusClass = (radius?: string) => {
    switch (radius) {
        case "none": return "rounded-none";
        case "md": return "rounded-xl";
        case "xl": return "rounded-2xl";
        case "2xl": return "rounded-[2rem]";
        case "full": return "rounded-full";
        default: return "rounded-none";
    }
};

const HeroWidget = ({ section, business }: SectionProps) => {
    const router = useRouter()
    const path = usePathname()
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const overlayOpacity = settings.overlayOpacity ?? 0.4;
    const textAlign = settings.textAlign ?? "center";
    const bgImage = section.images?.[0] || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80';
    const devlop = path.includes("owner/website")

    const borderRadius = getRadiusClass(settings.borderRadius);
    const objectFit = settings.objectFit || "cover";

    return (
        <div className={`relative min-h-screen flex items-center overflow-hidden ${borderRadius}`}>
            <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage}
                    alt=""
                    fill
                    className={`object-${objectFit}`}
                    priority
                />
            </div>
            {
                !devlop &&

                <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/60 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">

                            <div className={`w-10 h-10 rounded-full  bg-${business?.themeColor}-500 flex items-center justify-center text-white font-bold`}>
                                {business?.name[0]}
                            </div>

                            <span className="font-bold text-xl tracking-tight">{business?.name}</span>
                        </div>
                        <nav className="hidden md:flex gap-8 text-sm font-medium text-stone-500">
                            {/* <a href="#services" className="hover:text-stone-900 transition-colors">Services</a> */}

                            {business.sections.filter(s => s.isActive && s.type !== 'HERO').map(s => (
                                <a key={s.id} href={`#section-${s.id}`} className="hover:text-stone-900 transition-colors">
                                    {s.title || 'Section'}
                                </a>
                            ))}
                        </nav>
                        <Button className={`px-6 py-2  bg-${business?.themeColor}-500 text-white rounded-md shadow-sm text-sm`}>
                            Book Now
                        </Button>
                    </div>
                </header>}
            <div
                className="absolute inset-0 z-10"
                style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
            />

            <div className={`relative z-20 w-full px-6 max-w-6xl mx-auto text-${textAlign}`}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black mb-6 text-white"
                >
                    {section.title || business.name}
                </motion.h1>
                <div
                    className={`text-xl md:text-2xl text-zinc-200 mb-10 ${textAlign === 'center' ? 'max-w-3xl mx-auto' : ''} prose prose-invert prose-lg whitespace-pre-wrap`}
                    dangerouslySetInnerHTML={{ __html: section.content || "" }}
                />

                {settings.showButton && (
                    <button onClick={() => {
                        if (settings.buttonLink) router.push(settings.buttonLink)
                    }} className={`px-10 py-4 bg-${business?.themeColor}-500 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl`}>
                        {settings.buttonText || "Get Started"}
                    </button>
                )}
            </div>
        </div>
    );
};

const GalleryWidget = ({ section }: SectionProps) => {
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const borderRadius = getRadiusClass(settings.borderRadius);
    const objectFit = settings.objectFit || "cover";

    return (
        <div className="max-w-6xl mx-auto py-20 px-6">
            {section.title && <h2 className="text-4xl font-black mb-12 text-center text-white">{section.title}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(section.images && section.images.length > 0 ? section.images : [null, null, null, null]).map((img: string | null, i: number) => (
                    <div key={i} className={`aspect-square relative overflow-hidden group shadow-lg bg-zinc-900 ${borderRadius}`}>
                        {img ? (
                            <Image src={img} alt="" fill className={`object-${objectFit} transition-transform group-hover:scale-110`} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-bold text-xs uppercase">No Image</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const AboutWidget = ({ section }: SectionProps) => {
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const borderRadius = getRadiusClass(settings.borderRadius);
    const hasImage = section.images && section.images.length > 0 && section.images[0];

    return (
        <div className="max-w-6xl mx-auto py-24 px-6">
            <div className={`grid grid-cols-1 ${hasImage ? "md:grid-cols-2 gap-16" : "text-center max-w-3xl mx-auto"} items-center`}>
                <div className={hasImage ? "order-1" : ""}>
                    <p className="text-indigo-500 font-black text-xs tracking-widest uppercase mb-4">Our Story</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 text-white leading-tight">{section.title || "About Our Business"}</h2>
                    <div
                        className="prose prose-invert prose-lg max-w-none text-zinc-400 whitespace-pre-wrap mb-8"
                        dangerouslySetInnerHTML={{ __html: section.content || "" }}
                    />
                </div>
                {hasImage && (
                    <div className={`relative aspect-4/5 overflow-hidden shadow-2xl ${borderRadius}`}>
                        <Image
                            src={section.images[0]}
                            alt={section.title || ""}
                            fill
                            className={`object-${settings.objectFit || "cover"} hover:scale-105 transition-transform duration-700`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const ContactWidget = ({ section, business }: SectionProps) => {
    return (
        <div className="max-w-6xl mx-auto py-24 px-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden p-12 md:p-20 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div>
                        <h2 className="text-4xl font-black mb-4 text-white">{section.title || "Get In Touch"}</h2>
                        <div
                            className="text-zinc-500 mb-12 text-lg"
                            dangerouslySetInnerHTML={{ __html: section.content || "We would love to hear from you." }}
                        />

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                                    <HiOutlinePhone className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Call Us</p>
                                    <p className="text-white font-bold">{business.phone || "No phone provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                    <HiOutlineMapPin className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Visit Us</p>
                                    <p className="text-white font-bold">{business.address || "No address provided"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Email</p>
                                <p className="text-white text-xs truncate font-bold">{business.email || business.owner?.email}</p>
                            </div>
                            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Status</p>
                                <p className="text-emerald-500 text-xs font-bold uppercase tracking-tighter">Open Now</p>
                            </div>
                        </div>
                        <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl min-h-[150px] flex items-center justify-center italic text-zinc-600 text-sm">
                            Map Widget Placeholder
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionRenderer: React.FC<SectionProps> = (props) => {
    const { section } = props;

    // Use isEditing to show hidden sections in the builder
    if (!section.isActive && !props.isEditing) return null;

    switch (section.type) {
        case "HERO":
            return <HeroWidget {...props} />;
        case "GALLERY":
            return <GalleryWidget {...props} />;
        case "ABOUT":
            return <AboutWidget {...props} />;
        case "CONTACT":
            return <ContactWidget {...props} />;
        default:
            return (
                <div className="max-w-6xl mx-auto py-20 px-6 text-center">
                    <h2 className="text-3xl font-black mb-6 text-white">{section.title || section.type}</h2>
                    <div
                        className="text-zinc-500 max-w-2xl mx-auto whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: section.content || "" }}
                    />
                </div>
            );
    }
};

export default SectionRenderer;
