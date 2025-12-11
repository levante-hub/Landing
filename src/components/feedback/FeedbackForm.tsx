"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, X } from "lucide-react";

export function FeedbackForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const formRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    author_display_name: name || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit feedback");
            }

            setContent("");
            setName("");
            setIsOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            {!isOpen ? (
                <div className="flex justify-center">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-800 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all active:scale-95"
                    >
                        <MessageSquarePlus className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                        <span className="text-sm font-medium">Share your feedback</span>
                    </button>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg relative"
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-semibold text-slate-900 mb-4 pr-8">Share your thoughts</h3>

                        <div className="space-y-4">
                            <div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    required
                                    rows={4}
                                    autoFocus
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all resize-none text-sm leading-relaxed"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name (optional)"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !content.trim()}
                                    className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[100px] flex justify-center items-center"
                                >
                                    {isSubmitting ? (
                                        <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        "Post"
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
