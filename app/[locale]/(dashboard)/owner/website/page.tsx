"use client";

import React, { useState, useEffect } from "react";
import { HiPencil, HiOutlineVariable, HiOutlineDevicePhoneMobile, HiOutlineComputerDesktop, HiPlus, HiChevronUp, HiChevronDown } from "react-icons/hi2";
import Button from "@/components/ui/Button";
import SectionRenderer from "@/components/builder/SectionRenderer";
import SettingPanel from "@/components/builder/SettingPanel";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import DesktopOnlyGuard from "@/components/builder/DesktopOnlyGuard";

interface SectionSettings {
    [key: string]: string | number | boolean | string[] | undefined;
}

interface BusinessData {
    name: string;
    slug?: string;
    [key: string]: unknown; 
}

interface Section {
    id?: string;
    type: string;
    title: string;
    content: string;
    images?: string[];
    order: number;
    isActive: boolean;
    settings?: SectionSettings;
}

const TEMPLATES = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" }
];

const THEME_COLORS = [
    { id: "indigo", class: "bg-indigo-500" },
    { id: "emerald", class: "bg-emerald-500" },
    { id: "rose", class: "bg-rose-500" },
    { id: "purple", class: "bg-purple-500" },
    { id: "zinc", class: "bg-zinc-500" },
    { id: "orange", class: "bg-orange-500" }
];

const WebsiteBuilderPage = () => {
    const t = useTranslations("D.owner.websiteBuilder");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({ templateId: "modern", themeColor: "indigo" });
    const [sections, setSections] = useState<Section[]>([]);
    const [addSectionMenuOpen, setAddSectionMenuOpen] = useState<boolean>(false);
    const [editSection, setEditSection] = useState<Section | null>(null);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [businessData, setBusinessData] = useState<BusinessData | null>(null);

    useEffect(() => {
        const fetchWebsiteData = async () => {
            try {
                const confRes = await axios.get("/api/owner/website");
                setConfig({
                    templateId: confRes.data.templateId || "modern",
                    themeColor: confRes.data.themeColor || "indigo"
                });

                // Also fetch full business data for preview
                const bizRes = await axios.get("/api/owner/business");
                setBusinessData(bizRes.data);

                const secRes = await axios.get("/api/owner/website/sections");
                setSections(secRes.data);
            } catch (error) {
                console.error("Failed to load website configuration", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWebsiteData();
    }, []);

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            await axios.put("/api/owner/website", config);
            toast.success(t("success"));
        } catch (error) {
            console.error("Error saving config", error);
            toast.error(t("error"));
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateSection = (updated: Section) => {
        setSections(sections.map(s => s.id === updated.id ? updated : s));
        setEditSection(updated);
    };

    const handleSaveSectionLocally = async () => {
        if (!editSection) return;
        setSaving(true);
        try {
            const res = await axios.put(`/api/owner/website/sections/${editSection.id}`, editSection);
            setSections(sections.map(s => s.id === editSection.id ? res.data : s));
            setEditSection(res.data);
            toast.success("Section saved successfully");
        } catch (error) {
            console.error("Error saving section", error);
            toast.error("Failed to save section");
        } finally {
            setSaving(false);
        }
    };

    const handleAddSection = async (type: string) => {
        setSaving(true);
        try {
            const newSection = {
                type,
                title: `New ${type} Section`,
                content: "Click to edit this content...",
                order: sections.length,
                isActive: true,
                settings: {}
            };
            const res = await axios.post("/api/owner/website/sections", newSection);

            setSections([...sections, res.data]);
            setEditSection(res.data);
        } catch {
            toast.error("Failed to add section");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/owner/website/sections/${id}`);
            setSections(sections.filter(s => s.id !== id));
            setEditSection(null);
            toast.success(t("success"));
        } catch (error) {
            console.error("Error deleting section", error);
            toast.error(t("error"));
        }
    };

    const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const newSections = [...sections];

        // Swap elements
        const temp = newSections[index];
        newSections[index] = newSections[newIndex];
        newSections[index].order = index; // Update order values
        newSections[newIndex] = temp;
        newSections[newIndex].order = newIndex;

        setSections(newSections);

        try {
            // Save order for both swapped sections
            await Promise.all([
                axios.put(`/api/owner/website/sections/${newSections[index].id}`, { order: index }),
                axios.put(`/api/owner/website/sections/${newSections[newIndex].id}`, { order: newIndex })
            ]);
        } catch (error) {
            console.error("Error reordering sections", error);
            toast.error("Failed to save new order");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden font-sans">
            {/* Builder Header */}
            <div className="h-16 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
                <div className="flex items-center gap-3 md:gap-6">
                    <div>
                        <h1 className="text-sm md:text-lg font-black text-white">{t("title")}</h1>
                        <p className="hidden md:block text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Visual Studio v1.0</p>
                    </div>

                    <div className="hidden md:block h-8 w-px bg-zinc-900 mx-2" />

                    <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                        <button
                            type="button"
                            onClick={() => setPreviewMode("desktop")}
                            className={`p-2 rounded-lg transition-all ${previewMode === "desktop" ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                        >
                            <HiOutlineComputerDesktop />
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewMode("mobile")}
                            className={`p-2 rounded-lg transition-all ${previewMode === "mobile" ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                        >
                            <HiOutlineDevicePhoneMobile />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Live Sync</span>
                    </div>
                    <Button onClick={handleSaveConfig} isLoading={saving} className="h-10 px-4 md:px-6 text-xs md:text-sm">
                        {t("save")}
                    </Button>
                </div>
            </div>

            {/* Main Builder Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Desktop Required Guard for small screens */}
                <div className="flex lg:hidden absolute inset-0 z-50">
                    <DesktopOnlyGuard />
                </div>

                {/* Left Sidebar: Layers & Configuration */}
                <div className="hidden lg:flex w-80 flex-col bg-zinc-950 border-r border-zinc-800 relative z-30">
                    <div className="p-6 border-b border-zinc-900">
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Site Design</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-zinc-500 mb-2 block uppercase font-bold">Template</label>
                                <select
                                    value={config.templateId}
                                    onChange={(e) => setConfig({ ...config, templateId: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                                >
                                    {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 mb-2 block uppercase font-bold">Brand Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {THEME_COLORS.map(c => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setConfig({ ...config, themeColor: c.id })}
                                            className={`w-6 h-6 rounded-full ${c.class} ${config.themeColor === c.id ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110" : "opacity-40 hover:opacity-100"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                        <div>
                            <button
                                onClick={() => setAddSectionMenuOpen(!addSectionMenuOpen)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs tracking-widest shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mb-8"
                            >
                                <HiPlus className="text-lg" /> NEW SECTION
                            </button>

                            {addSectionMenuOpen && (
                                <div className="mb-8 p-4 bg-zinc-900 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-3">
                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center px-2">Pick Component</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { type: "HERO", label: "Hero" },
                                            { type: "GALLERY", label: "Gallery" },
                                            { type: "ABOUT", label: "About" },
                                            { type: "SERVICES", label: "Services" },
                                            { type: "TESTIMONIALS", label: "Quotes" },
                                            { type: "CONTACT", label: "Contact" }
                                        ].map(widget => (
                                            <button
                                                key={widget.type}
                                                onClick={() => {
                                                    handleAddSection(widget.type);
                                                    setAddSectionMenuOpen(false);
                                                }}
                                                className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-400 hover:text-white hover:border-indigo-500 transition-all text-center aspect-square flex flex-col items-center justify-center gap-2"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                    <HiOutlineVariable className="text-indigo-400" />
                                                </div>
                                                {widget.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4 flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Page Layers</h3>
                                <span className="text-[10px] font-bold text-zinc-700">{sections.length} BLOCKS</span>
                            </div>

                            <div className="space-y-2">
                                {sections.map((s, idx) => (
                                    <div key={s.id} className="relative group">
                                        <button
                                            type="button"
                                            onClick={() => setEditSection(s)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${editSection?.id === s.id ? "bg-indigo-600/10 border-indigo-500/50 shadow-inner" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${editSection?.id === s.id ? "bg-indigo-500 text-white" : "bg-zinc-900 text-zinc-600"} flex items-center justify-center text-[10px] font-black`}>
                                                    {s.type[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-[11px] font-black ${editSection?.id === s.id ? "text-white" : "text-zinc-300"}`}>{s.title || s.type}</span>
                                                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{s.type}</span>
                                                </div>
                                            </div>
                                            <HiPencil className={`text-xs ${editSection?.id === s.id ? "text-indigo-400" : "text-zinc-700 opacity-0 group-hover:opacity-100"}`} />
                                        </button>

                                        {/* Reorder Buttons */}
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'up'); }}
                                                disabled={idx === 0}
                                                className="p-1 hover:bg-zinc-800 disabled:opacity-20 text-white transition-colors"
                                            >
                                                <HiChevronUp className="text-[10px]" />
                                            </button>
                                            <div className="h-px bg-zinc-800" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'down'); }}
                                                disabled={idx === sections.length - 1}
                                                className="p-1 hover:bg-zinc-800 disabled:opacity-20 text-white transition-colors"
                                            >
                                                <HiChevronDown className="text-[10px]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Live Preview */}
                <div className="flex-1 bg-zinc-900/30 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
                    <div className={`transition-all duration-500 ease-in-out bg-zinc-950 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden rounded-2xl border border-white/5 ${previewMode === "desktop" ? "w-full max-w-5xl h-full" : "w-full max-w-[375px] aspect-9/16 sm:h-[667px]"}`}>
                        <div className="w-full h-full overflow-y-auto scrollbar-hide relative group">
                            {/* Browser Decoration */}
                            <div className="sticky top-0 left-0 right-0 h-10 bg-zinc-900/90 backdrop-blur-md border-b border-white/5 z-40 px-4 flex items-center justify-between pointer-events-none transition-opacity group-hover:opacity-100 opacity-60">
                                <div className="flex gap-1.5 pt-0.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                </div>
                                <div className="bg-zinc-800/50 px-4 py-1 rounded-full text-[9px] font-bold text-zinc-600 tracking-tighter">your-site.com</div>
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Preview Mode</span>
                            </div>

                            <div className="pt-0 min-h-full">
                                {sections.length === 0 ? (
                                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center py-40">
                                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl mb-6 flex items-center justify-center border border-zinc-800 shadow-inner">
                                            <HiOutlineVariable className="text-3xl text-zinc-700" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 italic">Your Canvas is Empty</h3>
                                        <p className="text-zinc-600 text-sm font-medium">Add a widget from the sidebar to begin.</p>
                                    </div>
                                ) : (
                                    sections?.map(section => (
                                        <div
                                            key={section.id}
                                            onClick={() => setEditSection(section)}
                                            className={`relative group/sec cursor-pointer transition-all border-y border-transparent ${editSection?.id === section.id ? "border-indigo-500/30 bg-indigo-500/5" : "hover:border-zinc-800 hover:bg-white/5"}`}
                                        >
                                            <SectionRenderer
                                                section={editSection?.id === section.id ? editSection : section}
                                                business={businessData || { name: "Loading..." }}
                                                isEditing
                                            />
                                            {editSection?.id === section.id && (
                                                <div className="absolute top-4 right-4 z-30 opacity-0 group-hover/sec:opacity-100 transition-opacity">
                                                    <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-2xl flex items-center gap-2 text-[10px] font-black">
                                                        <HiPencil /> EDITING BLOCK
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Settings Panel */}
                {editSection && (
                    <div className="hidden lg:flex">
                        <SettingPanel
                            section={editSection}
                            onUpdate={handleUpdateSection}
                            onBack={() => setEditSection(null)}
                            onDelete={() => editSection.id && handleDeleteSection(editSection.id)}
                        >
                            <div className="sticky bottom-0 inset-x-0 p-6 bg-zinc-950 border-t border-zinc-900 z-50">
                                <Button
                                    onClick={handleSaveSectionLocally}
                                    isLoading={saving}
                                    className="w-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-2xl font-black text-xs tracking-widest h-12 rounded-xl"
                                >
                                    APPLY BLOCK CHANGES
                                </Button>
                            </div>
                        </SettingPanel>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebsiteBuilderPage;
