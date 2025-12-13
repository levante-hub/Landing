"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackList } from "@/components/feedback/FeedbackList";
import { RoadmapList } from "@/components/feedback/RoadmapList";
import { FeedbackNav } from "@/components/feedback/FeedbackNav";
import { TryNowSection } from "@/components/TryNowSection";
import { Questionnaire } from "@/components/questionnaire";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { safeCapture } from "@/lib/posthog";

type TabType = "feedback" | "roadmap";

export default function FeedbackPage() {
    const [activeTab, setActiveTab] = useState<TabType>("feedback");
    const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
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
        <div className="min-h-screen bg-[#FEFEFE] text-slate-900">
            <FeedbackNav
                onOpenQuestionnaire={openQuestionnaire}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                downloadUrl={downloadUrl}
            />

            {/* Hero Section with Background */}
            <section className="relative w-full h-[80vh]">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src="/hero-feedback.jpg"
                        alt="Feedback hero background"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-top"
                        style={{ objectPosition: 'top' }}
                    />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4 tracking-tight">
                        {activeTab === "feedback" ? "Feedback Wall" : "Roadmap"}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
                        {activeTab === "feedback"
                            ? "Help us shape the future of Levante. Share your ideas, report issues, or just say hello."
                            : "Vote for the features you want to see next in Levante."}
                    </p>

                    {/* Tabs */}
                    <div className="flex justify-center py-[15px]">
                        <div className="inline-flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => {
                                    setActiveTab("feedback");
                                    safeCapture("feedback_tab_clicked");
                                }}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                    activeTab === "feedback"
                                        ? "bg-black text-white shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Feedback
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("roadmap");
                                    safeCapture("roadmap_tab_clicked");
                                }}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                    activeTab === "roadmap"
                                        ? "bg-black text-white shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Roadmap
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-5xl mx-auto px-4 pt-4 pb-20">

                {/* Tab Content */}
                {activeTab === "feedback" ? (
                    <>
                        <div className="max-w-2xl mx-auto px-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-slate-900">Community Ideas</h2>
                                <button
                                    onClick={() => setIsFeedbackFormOpen(true)}
                                    className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-800 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all active:scale-95"
                                >
                                    <MessageSquarePlus className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                                    <span className="text-sm font-medium">Share your feedback</span>
                                </button>
                            </div>
                            
                            <FeedbackForm 
                                isOpen={isFeedbackFormOpen} 
                                setIsOpen={setIsFeedbackFormOpen}
                                hideButton={true}
                            />
                            
                            <FeedbackList />
                        </div>
                    </>
                ) : (
                    <div className="max-w-3xl mx-auto px-2">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Upcoming Features</h2>
                        <RoadmapList />
                    </div>
                )}
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
