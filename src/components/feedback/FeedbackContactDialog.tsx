"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface FeedbackContactDialogProps {
    open: boolean;
    feedbackId: string | null;
    onClose: () => void;
}

export function FeedbackContactDialog({ open, feedbackId, onClose }: FeedbackContactDialogProps) {
    const [contact, setContact] = useState("");
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!open) return null;

    const handleSave = async () => {
        if (!feedbackId) {
            setError("No feedback id available");
            return;
        }
        if (!contact.trim() || !acceptedPrivacy) return;

        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch(`/api/feedback/${feedbackId}/contact`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contact: contact.trim(),
                    acceptedPrivacy: true,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save contact");
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setContact("");
                setAcceptedPrivacy(false);
                setSuccess(false);
            }, 600);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSkip = () => {
        setContact("");
        setAcceptedPrivacy(false);
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60" onClick={handleSkip} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4">
                <button
                    type="button"
                    onClick={handleSkip}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-4 pr-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-900">Thanks for your feedback! 🙌</h3>
                        <p className="text-sm text-slate-600">
                            If you want, leave your LinkedIn or Gmail so we can let you know when we ship the fix.
                            Otherwise, just hit Skip to close.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Tu LinkedIn o Gmail"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all text-sm"
                        />

                        <label className="flex items-start gap-2 text-xs text-slate-600">
                            <input
                                type="checkbox"
                                checked={acceptedPrivacy}
                                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-black focus:ring-slate-300 cursor-pointer"
                            />
                            <span>
                                I accept the{" "}
                                <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    className="text-slate-900 underline hover:no-underline"
                                >
                                    Privacy Policy
                                </a>{" "}
                                and consent to the processing of my data.
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                        >
                            Skip
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!contact.trim() || !acceptedPrivacy || isSaving}
                            className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[100px] flex justify-center items-center"
                        >
                            {isSaving ? (
                                <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Enviar"
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
                            Guardado. ¡Gracias por compartir!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
