import Image from 'next/image';
import posthog from 'posthog-js';

export const BuiltWithSection = () => {
  const tools = [
    {
      title: "MCP-native features",
      description: (
        <>
          First-class <span className="text-white font-semibold">support</span> for <span className="text-white font-semibold">tools</span>, <span className="text-white font-semibold">resources</span>, and prompts from all your MCP servers.
        </>
      ),
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/MCP-functionalities.png",
      background: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/fondo3.png",
    },
    {
      title: "Interactive MCP Apps",
      description: (
        <>
          Render <span className="text-white font-semibold">MCP-UI</span> apps as native views inside the interface for richer, guided interactions.
        </>
      ),
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/MCP-UI.png",
      background: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/fondo2.png",
    },
    {
      title: "Image models via Hugging Face",
      description: (
        <>
          Generate images using open-source models through our <span className="text-white font-semibold">Hugging Face integration</span> -- no extra setup required
        </>
      ),
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/multimodal.png",
      background: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/fondo1.png",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mt-16">
      <h2 className="text-black text-3xl sm:text-4xl font-medium mb-12">
        Built for MCP-native workflows
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="relative overflow-hidden bg-[#1F1F1F] rounded-2xl p-8 border border-white/10 flex flex-col gap-6"
            onClick={() => posthog.capture('tool_card_clicked', { tool_name: tool.title })}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${tool.background})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
            <div className="w-full h-56 overflow-hidden rounded-xl border border-white/5 bg-[#0F0F0F] relative z-10">
              <Image
                src={tool.image}
                alt={tool.title}
                width={720}
                height={480}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col gap-3 relative z-10">
              <h3 className="text-white text-2xl font-medium">
                {tool.title}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
