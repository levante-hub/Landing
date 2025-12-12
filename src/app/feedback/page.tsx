"use client";

import { useState } from "react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackList } from "@/components/feedback/FeedbackList";
import { FeedbackNav } from "@/components/feedback/FeedbackNav";
import { TryNowSection } from "@/components/TryNowSection";
import { Questionnaire } from "@/components/questionnaire";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { safeCapture } from "@/lib/posthog";

export default function FeedbackPage() {
    const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { downloadUrl, platform } = useLatestRelease();

    const openQuestionnaire = () => {
        safeCapture("contribution_questionnaire_opened");
        setIsQuestionnaireOpen(true);
    };
    const closeQuestionnaire = () => setIsQuestionnaireOpen(false);

    const handleDownload = () => {
        safeCapture("download_button_clicked", { location: "navbar" });

        if (downloadUrl) {
            setIsDownloading(true);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "";
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                setIsDownloading(false);
            }, 2000);
        }
    };

    const getPlatformLabel = () => {
        const labels: Record<string, string> = {
            windows: "Windows",
            "macos-intel": "Mac (Intel)",
            "macos-arm": "Mac (Apple Silicon)",
            linux: "Linux",
            unknown: "",
        };
        return labels[platform] || "";
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <FeedbackNav
                onOpenQuestionnaire={openQuestionnaire}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                downloadUrl={downloadUrl}
            />

            <main className="max-w-5xl mx-auto px-4 pt-16 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
                        Feedback Wall
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Help us shape the future of Levante. Share your ideas, report issues, or just say hello.
                    </p>
                </div>

                <FeedbackForm />

                <div className="mt-16 max-w-2xl mx-auto px-2">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">Community Ideas</h2>
                    <FeedbackList />
                </div>
            </main>

            <TryNowSection
                onDownload={() => {
                    safeCapture("download_button_clicked", { location: "footer" });
                    handleDownload();
                }}
                isDownloading={isDownloading}
                downloadUrl={downloadUrl}
                getPlatformLabel={getPlatformLabel}
            />

            <Questionnaire
                isOpen={isQuestionnaireOpen}
                onClose={closeQuestionnaire}
            />
        </div>
    );
}
