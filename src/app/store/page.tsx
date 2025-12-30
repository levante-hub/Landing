'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ExternalLink, Database, Code, FileText, Zap, MessageSquare, Briefcase, Package, Snowflake, type LucideIcon } from 'lucide-react';
import { useLatestRelease } from '@/hooks/useLatestRelease';
import { useDeepLink } from '@/hooks/useDeepLink';
import { safeCapture } from '@/lib/posthog';
import { TryNowSection } from '@/components/TryNowSection';
import { ChristmasBackgroundSVG } from '@/components/ChristmasBackgroundSVG';
import { ChristmasFrameDecorations } from '@/components/ChristmasFrameDecorations';
import { MCPInfoSheet } from '@/components/mcp/MCPInfoSheet';
import { MCPInstallButton } from '@/components/mcp/MCPInstallButton';
import { InstallPromptModal } from '@/components/mcp/InstallPromptModal';
import { MCPBadges } from '@/components/mcp/MCPBadges';
import { MCPServerExtended as MCPServer } from '@/lib/registry/types';

interface MCPStoreResponse {
  version: string;
  provider: {
    id: string;
    name: string;
    homepage?: string;
  };
  servers: MCPServer[];
}

const categoryIcons: Record<string, LucideIcon> = {
  documentation: FileText,
  development: Code,
  database: Database,
  automation: Zap,
  ai: MessageSquare,
  communication: MessageSquare,
  productivity: Briefcase,
  christmas: Snowflake,
  other: Package,
};

export default function MCPStorePage() {
  const [mcps, setMcps] = useState<MCPServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedMCP, setSelectedMCP] = useState<MCPServer | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [trackedChristmasView, setTrackedChristmasView] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(isSafariBrowser);
  }, []);
  const { downloadUrl, platform } = useLatestRelease();
  const { openDeepLink, isOpening, showFallback, closeFallback, currentMCP } = useDeepLink({
    detectProtocol: true,
  });
  const MCP_STORE_URL = process.env.NEXT_PUBLIC_MCP_STORE_URL || 'https://services.levanteapp.com/api/mcps.json';

  useEffect(() => {
    fetchMCPs();
  }, []);

  const fetchMCPs = async () => {
    try {
      const response = await fetch(MCP_STORE_URL);
      if (!response.ok) throw new Error('Failed to fetch MCPs');
      const data: MCPStoreResponse = await response.json();
      // Debug: inspeccionar qué viene en configuration/template desde la API
      if (process.env.NODE_ENV === 'development') {
        console.log('[MCPStore] Sample payload', {
          server0: data.servers?.[0],
          template0: data.servers?.[0]?.configuration?.template,
        });
      }
      setMcps(data.servers);
      const christmasCount = data.servers.filter(server => server.category === 'christmas').length;
      safeCapture('mcp_store_loaded', { count: data.servers.length, christmasCount });
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
  const christmasMCPs = mcps.filter(mcp => mcp.category === 'christmas');
  const nonChristmasMCPs = mcps.filter(mcp => mcp.category !== 'christmas');

  const filteredMCPs = nonChristmasMCPs.filter(mcp => {
    const categoryMatch = selectedCategory === 'all' || mcp.category === selectedCategory;
    const sourceMatch = selectedSource === 'all' || mcp.source === selectedSource;
    return categoryMatch && sourceMatch;
  });
  const showEmptyState = !loading && !error && filteredMCPs.length === 0 && selectedCategory !== 'christmas';

  useEffect(() => {
    if (!loading && !error && christmasMCPs.length > 0 && !trackedChristmasView) {
      safeCapture('christmas_section_viewed', { count: christmasMCPs.length });
      setTrackedChristmasView(true);
    }
  }, [loading, error, christmasMCPs.length, trackedChristmasView]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const focusChristmasSection = () => {
    const section = document.getElementById('christmas');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChristmasFilter = (source: string) => {
    setSelectedCategory('christmas');
    safeCapture('christmas_filter_clicked', { source });
    focusChristmasSection();
  };

  const openInfoSheet = (mcp: MCPServer) => {
    setSelectedMCP(mcp);
    setIsInfoOpen(true);
    safeCapture('mcp_info_opened', { mcp_id: mcp.id, mcp_name: mcp.name });
  };

  const closeInfoSheet = () => {
    setIsInfoOpen(false);
    setSelectedMCP(null);
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] text-slate-900">
      {/* Navigation */}
      <nav className="w-full fixed top-0 z-50 px-3 sm:px-4 py-1.5 sm:py-3">
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
          className={`fixed top-0 right-0 h-full w-[280px] bg-[#1a1a1a] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
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

      {/* Hero Section with Background */}
      <section className="relative w-full h-[80vh] -mt-[72px]">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/mcp-store.jpg"
            alt="MCP Store hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
            style={{ objectPosition: 'top' }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            MCP Store
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Discover and integrate Model Context Protocol servers to extend your AI workspace
          </p>
          {christmasMCPs.length > 0 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <style>
                {`
                  @keyframes candy-move {
                    0% { background-position: 0 0; }
                    100% { background-position: 28.28px 0; }
                  }
                  .animate-candy {
                    animation: candy-move 1.5s linear infinite;
                  }
                `}
              </style>
              <button
                onClick={() => handleChristmasFilter('hero_cta')}
                className="group relative p-1 rounded-[1.6rem] transition-all active:scale-95 flex items-center justify-center shadow-[0_7px_14px_-3px_rgba(0,0,0,0.3)] scale-[0.77] origin-center"
              >
                {/* Marco de bastón de caramelo grueso animado */}
                <div 
                  className="absolute inset-0 rounded-[1.3rem] border-[1px] border-[#8b0000] overflow-hidden animate-candy"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #d0021b, #d0021b 10px, #ffffff 10px, #ffffff 20px)',
                    backgroundSize: '28.28px 28.28px'
                  }}
                />
                
                {/* Contenido verde con textura de rayas (según imagen) */}
                <div 
                  className="relative text-white px-7 py-3 rounded-[1rem] text-base font-semibold flex items-center gap-2 shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)] border-2 border-[#2E7D32] overflow-hidden"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #43A047, #43A047 4px, #66BB6A 4px, #66BB6A 8px)',
                  }}
                >
                  {/* Brillo superior tipo gloss */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  
                  <Snowflake className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] fill-white/20" />
                  <span className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] whitespace-nowrap">
                    Explore Christmas MCPs
                  </span>
                </div>
              </button>
              <span className="text-white/80 text-xs font-medium drop-shadow-sm tracking-wide -mt-2">
                Seasonal kits for the holidays
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <div className="flex items-center gap-3">
            <label htmlFor="category-filter" className="text-sm font-medium text-black">
              Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                safeCapture('mcp_store_category_filtered', { category: e.target.value });
              }}
              className="pl-4 pr-14 py-2 rounded-lg text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
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
            <label htmlFor="source-filter" className="text-sm font-medium text-black">
              Source:
            </label>
            <select
              id="source-filter"
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                safeCapture('mcp_store_source_filtered', { source: e.target.value });
              }}
              className="pl-4 pr-14 py-2 rounded-lg text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="official">Official</option>
              <option value="community">Community</option>
            </select>
          </div>
        </div>

        {/* Christmas Highlight Section */}
        {!loading && !error && christmasMCPs.length > 0 && (
          <div id="christmas" className="relative mb-12 [transform:translateZ(0)]">
            <div className={`relative rounded-3xl p-6 sm:p-8 ${isSafari ? '' : 'shadow-[0_20px_60px_-40px_rgba(208,2,27,0.45)]'}`}>
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <ChristmasBackgroundSVG />
              </div>
              <ChristmasFrameDecorations />
              
              <div className="relative z-10 lg:grid lg:grid-cols-4 lg:gap-6 items-stretch">
                {/* Section Title - Takes 2 columns on desktop */}
                <div className="flex flex-col p-4 lg:p-6 lg:col-span-2 justify-center mb-8 lg:mb-0">
                  <div className="w-16 h-16 mb-6 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <defs>
                        <pattern id="giftDiagonalStripes" patternUnits="userSpaceOnUse" width="15" height="15" patternTransform="rotate(45)">
                          <rect width="7.5" height="15" fill="#7CB342" />
                          <rect x="7.5" width="7.5" height="15" fill="#8BC34A" />
                        </pattern>
                      </defs>
                      {/* Cuerpo del regalo */}
                      <rect width="100" height="100" rx="22" fill="url(#giftDiagonalStripes)" stroke="#558B2F" strokeWidth="1" />
                      
                      {/* Cintas rojas */}
                      <rect x="22" y="0" width="14" height="100" fill="#E53935" />
                      <rect x="0" y="22" width="100" height="14" fill="#E53935" />
                      
                      {/* Sombras de las cintas para efecto 3D */}
                      <rect x="22" y="0" width="2" height="100" fill="#000" opacity="0.1" />
                      <rect x="0" y="22" width="100" height="2" fill="#000" opacity="0.1" />

                      {/* Lazo (Moño) */}
                      <g transform="translate(29, 29)">
                        {/* Lazo izquierdo */}
                        <path 
                          d="M0 0 C-15 -20 -35 -15 -35 5 C-35 20 -15 10 0 0" 
                          fill="#D32F2F" 
                          stroke="#B71C1C" 
                          strokeWidth="1.5" 
                          transform="rotate(-15)"
                        />
                        {/* Lazo derecho */}
                        <path 
                          d="M0 0 C15 -20 35 -15 35 5 C35 20 15 10 0 0" 
                          fill="#D32F2F" 
                          stroke="#B71C1C" 
                          strokeWidth="1.5" 
                          transform="rotate(105)"
                        />
                        {/* Cintas colgantes */}
                        <path d="M-2 5 L-12 28 L-2 22 Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="0.5" />
                        <path d="M2 5 L12 28 L2 22 Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="0.5" />
                        {/* Nudo central */}
                        <rect x="-7" y="-7" width="14" height="14" rx="4" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
                        {/* Brillo en el nudo */}
                        <path d="M-3 -3 Q0 -5 3 -3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#d0021b] font-semibold">
                      Seasonal drop
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight">Christmas MCPs</h2>
                  </div>
                  <p className="text-sm md:text-lg text-slate-700 leading-relaxed">
                    Kits invernavidosos listos para usar: data, ecommerce y experiencias con temática navideña.
                  </p>
                </div>

                {/* Cards Container: Carousel on mobile, part of the main grid on desktop */}
                <div className="flex lg:contents overflow-x-auto pb-6 -mx-6 pl-10 pr-6 gap-5 snap-x snap-mandatory scrollbar-hide">
                  {christmasMCPs.map((mcp) => {
                    const Icon = categoryIcons[mcp.category] || Package;

                    return (
                      <div 
                        key={mcp.id} 
                        className="min-w-[75vw] sm:min-w-[320px] lg:min-w-0 snap-start snap-always lg:mb-6"
                      >
                        <div
                          className="relative bg-white border border-[#e5b8b8] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                          onClick={() => {
                            safeCapture('christmas_mcp_clicked', { mcp_id: mcp.id, source: 'christmas_section' });
                            openInfoSheet(mcp);
                          }}
                        >
                          <div className="relative flex items-start gap-4 mb-4">
                            {mcp.logoUrl ? (
                              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-[#e5b8b8] shadow-sm">
                                <img
                                  src={mcp.logoUrl}
                                  alt={mcp.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-[#fff0f0] border border-[#e5b8b8] flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-[#d0021b]" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                                {mcp.displayName || mcp.name}
                              </h3>
                              <MCPBadges mcp={mcp} showCategory={false} showSource={false} className="mt-2" />
                            </div>
                          </div>

                          <p className="relative text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">
                            {mcp.description}
                          </p>

                          <div className="relative flex items-center justify-between text-xs text-slate-500 mb-4">
                            <span className="capitalize">{mcp.transport}</span>
                            {mcp.version && <span>v{mcp.version}</span>}
                          </div>

                          <div className="relative mt-auto flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                safeCapture('christmas_mcp_clicked', { mcp_id: mcp.id, source: 'christmas_section_info' });
                                openInfoSheet(mcp);
                              }}
                              className="px-4 py-2 rounded-full bg-white text-[#d0021b] border border-[#e5b8b8] text-xs font-semibold hover:bg-[#fff0f0] transition-colors"
                            >
                              Ver info
                            </button>
                            <MCPInstallButton
                              mcp={mcp}
                              variant="default"
                              size="sm"
                              className="flex-1 justify-center bg-[#d0021b] hover:bg-[#b70117]"
                              openDeepLink={openDeepLink}
                              isOpeningOverride={currentMCP?.id === mcp.id ? isOpening : false}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}


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
              const isChristmas = mcp.category === 'christmas';

              return (
                <div
                  key={mcp.id}
                  className={`relative rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group ${isChristmas
                      ? 'bg-gradient-to-br from-emerald-50 via-white to-rose-50 border border-emerald-100 shadow-[0_12px_40px_-28px_rgba(16,185,129,0.6)]'
                      : 'bg-white border border-slate-200'
                    }`}
                  onClick={() => {
                    safeCapture('mcp_card_clicked', { mcp_id: mcp.id, mcp_name: mcp.name });
                    if (isChristmas) {
                      safeCapture('christmas_mcp_clicked', { mcp_id: mcp.id, source: 'grid' });
                    }
                    openInfoSheet(mcp);
                  }}
                >
                  {isChristmas && (
                    <span className="absolute -top-3 left-4 text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                      Christmas
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInfoSheet(mcp);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center bg-white hover:bg-slate-50 transition shadow-sm"
                    aria-label="Ver información"
                  >
                    <span className="text-sm font-semibold leading-none">i</span>
                  </button>
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
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${isChristmas ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-100'
                          }`}
                      >
                        <Icon className={`w-6 h-6 ${isChristmas ? 'text-emerald-600' : 'text-slate-600'}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-end gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-black transition-colors leading-tight">
                          {mcp.displayName || mcp.name}
                        </h3>
                        {mcp.maintainer?.name && (
                          <span className="text-xs text-slate-500 leading-tight pb-0.5">
                            by {mcp.maintainer.name}
                          </span>
                        )}
                      </div>
                      <MCPBadges mcp={mcp} className="mt-1" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {mcp.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                    <span className="capitalize">{mcp.transport}</span>
                    {mcp.version && <span>v{mcp.version}</span>}
                  </div>

                  <div className="mt-5">
                    <MCPInstallButton
                      mcp={mcp}
                      variant="default"
                      size="sm"
                      className={`w-full justify-center ${isChristmas ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                        }`}
                      openDeepLink={openDeepLink}
                      isOpeningOverride={currentMCP?.id === mcp.id ? isOpening : false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {showEmptyState && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">No MCPs found matching your filters</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <TryNowSection
        onDownload={handleDownload}
        isDownloading={isDownloading}
        downloadUrl={downloadUrl}
        getPlatformLabel={getPlatformLabel}
      />

      <InstallPromptModal
        isOpen={showFallback}
        onClose={closeFallback}
        mcpName={currentMCP?.displayName || currentMCP?.name}
        downloadUrl={downloadUrl}
      />

      <MCPInfoSheet
        mcp={selectedMCP}
        open={isInfoOpen}
        onClose={closeInfoSheet}
      />
    </div>
  );
}
