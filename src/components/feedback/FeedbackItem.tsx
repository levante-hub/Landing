"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FeedbackItemProps {
    id: string;
    content: string;
    authorName: string | null;
    createdAt: string;
    initialLikes: number;
    hasLiked?: boolean; // Optional: if we implement checking if user liked
}

export function FeedbackItem({
    id,
    content,
    authorName,
    createdAt,
    initialLikes,
    hasLiked = false,
}: FeedbackItemProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiking, setIsLiking] = useState(false);
    const [hasVoted, setHasVoted] = useState(hasLiked);
    const router = useRouter();

    const handleLike = async () => {
        if (isLiking || hasVoted) return;

        // Optimistic update
        setLikes((prev) => prev + 1);
        setHasVoted(true);
        setIsLiking(true);

        try {
            const res = await fetch(`/api/feedback/${id}/like`, {
                method: "POST",
            });

            if (!res.ok) {
                if (res.status === 409) {
                    // Already voted, keep the optimistic state or revert?
                    // If we want to be strict, we revert. But "Already voted" might mean
                    // they voted in a previous session.
                    // For this simple implementation, let's just leave it as "voted" in UI.
                } else {
                    // Revert on error
                    setLikes((prev) => prev - 1);
                    setHasVoted(false);
                }
            } else {
                router.refresh();
            }
        } catch (error) {
            setLikes((prev) => prev - 1);
            setHasVoted(false);
        } finally {
            setIsLiking(false);
        }
    };

    // Format date nicely
    const date = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="bg-[#2A2A2A]/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                        {content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/40">
                        <span className={authorName ? "text-white/60 font-medium" : ""}>
                            {authorName || "Anonymous"}
                        </span>
                        <span>•</span>
                        <span>{date}</span>
                    </div>
                </div>

                <button
                    onClick={handleLike}
                    disabled={hasVoted || isLiking}
                    className={`flex flex-col items-center gap-1 min-w-[50px] p-2 rounded-xl transition-all ${hasVoted
                        ? "text-white bg-white/10 cursor-default"
                        : "text-white/40 hover:text-white hover:bg-white/5 cursor-pointer active:scale-95"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={hasVoted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                    >
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                    <span className="text-sm font-medium">{likes}</span>
                </button>
            </div>
        </div>
    );
}
