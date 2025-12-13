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
        <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                {/* Vote Button */}
                <button
                    onClick={handleLike}
                    disabled={hasVoted || isLiking}
                    className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg border-2 transition-all ${
                        hasVoted
                            ? "bg-black border-black text-white"
                            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                    }`}
                    aria-label={hasVoted ? "Already voted" : "Vote for this feedback"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm font-semibold mt-1">{likes}</span>
                </button>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <p className="text-slate-900 text-lg leading-relaxed whitespace-pre-wrap">
                        {content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className={authorName ? "text-slate-700 font-medium" : ""}>
                            {authorName || "Anonymous"}
                        </span>
                        <span>•</span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
