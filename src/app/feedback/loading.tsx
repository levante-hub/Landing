export default function FeedbackLoading() {
  // Minimal skeleton to show immediately while feedback and likes load
  return (
    <div className="min-h-screen bg-[#222222] animate-pulse">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 w-48 bg-white/10 rounded mx-auto" />
          <div className="h-4 w-80 bg-white/10 rounded mx-auto" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 shadow-2xl space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-3 w-16 bg-white/10 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-5/6 bg-white/10 rounded" />
                <div className="h-3 w-4/6 bg-white/10 rounded" />
              </div>
              <div className="h-8 w-24 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
