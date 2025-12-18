'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { safeCapture } from '@/lib/posthog';

// Helper function to render logo SVG for each service - simplified
const renderServiceLogo = (serviceName: string, x: number, y: number, size: number = 40): React.ReactElement => {
  const half = size / 2;
  const radius = half * 0.9;
  
  // Simple circle logos - color map
  const colorMap: Record<string, string> = {
    'OpenAI': '#10A37F',
    'Anthropic': '#D4A574',
    'Google AI': '#4285F4',
    'Microsoft': '#0078D4',
    'Hugging Face': '#FFD21E',
    'Stability AI': '#000000',
    'Cohere': '#FF6B35',
    'Perplexity': '#000000',
    'Mistral AI': '#FF6B00',
    'Claude': '#D4A574',
    'Groq': '#00C853',
    'Freepik': '#0C75F0',
    'Replicate': '#3C3C3C',
    'ElevenLabs': '#000000',
  };
  
  const color = colorMap[serviceName] || '#6B7280';
  const translateX = x - half;
  const translateY = y - half;
  
  return (
    <g transform={`translate(${translateX}, ${translateY})`}>
      <circle cx={half} cy={half} r={radius} fill={color}/>
    </g>
  );
};

export const MCPStoreSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mcpCount, setMcpCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('mcp-store-section');
    if (section) {
      observer.observe(section);
    }

    // Fetch MCP count - simplified to prevent errors
    if (typeof window !== 'undefined') {
      try {
        fetch('https://services.levanteapp.com/api/mcps/stats')
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && typeof data.total === 'number') {
              setMcpCount(data.total);
            }
          })
          .catch(() => {
            // Silently fail, use default value
            setMcpCount(0);
          });
      } catch (error) {
        setMcpCount(0);
      }
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Icon positions around the center - AI SaaS services (circular pattern wrapping the text, no duplicates)
  // 14 unique services distributed evenly in a circle (360/14 = ~25.7 degrees apart)
  // Using polar coordinates converted to percentages
  const services = [
    'OpenAI', 'Anthropic', 'Google AI', 'Microsoft', 'Hugging Face', 
    'Stability AI', 'Cohere', 'Perplexity', 'Mistral AI', 'Claude',
    'Groq', 'Freepik', 'ElevenLabs', 'Replicate'
  ];
  
  const colors: Record<string, string> = {
    'OpenAI': '#10A37F',
    'Anthropic': '#D4A574',
    'Google AI': '#4285F4',
    'Microsoft': '#0078D4',
    'Hugging Face': '#FFD21E',
    'Stability AI': '#000000',
    'Cohere': '#FF6B35',
    'Perplexity': '#000000',
    'Mistral AI': '#FF6B00',
    'Claude': '#D4A574',
    'Groq': '#00C853',
    'Freepik': '#0C75F0',
    'ElevenLabs': '#000000',
    'Replicate': '#3C3C3C',
  };

  // Calculate positions in a circle (radius increased to separate from center text)
  const radius = 48; // percentage - increased to create more space from center
  const centerX = 50; // percentage
  const centerY = 50; // percentage
  
  const iconPositions = services.map((service, index) => {
    // Start at -90 degrees (top) and go clockwise
    const angle = (-90 + (360 / services.length) * index) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return {
      x: `${x}%`,
      y: `${y}%`,
      name: service,
      color: colors[service] || '#6B7280'
    };
  });

  return (
    <section className="mt-16 sm:mt-24 lg:mt-32 mb-32 sm:mb-48 lg:mb-64 relative">
      <div
        id="mcp-store-section"
        className={`relative w-full rounded-2xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
        style={{ aspectRatio: '2/1', minHeight: '600px' }}
      >
        {/* SVG with icons and connection lines */}
        <svg 
          className="absolute inset-0 w-full h-full overflow-visible z-10 pointer-events-none"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          {iconPositions.map((icon, index) => {
            // Calculate actual positions in viewBox coordinates
            const iconX = parseFloat(icon.x) * 12; // 1200 / 100
            const iconY = parseFloat(icon.y) * 6; // 600 / 100
            const centerXCoord = 600;
            const centerYCoord = 300;

            return (
              <line
                key={`line-${index}`}
                x1={centerXCoord}
                y1={centerYCoord}
                x2={iconX}
                y2={iconY}
                stroke="#D1D5DB"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity={isVisible ? 0.5 : 0}
                className="transition-opacity duration-1000"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              />
            );
          })}

          {/* Service logos */}
          {iconPositions.map((icon, index) => {
            const iconX = parseFloat(icon.x) * 12;
            const iconY = parseFloat(icon.y) * 6;
            const logoSize = 40;
            // Vary animation duration and delay for each logo to create natural floating effect
            const animationDuration = 3 + (index % 3) * 0.5; // 3s, 3.5s, or 4s
            const animationDelay = index * 0.2; // Stagger the start

            return (
              <g
                key={`icon-${index}`}
                opacity={isVisible ? 1 : 0}
                className="transition-opacity duration-700 cursor-pointer"
                style={{
                  transitionDelay: `${(iconPositions.length - index) * 50}ms`,
                  transformOrigin: `${iconX}px ${iconY}px`,
                }}
              >
                {/* Floating animation */}
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0,0; 0,-8; 0,0`}
                  dur={`${animationDuration}s`}
                  begin={`${animationDelay}s`}
                  repeatCount="indefinite"
                />
                
                {/* Background circle with white border */}
                <circle
                  cx={iconX}
                  cy={iconY}
                  r={logoSize/2 + 4}
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  className="transition-transform duration-300"
                />
                {/* Service logo */}
                <g className="hover:scale-110 transition-transform duration-300" style={{ transformOrigin: `${iconX}px ${iconY}px` }}>
                  {renderServiceLogo(icon.name, iconX, iconY, logoSize)}
                </g>
                {/* Icon label (optional, can be hidden on small screens) */}
                <text
                  x={iconX}
                  y={iconY + logoSize/2 + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
                  className="hidden md:block"
                >
                  {icon.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Content overlay - centered vertically */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
            {/* Main heading */}
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-[-1.92px] text-slate-900 mb-8 leading-tight">
              Explore the MCP Store
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Discover and integrate {mcpCount > 0 ? `${mcpCount}+ ` : ''}Model Context Protocol servers to extend your AI workspace
            </p>
            
            {/* Button */}
            <Link
              href="/store"
              onClick={() => safeCapture('mcp_store_section_card_clicked')}
              className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full text-base font-medium hover:bg-gray-900 transition-colors no-underline group relative z-40 pointer-events-auto"
            >
              Explore Store
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

