'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import posthog from 'posthog-js';

export const BuiltWithSection = () => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'built-with-title') {
              setTitleVisible(true);
            } else if (entry.target.id === 'built-with-cards') {
              setCardsVisible(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const titleElement = document.getElementById('built-with-title');
    const cardsElement = document.getElementById('built-with-cards');
    
    if (titleElement) {
      observer.observe(titleElement);
    }
    if (cardsElement) {
      observer.observe(cardsElement);
    }

    return () => {
      if (titleElement) {
        observer.unobserve(titleElement);
      }
      if (cardsElement) {
        observer.unobserve(cardsElement);
      }
    };
  }, []);
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
      title: "Image models via generative models",
      description: (
        <>
          Generate images using open-source models through our <span className="text-white font-semibold">generative models integration</span> -- no extra setup required
        </>
      ),
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/multimodal.png",
      background: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/fondo1.png",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mt-16">
      <h2 
        id="built-with-title"
        className={`text-black text-3xl sm:text-4xl font-medium mb-12 transition-all duration-1000 ${
          titleVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      >
        Built for MCP-native workflows
      </h2>

      <div id="built-with-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div
            key={tool.title}
            className={`relative overflow-hidden bg-[#1F1F1F] rounded-2xl p-8 border border-white/10 flex flex-col gap-6 transition-all duration-700 ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
            onClick={() => posthog.capture('tool_card_clicked', { tool_name: tool.title })}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${tool.background})` }}
            />
            <div className="w-full h-56 overflow-hidden rounded-xl relative z-10">
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
