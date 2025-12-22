'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Cloud, Play } from 'lucide-react';
import { safeCapture } from '@/lib/posthog';
import { 
  SiGoogle, SiGithub, SiSupabase, 
  SiN8N, SiShopify, SiAtlassian, SiNotion, 
  SiHubspot, SiZapier, SiCloudflare
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { RiSearchLine, RiFileTextLine, RiStackLine } from 'react-icons/ri';

const serviceIcons: Record<string, React.ElementType> = {
  'Google': SiGoogle,
  'AWS': FaAws,
  'Microsoft': Cloud,
  'Github': SiGithub,
  'Supabase': SiSupabase,
  'n8n': SiN8N,
  'Playwright': Play,
  'Shopify': SiShopify,
  'Atlassian': SiAtlassian,
  'Notion': SiNotion,
  'HubSpot': SiHubspot,
  'Zapier': SiZapier,
  'Cloudflare': SiCloudflare,
  'Context7': RiStackLine,
  'Docling': RiFileTextLine,
  'Exa': RiSearchLine,
};

const serviceColors: Record<string, string> = {
  'Google': '#4285F4',
  'AWS': '#FF9900',
  'Microsoft': '#00A4EF',
  'Github': '#181717',
  'Supabase': '#3ECF8E',
  'n8n': '#FF6D5B',
  'Playwright': '#2EAD33',
  'Shopify': '#7AB55C',
  'Atlassian': '#0052CC',
  'Notion': '#000000',
  'HubSpot': '#FF7A59',
  'Zapier': '#FF4F00',
  'Cloudflare': '#F38020',
  'Context7': '#6366F1',
  'Docling': '#0062ff',
  'Exa': '#8B5CF6',
};

// Helper function to render logo for each service
const renderServiceLogo = (serviceName: string, x: number, y: number, size: number = 40): React.ReactElement => {
  const Icon = serviceIcons[serviceName] || RiStackLine;
  const color = serviceColors[serviceName] || '#6B7280';
  const half = size / 2;
  
  return (
    <foreignObject x={x - half} y={y - half} width={size} height={size}>
      <div className="flex items-center justify-center w-full h-full">
        <Icon style={{ color, width: '100%', height: '100%' }} />
      </div>
    </foreignObject>
  );
};

export const MCPStoreSection = () => {
  const [isVisible, setIsVisible] = useState(false);

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

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Icon positions around the center - AI SaaS services (circular pattern wrapping the text, no duplicates)
  // 16 unique services distributed evenly in a circle (360/16 = 22.5 degrees apart)
  // Using polar coordinates converted to percentages
  const services = [
    'Context7', 'Google', 'AWS', 'Microsoft', 'Docling', 'Github', 
    'Supabase', 'n8n', 'Exa', 'Playwright', 'Shopify', 'Atlassian', 
    'Notion', 'HubSpot', 'Zapier', 'Cloudflare'
  ];

  const servicesToReduce = ['Atlassian', 'Notion', 'HubSpot', 'Zapier', 'Shopify', 'Google', 'AWS', 'Docling', 'Playwright'];

  // Calculate positions in a circle (radius increased to separate from center text)
  const radius = 48; // percentage - increased to create more space from center
  const centerX = 50; // percentage
  const centerY = 50; // percentage
  
  const desktopIconPositions = services.map((service, index) => {
    // Start at -90 degrees (top) and go clockwise
    const angle = (-90 + (360 / services.length) * index) * (Math.PI / 180);
    const x = (centerX + radius * Math.cos(angle)) * 12; // convert to viewBox 1200
    const y = (centerY + radius * Math.sin(angle)) * 6;  // convert to viewBox 600
    
    return {
      x,
      y,
      name: service,
      color: serviceColors[service] || '#6B7280'
    };
  });

  const mobileIconPositions = services.slice(0, 8).map((service, index) => {
    // For mobile, we take a subset and arrange them in two rows or a smaller circle
    // Let's use a simpler distribution for mobile
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    // Top group
    if (row === 0) {
      return { name: service, x: 80 + col * 120, y: 60 + (col % 2 === 0 ? 0 : 20), color: serviceColors[service] };
    }
    // Bottom group
    return { name: service, x: 80 + col * 120, y: 740 - (col % 2 === 0 ? 0 : 20), color: serviceColors[service] };
  });

  return (
    <section className="mt-16 sm:mt-24 lg:mt-32 mb-16 sm:mb-24 lg:mb-32 relative">
      <div
        id="mcp-store-section"
        className={`relative w-full rounded-2xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
        style={{ aspectRatio: '2/1', minHeight: '600px' }}
      >
        {/* SVG with icons and connection lines - Mobile */}
        <svg 
          className="md:hidden absolute inset-0 w-full h-full overflow-visible z-10 pointer-events-none"
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines - Mobile */}
          {mobileIconPositions.map((icon, index) => {
            const centerXCoord = 200;
            const centerYCoord = 400;

            return (
              <line
                key={`line-mobile-${index}`}
                x1={centerXCoord}
                y1={centerYCoord}
                x2={icon.x}
                y2={icon.y}
                stroke="#D1D5DB"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity={isVisible ? 0.4 : 0}
                className="transition-opacity duration-1000"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              />
            );
          })}

          {/* Service logos - Mobile */}
          {mobileIconPositions.map((icon, index) => {
            const baseLogoSize = 33;
            const logoSize = servicesToReduce.includes(icon.name) ? Math.round(baseLogoSize * 0.75) : baseLogoSize;
            const animationDuration = 3 + (index % 3) * 0.5;
            const animationDelay = index * 0.2;

            return (
              <g
                key={`icon-mobile-${index}`}
                opacity={isVisible ? 1 : 0}
                className="transition-opacity duration-700"
                style={{
                  transitionDelay: `${(mobileIconPositions.length - index) * 50}ms`,
                  transformOrigin: `${icon.x}px ${icon.y}px`,
                }}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0,0; 0,-6; 0,0`}
                  dur={`${animationDuration}s`}
                  begin={`${animationDelay}s`}
                  repeatCount="indefinite"
                />
                
                <circle
                  cx={icon.x}
                  cy={icon.y}
                  r={baseLogoSize/2 + 4}
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <g style={{ transformOrigin: `${icon.x}px ${icon.y}px` }}>
                  {renderServiceLogo(icon.name, icon.x, icon.y, logoSize)}
                </g>
              </g>
            );
          })}
        </svg>

        {/* SVG with icons and connection lines - Desktop */}
        <svg 
          className="hidden md:block absolute inset-0 w-full h-full overflow-visible z-10 pointer-events-none"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines - Desktop */}
          {desktopIconPositions.map((icon, index) => {
            const centerXCoord = 600;
            const centerYCoord = 300;

            return (
              <line
                key={`line-desktop-${index}`}
                x1={centerXCoord}
                y1={centerYCoord}
                x2={icon.x}
                y2={icon.y}
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

          {/* Service logos - Desktop */}
          {desktopIconPositions.map((icon, index) => {
            const baseLogoSize = 26;
            const logoSize = servicesToReduce.includes(icon.name) ? Math.round(baseLogoSize * 0.75) : baseLogoSize;
            const animationDuration = 3 + (index % 3) * 0.5;
            const animationDelay = index * 0.2;

            return (
              <g
                key={`icon-desktop-${index}`}
                opacity={isVisible ? 1 : 0}
                className="transition-opacity duration-700 cursor-pointer"
                style={{
                  transitionDelay: `${(desktopIconPositions.length - index) * 50}ms`,
                  transformOrigin: `${icon.x}px ${icon.y}px`,
                }}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0,0; 0,-8; 0,0`}
                  dur={`${animationDuration}s`}
                  begin={`${animationDelay}s`}
                  repeatCount="indefinite"
                />
                
                <circle
                  cx={icon.x}
                  cy={icon.y}
                  r={baseLogoSize/2 + 4}
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  className="transition-transform duration-300"
                />
                <g className="hover:scale-110 transition-transform duration-300" style={{ transformOrigin: `${icon.x}px ${icon.y}px` }}>
                  {renderServiceLogo(icon.name, icon.x, icon.y, logoSize)}
                </g>
                <text
                  x={icon.x}
                  y={icon.y + baseLogoSize/2 + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
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
              Levante MCP Store
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Unlock your AI&apos;s full potential
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

