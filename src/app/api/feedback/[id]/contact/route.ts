import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { contact, acceptedPrivacy } = await req.json();

        if (!params?.id) {
            return NextResponse.json({ error: "Missing feedback ID" }, { status: 400 });
        }

        if (!contact || typeof contact !== "string" || contact.trim().length === 0) {
            return NextResponse.json({ error: "Missing contact" }, { status: 400 });
        }

        if (!acceptedPrivacy) {
            return NextResponse.json({ error: "Privacy not accepted" }, { status: 400 });
        }

        if (!supabaseAdmin) {
            console.error("Supabase admin client is not available");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const { error } = await supabaseAdmin
            .from("feedback_contacts")
            .upsert({
                feedback_id: params.id,
                contact: contact.trim(),
                privacy_accepted_at: new Date().toISOString(),
            } as any)
            .eq("feedback_id", params.id);

        if (error) {
            console.error("Supabase error updating contact:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
