"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import Button from "../ui/Button";
import { HiOutlineClock } from "react-icons/hi";

interface SectionProps {
    section: any;
    business: any;
    isEditing?: boolean;
    onBook?: (service: any) => void;
    isLight?: boolean;
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

const HeroWidget = ({ section, business, isLight }: SectionProps) => {
    const router = useRouter()
    const path = usePathname()
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const overlayOpacity = settings.overlayOpacity ?? 0.4;
    const textAlign = settings.textAlign ?? "center";
    const bgImage = section.images?.[0] || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80';

    const borderRadius = getRadiusClass(settings.borderRadius);
    const objectFit = settings.objectFit || "cover";
    const themeColor = business?.themeColor || "indigo";

    return (
        <div className={`relative min-h-[90vh] flex items-center overflow-hidden ${borderRadius}`}>
            <div className="absolute inset-0 z-0">
                <Image
                    src={bgImage}
                    alt=""
                    fill
                    className={`object-${objectFit}`}
                    priority
                />
            </div>
            {/* Hero content starts here */}
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
                    className={`text-xl md:text-2xl text-zinc-100 mb-10 ${textAlign === 'center' ? 'max-w-3xl mx-auto' : ''} prose prose-invert prose-lg whitespace-pre-wrap`}
                    dangerouslySetInnerHTML={{ __html: section.content || "" }}
                />

                {settings.showButton && (
                    <button onClick={() => {
                        if (settings.buttonLink) router.push(settings.buttonLink)
                    }} className={`px-10 py-4 bg-${themeColor}-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl`}>
                        {settings.buttonText || "Get Started"}
                    </button>
                )}
            </div>
        </div>
    );
};

const GalleryWidget = ({ section, isLight }: SectionProps) => {
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const borderRadius = getRadiusClass(settings.borderRadius);
    const objectFit = settings.objectFit || "cover";
    const columns = settings.columns || 4;

    const gridColsClass = {
        2: "grid-cols-2",
        3: "grid-cols-2 md:grid-cols-3",
        4: "grid-cols-2 md:grid-cols-4"
    }[columns as 2 | 3 | 4] || "grid-cols-2 md:grid-cols-4";

    return (
        <div className="max-w-6xl mx-auto py-20 px-6">
            {section.title && <h2 className={`text-4xl font-black mb-12 text-center ${isLight ? "text-stone-900" : "text-white"}`}>{section.title}</h2>}
            <div className={`grid ${gridColsClass} gap-6`}>
                {(section.images && section.images.length > 0 ? section.images : [null, null, null, null]).map((img: string | null, i: number) => (
                    <div key={i} className={`aspect-square relative overflow-hidden group shadow-lg ${isLight ? "bg-stone-100" : "bg-zinc-900"} ${borderRadius}`}>
                        {img ? (
                            <Image src={img} alt="" fill className={`object-${objectFit} transition-transform group-hover:scale-110`} />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isLight ? "text-stone-300" : "text-zinc-800"} font-bold text-xs uppercase`}>No Image</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const AboutWidget = ({ section, isLight }: SectionProps) => {
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const borderRadius = getRadiusClass(settings.borderRadius);
    const hasImage = section.images && section.images.length > 0 && section.images[0];
    const imageSide = settings.imageSide || "right";

    return (
        <div className="max-w-6xl mx-auto py-24 px-6">
            <div className={`grid grid-cols-1 ${hasImage ? "md:grid-cols-2 gap-16" : "text-center max-w-3xl mx-auto"} items-center`}>
                <div className={hasImage && imageSide === "left" ? "md:order-2" : ""}>
                    <p className={`text-indigo-600 font-black text-xs tracking-widest uppercase mb-4`}>Our Story</p>
                    <h2 className={`text-4xl md:text-5xl font-black mb-8 ${isLight ? "text-stone-900" : "text-white"} leading-tight`}>{section.title || "About Our Business"}</h2>
                    <div
                        className={`prose ${isLight ? "prose-stone" : "prose-invert"} prose-lg max-w-none ${isLight ? "text-stone-600" : "text-zinc-400"} whitespace-pre-wrap mb-8`}
                        dangerouslySetInnerHTML={{ __html: section.content || "" }}
                    />
                </div>
                {hasImage && (
                    <div className={`relative aspect-4/5 overflow-hidden shadow-2xl ${borderRadius} ${imageSide === "left" ? "md:order-1" : ""}`}>
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

const ContactWidget = ({ section, business, isLight }: SectionProps) => {
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const themeColor = business?.themeColor || "indigo";

    return (
        <div className="max-w-6xl mx-auto py-24 px-6">
            <div className={`${isLight ? "bg-white border-stone-200" : "bg-zinc-900 border-zinc-800"} border rounded-[2.5rem] overflow-hidden p-12 md:p-20 shadow-2xl`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div>
                        <h2 className={`text-4xl font-black mb-4 ${isLight ? "text-stone-900" : "text-white"}`}>{section.title || "Get In Touch"}</h2>
                        <div
                            className={`${isLight ? "text-stone-500" : "text-zinc-500"} mb-12 text-lg`}
                            dangerouslySetInnerHTML={{ __html: section.content || "We would love to hear from you." }}
                        />

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-${themeColor}-600/10 rounded-2xl flex items-center justify-center text-${themeColor}-600`}>
                                    <HiOutlinePhone className="text-xl" />
                                </div>
                                <div>
                                    <p className={`text-[10px] ${isLight ? "text-stone-400" : "text-zinc-600"} font-black uppercase tracking-widest`}>Call Us</p>
                                    <p className={`${isLight ? "text-stone-900" : "text-white"} font-bold`}>{business.phone || "No phone provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <HiOutlineMapPin className="text-xl" />
                                </div>
                                <div>
                                    <p className={`text-[10px] ${isLight ? "text-stone-400" : "text-zinc-600"} font-black uppercase tracking-widest`}>Visit Us</p>
                                    <p className={`${isLight ? "text-stone-900" : "text-white"} font-bold`}>{business.address || "No address provided"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={`p-6 ${isLight ? "bg-stone-50 border-stone-100" : "bg-zinc-950 border-zinc-800"} border rounded-2xl`}>
                                <p className={`text-[10px] ${isLight ? "text-stone-400" : "text-zinc-600"} font-black uppercase tracking-widest mb-1`}>Email</p>
                                <p className={`${isLight ? "text-stone-900" : "text-white"} text-xs truncate font-bold`}>{business.email || business.owner?.email}</p>
                            </div>
                            <div className={`p-6 ${isLight ? "bg-stone-50 border-stone-100" : "bg-zinc-950 border-zinc-800"} border rounded-2xl`}>
                                <p className={`text-[10px] ${isLight ? "text-stone-400" : "text-zinc-600"} font-black uppercase tracking-widest mb-1`}>Status</p>
                                <p className="text-emerald-600 text-xs font-bold uppercase tracking-tighter">Open Now</p>
                            </div>
                        </div>
                        {settings.showMap !== false && (
                            <div className={`p-8 ${isLight ? "bg-stone-50 border-stone-100" : "bg-zinc-950 border-zinc-800"} border rounded-3xl min-h-[200px] flex items-center justify-center italic ${isLight ? "text-stone-400" : "text-zinc-600"} text-sm`}>
                                Map Widget Placeholder
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesWidget = ({ section, business, onBook, isLight }: SectionProps) => {
    const services = business.services || [];
    const themeColor = business?.themeColor || "indigo";

    return (
        <div id="services-section" className="max-w-6xl mx-auto py-24 px-6">
            <div className="text-center mb-16">
                <h2 className={`text-4xl font-black mb-4 ${isLight ? "text-stone-900" : "text-white"}`}>{section.title || "Our Services"}</h2>
                <div
                    className={`${isLight ? "text-stone-500" : "text-zinc-500"} text-lg max-w-2xl mx-auto`}
                    dangerouslySetInnerHTML={{ __html: section.content || "Explore our range of professional services." }}
                />
            </div>

            {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service: any) => (
                        <div key={service.id} className={`${isLight ? "bg-white border-stone-200" : "bg-zinc-900/50 border-zinc-800"} border rounded-[2rem] overflow-hidden group hover:border-${themeColor}-600/50 transition-all flex flex-col shadow-sm`}>
                            {service.image && (
                                <div className="h-48 w-full relative overflow-hidden">
                                    <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className={`text-xl font-bold mb-2 ${isLight ? "text-stone-900" : "text-white"}`}>{service.name}</h3>
                                <p className={`${isLight ? "text-stone-500" : "text-zinc-500"} text-sm line-clamp-3 mb-8`}>{service.description}</p>
                                
                                <div className="mt-auto space-y-6">
                                    <div className={`flex items-center justify-between border-t ${isLight ? "border-stone-100" : "border-zinc-800/50"} pt-6`}>
                                        <div className={`text-${themeColor}-600 font-black text-2xl`}>${service.price.toString()}</div>
                                        <div className={`${isLight ? "text-stone-400" : "text-zinc-500"} text-xs font-bold uppercase tracking-widest flex items-center gap-1`}>
                                            <HiOutlineClock className="text-lg opacity-50" /> {service.duration} min
                                        </div>
                                    </div>
                                    
                                    <Button
                                        theme={business.themeColor}
                                        onClick={() => onBook?.(service)}
                                        className={`w-full py-3 bg-${themeColor}-600 text-white rounded-xl shadow-lg font-black text-xs tracking-widest hover:scale-[1.02] transition-all`}
                                    >
                                        BOOK APPOINTMENT
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`text-center py-20 ${isLight ? "bg-stone-100/50 border-stone-200" : "bg-zinc-900/30 border-zinc-800"} rounded-[2rem] border border-dashed`}>
                    <p className={`${isLight ? "text-stone-400" : "text-zinc-600"} font-bold italic`}>No services available yet.</p>
                </div>
            )}
        </div>
    );
};

const TestimonialsWidget = ({ section, business, isLight }: SectionProps) => {
    const settings = typeof section.settings === 'string' ? JSON.parse(section.settings || '{}') : (section.settings || {});
    const testimonials = settings.testimonials || [];
    const themeColor = business?.themeColor || "indigo";

    return (
        <div className="max-w-6xl mx-auto py-24 px-6">
            <div className="text-center mb-16">
                <h2 className={`text-4xl font-black mb-4 ${isLight ? "text-stone-900" : "text-white"}`}>{section.title || "Client Feedback"}</h2>
                <div
                    className={`${isLight ? "text-stone-500" : "text-zinc-500"} text-lg max-w-2xl mx-auto`}
                    dangerouslySetInnerHTML={{ __html: section.content || "Hear what our amazing clients have to say about us." }}
                />
            </div>

            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t: any, i: number) => (
                        <div key={i} className={`${isLight ? "bg-white border-stone-100" : "bg-zinc-900/40 border-zinc-800/50"} border p-8 rounded-[2.5rem] relative shadow-sm`}>
                            <div className={`absolute -top-4 -left-4 w-12 h-12 bg-${themeColor}-600/20 rounded-2xl flex items-center justify-center text-${themeColor}-600 text-3xl font-serif`}>
                                &ldquo;
                            </div>
                            <p className={`${isLight ? "text-stone-600" : "text-zinc-300"} italic mb-8 relative z-10 leading-relaxed`}>&quot;{t.quote}&quot;</p>
                            <div className="flex items-center gap-4">
                                {t.avatar ? (
                                    <div className="w-12 h-12 rounded-full overflow-hidden relative border border-zinc-800">
                                        <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className={`w-12 h-12 rounded-full bg-${themeColor}-600/10 flex items-center justify-center text-${themeColor}-600 font-black`}>
                                        {t.author?.[0] || "?"}
                                    </div>
                                )}
                                <div>
                                    <p className={`${isLight ? "text-stone-900" : "text-white"} font-bold text-sm`}>{t.author}</p>
                                    <p className={`${isLight ? "text-stone-400" : "text-zinc-600"} text-[10px] font-black uppercase tracking-widest`}>{t.role || "Client"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`text-center py-20 ${isLight ? "bg-stone-100/50 border-stone-200" : "bg-zinc-900/30 border-zinc-800"} rounded-[2rem] border border-dashed`}>
                    <p className={`${isLight ? "text-stone-400" : "text-zinc-600"} font-bold italic`}>No testimonials added yet.</p>
                </div>
            )}
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
        case "SERVICES":
            return <ServicesWidget {...props} />;
        case "TESTIMONIALS":
            return <TestimonialsWidget {...props} />;
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
