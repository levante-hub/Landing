"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { FeedbackItem } from "./FeedbackItem";

interface FeedbackData {
    id: string;
    content: string;
    author_display_name: string | null;
    created_at: string;
    like_count: number;
    has_liked: boolean;
}

export function FeedbackList() {
    const [feedback, setFeedback] = useState<FeedbackData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeedback() {
            try {
                // Get or create client ID from cookie
                let clientId = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("levante_feedback_id="))
                    ?.split("=")[1];

                if (!clientId) {
                    clientId = crypto.randomUUID();
                    document.cookie = `levante_feedback_id=${clientId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
                }

                const { data: rawFeedback, error: fetchError } = await supabase
                    .from("feedback")
                    .select(`
                        *,
                        feedback_likes (
                            voter_client_id
                        )
                    `);

                if (fetchError) {
                    console.error("Error fetching feedback:", fetchError);
                    setError("Failed to load feedback. Please try again later.");
                    return;
                }

                // Transform and sort
                const formattedFeedback = rawFeedback.map((item: any) => {
                    const likes = item.feedback_likes || [];
                    return {
                        id: item.id,
                        content: item.content,
                        author_display_name: item.author_display_name,
                        created_at: item.created_at,
                        like_count: likes.length,
                        has_liked: likes.some((like: any) => like.voter_client_id === clientId),
                    };
                }).sort((a, b) => {
                    if (b.like_count !== a.like_count) {
                        return b.like_count - a.like_count;
                    }
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });

                setFeedback(formattedFeedback);
            } catch (err) {
                console.error("Error:", err);
                setError("Failed to load feedback. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchFeedback();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto py-12 flex justify-center">
                <span className="animate-spin inline-block w-8 h-8 border-3 border-slate-300 border-t-slate-600 rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-12">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 pb-20">
            {feedback.length === 0 ? (
                <div className="text-center text-slate-500 py-12">
                    No feedback yet. Be the first to share your thoughts!
                </div>
            ) : (
                feedback.map((item) => (
                    <FeedbackItem
                        key={item.id}
                        id={item.id}
                        content={item.content}
                        authorName={item.author_display_name}
                        createdAt={item.created_at}
                        initialLikes={item.like_count}
                        hasLiked={item.has_liked}
                    />
                ))
            )}
        </div>
    );
}
