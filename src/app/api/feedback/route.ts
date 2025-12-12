import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { FEEDBACK_COOKIE_NAME, getOrCreateClientId } from "@/lib/feedback-id";
import { sendDiscordFeedback } from "@/lib/discord";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content, author_display_name } = body;

        if (!content || typeof content !== "string" || content.trim().length === 0) {
            return NextResponse.json({ error: "Empty content" }, { status: 400 });
        }

        // Basic anti-spam: check honeypot if sent (though usually handled in frontend, 
        // if we had a honeypot field in body we would check it here. 
        // The plan mentioned honeypot in UI, so if it's sent in body we check it.
        // Let's assume the UI sends it as 'website' or similar if we add it to body, 
        // but for now I'll just validate content).

        const { id: clientId, isNew } = await getOrCreateClientId();

        const result = await supabase
            .from("feedback")
            .insert({
                content: content.trim(),
                author_display_name: author_display_name?.trim() || null,
                author_client_id: clientId,
            } as any)
            .select()
            .single();

        if (result.error) {
            console.error("Supabase error:", result.error);
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        const data = result.data;

        // Fire and forget Discord notification
        // We don't await this to not slow down the response, or we can await if we want to ensure it sends.
        // Given Vercel functions might kill background tasks, it's safer to await or use `waitUntil` (if available).
        // For now, let's await it as it's fast enough usually.
        await sendDiscordFeedback({
            content: content.trim(),
            authorName: author_display_name?.trim() || null,
            feedbackId: (data as any)?.id || "unknown",
        });

        // Wait, we need the ID. Let's update the insert to select the ID.

        const res = NextResponse.json({ ok: true });

        if (isNew) {
            res.cookies.set(FEEDBACK_COOKIE_NAME, clientId, {
                httpOnly: false,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 365, // 1 year
            });
        }

        return res;
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
