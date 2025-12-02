import { supabase } from "@/lib/supabase/client";
import { FeedbackItem } from "./FeedbackItem";
import { getOrCreateClientId } from "@/lib/feedback-id";

// Force dynamic rendering so we always get fresh data
export const dynamic = "force-dynamic";

export async function FeedbackList() {
    const { data: feedback, error } = await supabase
        .from("feedback")
        .select(`
      *,
      feedback_likes (
        count
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching feedback:", error);
        return (
            <div className="text-center text-red-400 py-12">
                Failed to load feedback. Please try again later.
            </div>
        );
    }

    // Process data to get like counts
    // Note: Supabase .select with count returns count in a specific way depending on query.
    // The query above might return `feedback_likes: [{ count: ... }]` or similar if using `count` aggregate,
    // but Supabase JS client usually needs `select('*, feedback_likes(count)')` and then it returns an array of objects.
    // Actually, `count` in select is for exact count.
    // Let's adjust the query to be more standard for counting related rows.
    // A common pattern is to use a separate RPC or just fetch all likes (bad for scale) or use `.select('*, feedback_likes(count)')` 
    // which returns `feedback_likes: [{ count: 123 }]` (if using head:true or count: exact).
    // Wait, `feedback_likes(count)` in select string is not standard PostgREST syntax for getting just the count as a number in the row.
    // It usually returns an array of objects.
    // A better approach for "sort by likes" is a view or a computed column, but we can't change DB schema easily beyond tables.
    // The user suggested:
    // select f.*, count(fl.voter_client_id) as like_count ... group by f.id
    // We can't do raw SQL easily with supabase-js client unless we use `.rpc()`.
    // But we can fetch data and sort in JS for now (not efficient for huge data, but fine for MVP).

    // Let's try to get the count.
    // `select('*, feedback_likes(count)')` returns `feedback_likes: { count: number }[]`? No.
    // It returns the rows. We want `feedback_likes(count)` with `head: true`?
    // Actually, standard way without RPC is:
    // .select('*, feedback_likes(voter_client_id)', { count: 'exact', head: true }) -> this doesn't work per row.

    // Let's just fetch all feedback and then for each, we might need the count.
    // OR, we just use the user's suggestion of raw SQL if we could, but we can't.
    // Let's stick to: fetch all feedback, and for each feedback, fetch count? No, N+1.

    // Let's use the `select` with joined table and `count`.
    // `supabase.from('feedback').select('*, feedback_likes(count)')`
    // This usually returns `feedback_likes: [{ count: N }]` where N is total? No.

    // Let's try to just fetch everything and sort in memory for this MVP.
    // We will fetch `id, content, ..., feedback_likes(voter_client_id)`? No, that fetches all like rows.

    // Re-reading user prompt:
    // "Puedes hacerlo desde server components (fetch en el servidor): select ... from ... group by ..."
    // The user implies we can run SQL? Or maybe they meant using Supabase client to do something similar.
    // But Supabase JS client doesn't support `group by` easily.
    // However, we can use `select('*, feedback_likes(count)')` which returns `feedback_likes: [{ count: ... }]` is NOT correct.
    // The correct way to get count of relations is `select('*, feedback_likes(count)')` is actually valid in some versions but usually returns array of objects.

    // Let's assume we can't easily sort by likes server-side without an RPC or View.
    // I will fetch all feedback, and for each, I will try to get the count.
    // Actually, if I use `select('*, feedback_likes(count)')`, the response `feedback_likes` will be `[{ count: ... }]` is not right.
    // It will be `feedback_likes: [ { count: ... } ]` if I use `head: true` inside?

    // Let's use a simpler approach:
    // Fetch feedback.
    // Fetch all likes? No.

    // Let's look at `database.types.ts`.
    // We have `feedback_likes`.

    const clientId = await getOrCreateClientId();

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
        return (
            <div className="text-center text-red-400 py-12">
                Failed to load feedback. Please try again later.
            </div>
        );
    }

    // Transform and sort
    const formattedFeedback = rawFeedback.map((item: any) => {
        const likes = item.feedback_likes || [];
        return {
            ...item,
            like_count: likes.length,
            has_liked: likes.some((like: any) => like.voter_client_id === clientId),
        };
    }).sort((a, b) => {
        // Sort by likes desc, then created_at desc
        if (b.like_count !== a.like_count) {
            return b.like_count - a.like_count;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 pb-20">
            {formattedFeedback.length === 0 ? (
                <div className="text-center text-white/40 py-12">
                    No feedback yet. Be the first to share your thoughts!
                </div>
            ) : (
                formattedFeedback.map((item) => (
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
