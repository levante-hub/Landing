import { cookies } from "next/headers";

export const FEEDBACK_COOKIE_NAME = "levante_feedback_id";

/**
 * Reads the feedback client id from cookies. If missing, generates a new one
 * but leaves cookie persistence up to the caller (Route Handler / Server Action)
 * to avoid "Cookies can only be modified..." errors in Server Components.
 */
export async function getOrCreateClientId(): Promise<{ id: string; isNew: boolean }> {
    const cookieStore = await cookies();

    // Defensive: in rare cases (e.g., unexpected runtime), cookies() might not
    // return the standard interface. Bail out gracefully instead of throwing.
    if (!cookieStore || typeof (cookieStore as any).get !== "function") {
        return { id: crypto.randomUUID(), isNew: true };
    }

    const existing = cookieStore.get(FEEDBACK_COOKIE_NAME)?.value;

    if (existing) {
        return { id: existing, isNew: false };
    }

    return { id: crypto.randomUUID(), isNew: true };
}
