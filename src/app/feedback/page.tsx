import Image from "next/image";
import Link from "next/link";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackList } from "@/components/feedback/FeedbackList";

export const metadata = {
    title: "Feedback | Levante",
    description: "Share your thoughts and ideas for Levante.",
};

export default function FeedbackPage() {
    return (
        <div className="min-h-screen bg-[#222222]">
            <nav className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image
                          src="/levante-logo.svg"
                          alt="Logo"
                          width={32}
                          height={32}
                        />
                        <span className="text-white text-lg font-normal">Levante</span>
                    </Link>

                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-white text-sm hover:text-white/80 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 pt-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight">
                        Feedback Wall
                    </h1>
                    <p className="text-lg text-white/60 max-w-xl mx-auto">
                        Help us shape the future of Levante. Share your ideas, report issues, or just say hello.
                    </p>
                </div>

                <FeedbackForm />

                <div className="mt-16">
                    <h2 className="text-2xl font-medium text-white mb-8 px-4">Community Ideas</h2>
                    <FeedbackList />
                </div>
            </main>
        </div>
    );
}
