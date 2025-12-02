import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getOrCreateClientId } from "@/lib/feedback-id";

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const clientId = await getOrCreateClientId();
        const feedbackId = params.id;

        if (!feedbackId) {
            return NextResponse.json({ error: "Missing feedback ID" }, { status: 400 });
        }

        const { error } = await supabase
            .from("feedback_likes")
            .insert({
                feedback_id: feedbackId,
                voter_client_id: clientId,
            } as any);

        if (error) {
            // 23505 = unique violation => already voted
            if (error.code === "23505") {
                console.log("Already voted:", feedbackId, clientId);
                return NextResponse.json({ error: "Already voted" }, { status: 409 });
            }
            console.error("Supabase error inserting like:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("Like inserted successfully:", feedbackId, clientId);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
