'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, Database, Code, FileText, Zap } from 'lucide-react';
import { safeCapture } from '@/lib/posthog';

interface MCPPreview {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

const categoryIcons: Record<string, any> = {
  documentation: FileText,
  development: Code,
  database: Database,
  automation: Zap,
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

    // Fetch MCP count
    fetch('https://services.levanteapp.com/api/mcps/stats')
      .then(res => res.json())
      .then(data => setMcpCount(data.total || 0))
      .catch(() => setMcpCount(0));

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <div
      id="mcp-store-section"
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
      }`}
    >
      {/* Featured Card with Background */}
      <Link
        href="/store"
        onClick={() => safeCapture('mcp_store_section_card_clicked')}
        className={`relative block rounded-2xl overflow-hidden min-h-[400px] group no-underline transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/mcp-store.jpg"
            alt="MCP Store"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 min-h-[400px]">
          {/* Categories Icons */}
          <div className="flex gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Bottom Content */}
          <div>
            <h3 className="text-3xl md:text-4xl font-medium text-white mb-4">
              Explore the MCP Store
            </h3>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Discover and integrate {mcpCount > 0 ? `${mcpCount}+ ` : ''}Model Context Protocol servers to extend your AI workspace
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium group-hover:bg-white/90 transition-colors">
              Explore Store
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

