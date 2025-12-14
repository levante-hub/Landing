'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ExternalLink, Database, Code, FileText, Zap, MessageSquare, Briefcase, Package } from 'lucide-react';
import { useLatestRelease } from '@/hooks/useLatestRelease';
import { safeCapture } from '@/lib/posthog';

interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  logoUrl?: string;
  source: 'official' | 'community';
  transport: 'stdio' | 'sse' | 'streamable-http';
  status?: 'active' | 'deprecated' | 'experimental';
  version?: string;
  maintainer?: {
    name: string;
    url?: string;
    github?: string;
  };
  metadata?: {
    homepage?: string;
    repository?: string;
    author?: string;
  };
}

interface MCPStoreResponse {
  version: string;
  provider: {
    id: string;
    name: string;
    homepage?: string;
  };
  servers: MCPServer[];
}

const categoryIcons: Record<string, any> = {
  documentation: FileText,
  development: Code,
  database: Database,
  automation: Zap,
  ai: MessageSquare,
  communication: MessageSquare,
  productivity: Briefcase,
  other: Package,
};

const categoryColors: Record<string, string> = {
  documentation: 'bg-blue-100 text-blue-700 border-blue-200',
  development: 'bg-purple-100 text-purple-700 border-purple-200',
  database: 'bg-green-100 text-green-700 border-green-200',
  automation: 'bg-orange-100 text-orange-700 border-orange-200',
  ai: 'bg-pink-100 text-pink-700 border-pink-200',
  communication: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  productivity: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function MCPStorePage() {
  const [mcps, setMcps] = useState<MCPServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { downloadUrl, platform } = useLatestRelease();

  useEffect(() => {
    fetchMCPs();
  }, []);

  const fetchMCPs = async () => {
    try {
      const response = await fetch('https://services.levanteapp.com/api/mcps.json');
      if (!response.ok) throw new Error('Failed to fetch MCPs');
      const data: MCPStoreResponse = await response.json();
      setMcps(data.servers);
      safeCapture('mcp_store_loaded', { count: data.servers.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load MCPs');
      safeCapture('mcp_store_error', { error: err });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    safeCapture('download_button_clicked', { location: 'mcp_store' });
    if (downloadUrl) {
      setIsDownloading(true);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = '';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  const getPlatformLabel = () => {
    const labels: Record<string, string> = {
      windows: 'Windows',
      'macos-intel': 'Mac (Intel)',
      'macos-arm': 'Mac (Apple Silicon)',
      linux: 'Linux',
      unknown: '',
    };
    return labels[platform] || '';
  };

  const categories = ['all', ...Array.from(new Set(mcps.map(mcp => mcp.category)))];
  
  const filteredMCPs = mcps.filter(mcp => {
    const categoryMatch = selectedCategory === 'all' || mcp.category === selectedCategory;
    const sourceMatch = selectedSource === 'all' || mcp.source === selectedSource;
    return categoryMatch && sourceMatch;
  });

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#FEFEFE] text-slate-900">
      {/* Navigation */}
      <nav className="w-full sticky top-0 z-50 px-3 sm:px-4 py-1.5 sm:py-3 bg-[#FEFEFE]/80 backdrop-blur-md">
        <div className="mx-auto max-w-[45rem]">
          <div className="glass-nav nav-glow px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-3 rounded-full">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <Image src="/levante-logo.svg" alt="Logo" width={32} height={32} />
              <span className="text-slate-900 text-lg font-medium">Levante</span>
            </Link>

            <div className="hidden md:flex items-center gap-5">
              <Link href="/#features" className="text-slate-700 text-sm hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="/#team" className="text-slate-700 text-sm hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link href="/store" className="text-slate-900 text-sm font-medium">
                MCP Store
              </Link>
              <button
                onClick={() => {
                  safeCapture('contribution_questionnaire_opened', { location: 'mcp_store_nav' });
                  // Redirigir a home y abrir el cuestionario
                  window.location.href = '/#contribute';
                }}
                className="text-slate-700 text-sm hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer"
              >
                Contribute
              </button>
              <Link href="/feedback" className="text-slate-700 text-sm hover:text-slate-900 transition-colors">
                Feedback
              </Link>
            </div>

            <button
              onClick={handleDownload}
              disabled={!downloadUrl || isDownloading}
              className="hidden md:flex bg-black text-white px-6 py-2 rounded-full text-sm font-medium items-center gap-2 cursor-pointer hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Downloading...
                </>
              ) : (
                <>
                  Download
                  <span>↓</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-900 p-2 bg-transparent border-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={closeMobileMenu} />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-[280px] bg-[#1a1a1a] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link href="/" className="flex items-center gap-3 no-underline" onClick={closeMobileMenu}>
                <Image src="/levante-logo.svg" alt="Logo" width={28} height={28} />
                <span className="text-white text-base font-normal">Levante</span>
              </Link>
              <button onClick={closeMobileMenu} className="text-white p-1 bg-transparent border-none cursor-pointer">
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col py-4">
              <Link href="/#features" onClick={closeMobileMenu} className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline">
                Features
              </Link>
              <Link href="/#team" onClick={closeMobileMenu} className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline">
                About
              </Link>
              <Link href="/store" onClick={closeMobileMenu} className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline">
                MCP Store
              </Link>
              <button
                onClick={() => {
                  safeCapture('contribution_questionnaire_opened', { location: 'mcp_store_mobile_nav' });
                  closeMobileMenu();
                  window.location.href = '/#contribute';
                }}
                className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
              >
                Contribute
              </button>
              <Link href="/feedback" onClick={closeMobileMenu} className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline">
                Feedback
              </Link>
            </div>

            <div className="mt-auto p-6 border-t border-white/10">
              <button
                onClick={() => { handleDownload(); closeMobileMenu(); }}
                disabled={!downloadUrl || isDownloading}
                className="w-full bg-white text-black px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    Downloading...
                  </>
                ) : (
                  <>
                    Download
                    <span>↓</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
            MCP Store
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Discover and integrate Model Context Protocol servers to extend your AI workspace
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <div className="flex items-center gap-3">
            <label htmlFor="category-filter" className="text-sm font-medium text-slate-700">
              Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                safeCapture('mcp_store_category_filtered', { category: e.target.value });
              }}
              className="pl-4 pr-10 py-2 rounded-lg text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category} className="capitalize">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="source-filter" className="text-sm font-medium text-slate-700">
              Source:
            </label>
            <select
              id="source-filter"
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                safeCapture('mcp_store_source_filtered', { source: e.target.value });
              }}
              className="pl-4 pr-10 py-2 rounded-lg text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="official">Official</option>
              <option value="community">Community</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* MCP Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMCPs.map((mcp) => {
              const Icon = categoryIcons[mcp.category] || Package;
              const categoryColor = categoryColors[mcp.category] || categoryColors.other;

              return (
                <div
                  key={mcp.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    safeCapture('mcp_card_clicked', { mcp_id: mcp.id, mcp_name: mcp.name });
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {mcp.logoUrl ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img
                          src={mcp.logoUrl}
                          alt={mcp.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-slate-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-black transition-colors">
                        {mcp.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full border ${categoryColor}`}>
                          {mcp.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          mcp.source === 'official' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}>
                          {mcp.source}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {mcp.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize">{mcp.transport}</span>
                    {mcp.version && <span>v{mcp.version}</span>}
                  </div>

                  {mcp.maintainer && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">by {mcp.maintainer.name}</span>
                        {mcp.maintainer.url && (
                          <a
                            href={mcp.maintainer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              safeCapture('mcp_maintainer_link_clicked', { mcp_id: mcp.id });
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMCPs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">No MCPs found matching your filters</p>
          </div>
        )}
      </section>
    </div>
  );
}

