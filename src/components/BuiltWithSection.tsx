export const BuiltWithSection = () => {
  const tools = [
    {
      title: "MCPs",
      description: "The universal plug-in system for AI agents",
    },
    {
      title: "Turso",
      description: "Ultra-fast edge database built on libSQL for modern applications",
    },
    {
      title: "Electron",
      description: "Cross-platform desktop framework enabling web technologies for native apps",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 mt-16">
      <h2 className="text-white text-3xl sm:text-4xl font-medium mb-12">
        Built with the best tools
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="bg-[#2A2A2A] rounded-2xl p-8 hover:bg-[#323232] transition-colors"
          >
            <h3 className="text-white text-2xl font-medium mb-4">
              {tool.title}
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
