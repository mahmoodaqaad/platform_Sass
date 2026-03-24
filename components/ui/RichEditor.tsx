"use client";

import React, { useState } from "react";
import { HiOutlineEye, HiOutlinePencil, HiOutlineLink, HiOutlineListBullet } from "react-icons/hi2";

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, label, placeholder }) => {
    const [mode, setMode] = useState<"write" | "preview">("write");

    const insertText = (before: string, after: string = "") => {
        const textarea = document.getElementById("rich-editor-textarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        const beforeText = text.substring(0, start);
        const afterText = text.substring(end);

        const newValue = beforeText + before + selectedText + after + afterText;
        onChange(newValue);

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            if (start === end) {
                // If no selection, place cursor between the tags
                textarea.setSelectionRange(start + before.length, start + before.length);
            } else {
                // If selection, wrap it and place cursor after the ending tag
                textarea.setSelectionRange(start + before.length + selectedText.length + after.length, start + before.length + selectedText.length + after.length);
            }
        }, 0);
    };

    const renderPreview = (text: string) => {
        if (!text) return <p className="text-zinc-600 italic">Nothing to preview...</p>;

        // Simple markdown-ish parser for preview
        return text.split("\n").map((line, i) => {
            let content = line;

            // Bold
            content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            // Italic
            content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
            // Links
            content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-500 underline" target="_blank">$1</a>');

            if (line.startsWith("# ")) {
                return <h1 key={i} className="text-2xl font-black mb-4" dangerouslySetInnerHTML={{ __html: content.replace("# ", "") }} />;
            }
            if (line.startsWith("## ")) {
                return <h2 key={i} className="text-xl font-bold mb-3" dangerouslySetInnerHTML={{ __html: content.replace("## ", "") }} />;
            }
            if (line.startsWith("- ")) {
                return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: content.replace("- ", "") }} />;
            }

            return <p key={i} className="mb-2 min-h-[1em]" dangerouslySetInnerHTML={{ __html: content || "&nbsp;" }} />;
        });
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</label>}

            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 transition-all focus-within:border-indigo-500/50 shadow-2xl">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setMode("write")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === "write" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                            <HiOutlinePencil className="text-sm" /> Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("preview")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === "preview" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                            <HiOutlineEye className="text-sm" /> Preview
                        </button>
                    </div>

                    {mode === "write" && (
                        <div className="flex items-center gap-1 border-l border-zinc-800 ml-2 pl-2">
                            <button type="button" onClick={() => insertText("**", "**")} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-bold" title="Bold">
                                B
                            </button>
                            <button type="button" onClick={() => insertText("*", "*")} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors italic" title="Italic">
                                I
                            </button>
                            <button type="button" onClick={() => insertText("- ")} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="List">
                                <HiOutlineListBullet className="text-base" />
                            </button>
                            <button type="button" onClick={() => insertText("[", "](url)")} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Link">
                                <HiOutlineLink className="text-base" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="relative min-h-[220px]">
                    {mode === "write" ? (
                        <textarea
                            id="rich-editor-textarea"
                            className="w-full h-full min-h-[220px] p-4 bg-transparent text-zinc-300 focus:text-white focus:outline-none resize-y font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                        />
                    ) : (
                        <div className="p-6 text-zinc-300 prose prose-invert max-w-none h-full min-h-[220px] overflow-y-auto bg-zinc-950/50 backdrop-inner">
                            {renderPreview(value)}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-600 font-medium px-2 uppercase tracking-tighter">
                <span className="flex items-center gap-1"><span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Markdown Enabled</span>
                <span>{value.length} characters</span>
            </div>
        </div>
    );
};

export default RichEditor;
