import { cookies } from "next/headers";

export const FEEDBACK_COOKIE_NAME = "levante_feedback_id";

export async function getOrCreateClientId() {
    const cookieStore = await cookies();
    let id = cookieStore.get(FEEDBACK_COOKIE_NAME)?.value;

    if (!id) {
        id = crypto.randomUUID();
        try {
            cookieStore.set(FEEDBACK_COOKIE_NAME, id, {
                httpOnly: false, // Allow client side reading if needed, but safer as true if only server needs it. Plan said false/true.
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 365, // 1 year
            });
        } catch (error) {
            // This might fail if called in a component that is rendering, 
            // but should work in Route Handlers / Server Actions.
            console.error("Failed to set cookie:", error);
        }
    }

    return id;
}
