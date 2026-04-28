"use client";

import React from "react";
import Input from "@/components/ui/Input";
import RichEditor from "@/components/ui/RichEditor";
import { HiOutlineChevronLeft, HiOutlinePhoto, HiOutlineTrash } from "react-icons/hi2";

interface SettingPanelProps {
    section: {
        id?: string;
        type: string;
        title: string;
        content: string;
        images?: string[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settings?: any;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (data: any) => void;
    onBack: () => void;
    onDelete: () => void;
    children?: React.ReactNode;
}

const SettingPanel: React.FC<SettingPanelProps> = ({ section, onUpdate, onBack, onDelete, children }) => {
    const settings = typeof section.settings === 'string' 
        ? (JSON.parse(section.settings || '{}')) 
        : (section.settings || {});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateSettings = (key: string, value: any) => {
        onUpdate({
            ...section,
            settings: { ...settings, [key]: value }
        });
    };

    const renderImageSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <HiOutlinePhoto /> Section Images
                </label>
                <div className="space-y-3">
                    {section.images?.map((img: string, index: number) => (
                        <div key={index} className="flex gap-2">
                            <input
                                value={img}
                                onChange={(e) => {
                                    const newImages = [...(section.images || [])];
                                    newImages[index] = e.target.value;
                                    onUpdate({ ...section, images: newImages });
                                }}
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Image URL..."
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newImages = (section.images || []).filter((_: unknown, i: number) => i !== index);
                                    onUpdate({ ...section, images: newImages });
                                }}
                                className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20"
                            >
                                <HiOutlineTrash className="text-sm" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => onUpdate({ ...section, images: [...(section.images || []), ""] })}
                        className="w-full py-2 border border-dashed border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 hover:text-white transition-all"
                    >
                        + ADD IMAGE URL
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-zinc-500 mb-1 block">Corner Radius</label>
                    <select
                        value={settings.borderRadius || "none"}
                        onChange={(e) => updateSettings("borderRadius", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-xs text-white"
                    >
                        <option value="none">None</option>
                        <option value="md">Medium</option>
                        <option value="xl">Large</option>
                        <option value="2xl">2XL</option>
                        <option value="full">Full</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] text-zinc-500 mb-1 block">Image Fit</label>
                    <select
                        value={settings.objectFit || "cover"}
                        onChange={(e) => updateSettings("objectFit", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-xs text-white"
                    >
                        <option value="cover">Cover</option>
                        <option value="contain">Contain</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderHeroSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Text Alignment</label>
                <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                    {["left", "center", "right"].map(align => (
                        <button
                            key={align}
                            onClick={() => updateSettings("textAlign", align)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.textAlign === align ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                        >
                            {align.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Overlay Opacity</label>
                <input
                    type="range"
                    min="0" max="1" step="0.1"
                    value={settings.overlayOpacity ?? 0.4}
                    onChange={(e) => updateSettings("overlayOpacity", parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 mt-2">
                    <span>Clear</span>
                    <span>Dark</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showButton"
                    checked={settings.showButton || false}
                    onChange={(e) => updateSettings("showButton", e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 rounded border-zinc-800 bg-zinc-900 focus:ring-0"
                />
                <label htmlFor="showButton" className="text-sm text-zinc-300">Show Call-to-Action Button</label>
            </div>

            {settings.showButton && (
                <>
                    <Input
                        label="Button Text"
                        value={settings.buttonText || ""}
                        onChange={(e) => updateSettings("buttonText", e.target.value)}
                        placeholder="e.g. Book Now"
                    />
                    <Input
                        label="Button Link"
                        value={settings.buttonLink || ""}
                        onChange={(e) => updateSettings("buttonLink", e.target.value)}
                        placeholder="example.com"
                    />
                </>
            )}
        </div>
    );

    const renderAboutSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Image Side</label>
                <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                    {["left", "right"].map(side => (
                        <button
                            key={side}
                            onClick={() => updateSettings("imageSide", side)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.imageSide === side ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                        >
                            {side.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderTestimonialsSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 block">Manage Testimonials</label>
                <div className="space-y-4">
                    {(settings.testimonials || []).map((t: any, index: number) => (
                        <div key={index} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 relative group">
                            <button
                                onClick={() => {
                                    const newT = (settings.testimonials || []).filter((_: any, i: number) => i !== index);
                                    updateSettings("testimonials", newT);
                                }}
                                className="absolute top-2 right-2 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <HiOutlineTrash />
                            </button>
                            <textarea
                                value={t.quote}
                                onChange={(e) => {
                                    const newT = [...(settings.testimonials || [])];
                                    newT[index] = { ...t, quote: e.target.value };
                                    updateSettings("testimonials", newT);
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                                placeholder="The client's quote..."
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    value={t.author}
                                    onChange={(e) => {
                                        const newT = [...(settings.testimonials || [])];
                                        newT[index] = { ...t, author: e.target.value };
                                        updateSettings("testimonials", newT);
                                    }}
                                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Author Name"
                                />
                                <input
                                    value={t.role}
                                    onChange={(e) => {
                                        const newT = [...(settings.testimonials || [])];
                                        newT[index] = { ...t, role: e.target.value };
                                        updateSettings("testimonials", newT);
                                    }}
                                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Role (e.g. CEO)"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const newT = [...(settings.testimonials || []), { quote: "", author: "", role: "" }];
                            updateSettings("testimonials", newT);
                        }}
                        className="w-full py-3 border border-dashed border-zinc-800 rounded-2xl text-xs font-bold text-zinc-500 hover:text-white transition-all"
                    >
                        + ADD TESTIMONIAL
                    </button>
                </div>
            </div>
        </div>
    );

    const renderGallerySettings = () => (
        <div className="space-y-6">
            <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Grid Columns</label>
                <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                    {[2, 3, 4].map(cols => (
                        <button
                            key={cols}
                            onClick={() => updateSettings("columns", cols)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.columns === cols ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                        >
                            {cols} COL
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContactSettings = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showMap"
                    checked={settings.showMap !== false}
                    onChange={(e) => updateSettings("showMap", e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 rounded border-zinc-800 bg-zinc-900"
                />
                <label htmlFor="showMap" className="text-sm text-zinc-300">Show Map Widget</label>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-zinc-950 border-r border-zinc-800 w-80 shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all">
                    <HiOutlineChevronLeft />
                </button>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Edit {section.type}</h3>
                <div className="w-8" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                <div className="space-y-4">
                    <Input
                        label="Section Title"
                        value={section.title || ""}
                        onChange={(e) => onUpdate({ ...section, title: e.target.value })}
                    />
                    <RichEditor
                        label="Section Content"
                        value={section.content || ""}
                        onChange={(val) => onUpdate({ ...section, content: val })}
                    />
                </div>

                <div className="pt-6 border-t border-zinc-900 space-y-10">
                    <div>
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-6">General Settings</h4>
                        {renderImageSettings()}
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-6">Block Specific</h4>
                        {section.type === "HERO" && renderHeroSettings()}
                        {section.type === "ABOUT" && renderAboutSettings()}
                        {section.type === "TESTIMONIALS" && renderTestimonialsSettings()}
                        {section.type === "GALLERY" && renderGallerySettings()}
                        {section.type === "CONTACT" && renderContactSettings()}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={onDelete}
                        className="w-full py-4 rounded-2xl border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
                    >
                        <HiOutlineTrash /> DELETE SECTION
                    </button>
                </div>
            </div>

            {/* Fixed Footer for Actions */}
            {children && (
                <div className="shrink-0">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SettingPanel;
