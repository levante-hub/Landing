'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { safeCapture } from '@/lib/posthog';
import { MCPNativeFeaturesSVG } from './MCPNativeFeaturesSVG';
import { InteractiveMCPAppsSVG } from './InteractiveMCPAppsSVG';
import { GenerativeModelsSVG } from './GenerativeModelsSVG';

export const BuiltWithSection = () => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'built-with-title') {
              setTitleVisible(true);
            } else if (entry.target.id.startsWith('tool-card-')) {
              const toolTitle = entry.target.getAttribute('data-tool-title');
              if (toolTitle) {
                setVisibleCards(prev => ({ ...prev, [toolTitle]: true }));
              }
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const titleElement = document.getElementById('built-with-title');
    const toolCards = document.querySelectorAll('[id^="tool-card-"]');
    
    if (titleElement) observer.observe(titleElement);
    toolCards.forEach(card => observer.observe(card));

    return () => {
      if (titleElement) observer.unobserve(titleElement);
      toolCards.forEach(card => observer.unobserve(card));
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
      background: "/blue-background.jpeg",
      color: "",
      svg: (isInView: boolean) => <MCPNativeFeaturesSVG isInView={isInView} />
    },
    {
      title: "Interactive MCP Apps",
      description: (
        <>
          Render <span className="text-white font-semibold">MCP-UI</span> apps as native views inside the interface for richer, guided interactions.
        </>
      ),
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/funcionalidades2/MCP-UI.png",
      background: "/orange-background.jpeg",
      color: "",
      svg: (isInView: boolean) => <InteractiveMCPAppsSVG isInView={isInView} />
    },
    {
      title: "Image models via generative models",
      description: (
        <>
          Generate images using open-source models through our <span className="text-white font-semibold">generative models integration</span> -- no extra setup required
        </>
      ),
      image: "/person-walking-dog.png",
      background: "/green-background.jpeg",
      color: "",
      svg: (isInView: boolean) => <GenerativeModelsSVG isInView={isInView} />
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 my-8 relative">
      <h2 
        id="built-with-title"
        className={`text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-1.92px] mb-24 text-center transition-all duration-1000 ${
          titleVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      >
        Built for MCP-native workflows
      </h2>

      <div id="built-with-cards" className="flex flex-col items-center w-full">
        {tools.map((tool, index) => (
          <div
            key={tool.title}
            id={`tool-card-${index}`}
            data-tool-title={tool.title}
            className={`sticky w-full max-w-6xl h-[500px] md:h-[600px] mb-12 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500`}
            style={{ 
              top: `${30 + (index * 60)}px`,
              zIndex: index + 1
            }}
            onClick={() => safeCapture('tool_card_clicked', { tool_name: tool.title })}
          >
            {/* Background Gradient */}
            {tool.color && <div className={`absolute inset-0 bg-gradient-to-br ${tool.color}`} />}
            
            {/* Background Image Overlay */}
            <div
              className={`absolute inset-0 bg-cover bg-center ${tool.color ? 'opacity-40' : 'opacity-100'}`}
              style={{ backgroundImage: `url(${tool.background})` }}
            />
            
            {/* Dark Overlay (10%) */}
            <div className="absolute inset-0 bg-black/10 z-0" />

            <div className="relative h-full flex flex-col p-8 sm:p-12 md:p-16 z-10 max-w-7xl mx-auto w-full">
              <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-16 flex-1 min-h-0">
                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-start md:justify-between text-left gap-2 md:gap-0">
                  <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-1 md:mb-6 tracking-tight">
                    {tool.title}
                  </h3>
                  <p className="text-gray-100 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl opacity-100">
                    {tool.description}
                  </p>
                </div>

                {/* Card Image */}
                <div className="flex-1 w-full relative transition-transform duration-700 min-h-[200px] md:min-h-0">
                  <div className="w-full h-full flex items-center justify-center">
                    {tool.svg ? (
                      tool.svg(visibleCards[tool.title])
                    ) : (
                      <Image
                        src={tool.image}
                        alt={tool.title}
                        fill
                        className="object-contain object-right"
                        priority={index === 0}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

