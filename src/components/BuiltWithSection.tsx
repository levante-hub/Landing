import posthog from 'posthog-js';

export const BuiltWithSection = () => {
  const tools = [
    {
      title: "MCP-native features",
      description: "First-class support for tools, resources, and prompts from all your MCP servers.",
    },
    {
      title: "Interactive MCP Apps",
      description: "Render MCP-UI apps as native views inside the interface for richer, guided interactions.",
    },
    {
      title: "Image models via Hugging Face",
      description: "Generate images using open-source models through our Hugging Face integration -- no extra setup required",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 mt-16">
      <h2 className="text-white text-3xl sm:text-4xl font-medium mb-12">
        Built for MCP-native workflows
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="bg-[#2A2A2A] rounded-2xl p-8 hover:bg-[#323232] transition-colors"
            onClick={() => posthog.capture('tool_card_clicked', { tool_name: tool.title })}
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
