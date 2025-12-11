import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackList } from "@/components/feedback/FeedbackList";
import { FeedbackNav } from "@/components/feedback/FeedbackNav";

export const metadata = {
    title: "Feedback | Levante",
    description: "Share your thoughts and ideas for Levante.",
};

export default function FeedbackPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <FeedbackNav />

            <main className="max-w-5xl mx-auto px-4 pt-16 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
                        Feedback Wall
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Help us shape the future of Levante. Share your ideas, report issues, or just say hello.
                    </p>
                </div>

                <FeedbackForm />

                <div className="mt-16 max-w-2xl mx-auto px-2">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">Community Ideas</h2>
                    <FeedbackList />
                </div>
            </main>
        </div>
    );
}
