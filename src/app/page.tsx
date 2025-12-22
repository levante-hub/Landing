"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { safeCapture } from "@/lib/posthog";
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { LandingChatDemo } from "@/components/LandingChatDemo";
import { PartnersSection } from "@/components/PartnersSection";
import { BuiltWithSection } from "@/components/BuiltWithSection";
import { MCPStoreSection } from "@/components/MCPStoreSection";
import { AboutSection } from "@/components/AboutSection";
import { ContributeSection } from "@/components/ContributeSection";
import { TryNowSection } from "@/components/TryNowSection";
import { Questionnaire } from "@/components/questionnaire";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { MCPConfigurationSVG } from "@/components/MCPConfigurationSVG";
import { ModelSelectorSVG } from "@/components/ModelSelectorSVG";

export default function Home() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const router = useRouter();
  const { downloadUrl, error: releaseError, platform } = useLatestRelease();

  // Track UTM parameters and handle social media deep links
  useUTMTracking();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      observer.observe(featuresSection);
    }

    return () => {
      if (featuresSection) {
        observer.unobserve(featuresSection);
      }
    };
  }, []);

  useEffect(() => {
    // Prefetch feedback route so navigation feels instant
    router.prefetch("/feedback");
  }, [router]);

  const openQuestionnaire = () => {
    safeCapture("contribution_questionnaire_opened");
    setIsQuestionnaireOpen(true);
  };
  const closeQuestionnaire = () => setIsQuestionnaireOpen(false);

  const scrollToSection = (sectionId: string) => {
    safeCapture("section_navigated", { section_id: sectionId });
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownload = (location: "navbar" | "hero" | "footer") => {
    // Track download event with location
    safeCapture("download_button_clicked", { location });

    if (downloadUrl) {
      setIsDownloading(true);

      // Crear un elemento <a> temporal para forzar la descarga sin abrir nueva pestaña
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = ""; // Esto sugiere al navegador descargar en lugar de navegar
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset después de 2 segundos
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    }
  };

  const getPlatformLabel = () => {
    const labels = {
      windows: "Windows",
      "macos-intel": "Mac (Intel)",
      "macos-arm": "Mac (Apple Silicon)",
      linux: "Linux",
      unknown: "",
    };
    return labels[platform] || "";
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    closeMobileMenu();
  };

  return (
    <div className="bg-[#FEFEFE] text-slate-900">
      <nav className="w-full sticky top-0 z-50 px-3 sm:px-4 py-1.5 sm:py-3">
        <div className="mx-auto max-w-[45rem]">
          <div className="glass-nav nav-glow px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-3 rounded-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline">
              <Image src="/levante-logo.svg" alt="Logo" width={32} height={32} />
              <span className="text-slate-900 text-lg font-medium">Levante</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-700 text-sm hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-slate-700 text-sm hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer"
              >
                About
              </button>
              <a
                href="/store"
                className="text-slate-700 text-sm hover:text-slate-900 transition-colors no-underline"
              >
                MCP Store
              </a>
              <button
                onClick={openQuestionnaire}
                className="text-slate-700 text-sm hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer"
              >
                Contribute
              </button>
              <a
                href="/feedback"
                className="text-slate-700 text-sm hover:text-slate-900 transition-colors no-underline"
              >
                Feedback
              </a>
            </div>

            {/* Desktop CTA */}
            <button
              onClick={() => handleDownload("navbar")}
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-900 p-2 bg-transparent border-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-[280px] bg-[#1a1a1a] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link href="/" className="flex items-center gap-3 no-underline">
                <Image
                  src="/levante-logo.svg"
                  alt="Logo"
                  width={28}
                  height={28}
                />
                <span className="text-white text-base font-normal">Levante</span>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="text-white p-1 bg-transparent border-none cursor-pointer"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex flex-col py-4">
              <button
                onClick={() => handleNavClick("features")}
                className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick("team")}
                className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
              >
                About
              </button>
              <Link
                href="/store"
                prefetch
                className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline"
                onClick={closeMobileMenu}
              >
                MCP Store
              </Link>
              <button
                onClick={() => {
                  openQuestionnaire();
                  closeMobileMenu();
                }}
                className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
              >
                Contribute
              </button>
              <Link
                href="/feedback"
                prefetch
                className="text-white text-base py-4 px-6 text-left hover:bg-white/5 transition-colors no-underline"
                onClick={closeMobileMenu}
              >
                Feedback
              </Link>
            </div>

            {/* Mobile Download Button */}
            <div className="mt-auto p-6 border-t border-white/10">
              <button
                onClick={() => {
                  handleDownload("navbar");
                  closeMobileMenu();
                }}
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

      <section className="w-full -mt-[100px]">
        <div className="relative min-h-[740px] w-full overflow-hidden">
          {/* Background Image Container - Full hero */}
          <div className="absolute inset-0 overflow-hidden animate-hero-bg-fade">
            <Image
              src="/hero-levante.jpeg"
              alt="Levante hero background"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center"
            />

            {/* Gradient Overlay - fades to white at bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-white z-10" />
          </div>

          {/* Content Layer */}
          <div className="relative z-20 flex flex-col items-center justify-start pt-[10.5rem] sm:pt-[11.5rem] md:pt-[10.5rem] pb-10 sm:pb-14 md:pb-16 px-4 sm:px-8 w-full text-center" suppressHydrationWarning>
            <h1 className="text-white text-center mb-4 text-3xl sm:text-4xl md:text-5xl font-medium leading-[115%] tracking-[-0.04em] animate-hero-text-fade" suppressHydrationWarning>
              Use MCPs easily
            </h1>

            <p className="text-white text-center mb-8 max-w-[450px] text-lg sm:text-xl animate-hero-text-fade" suppressHydrationWarning>
              Join the open-source mission to democratize Model Context
              Protocols
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 animate-hero-text-fade">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDownload("hero")}
                  disabled={!downloadUrl || isDownloading}
                  className="bg-black text-white rounded-full text-base font-medium flex items-center justify-center gap-2 min-w-[239px] h-[50px] px-6 hover:bg-black/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      {getPlatformLabel()
                        ? `Download for ${getPlatformLabel()}`
                        : "Download"}
                      <span>↓</span>
                    </>
                  )}
                </button>
                {releaseError && (
                  <span className="text-red-400 text-xs mt-1">
                    {releaseError}
                  </span>
                )}
              </div>
              <button
                onClick={openQuestionnaire}
                className="text-white text-base underline hover:no-underline transition-all cursor-pointer bg-transparent border-none"
              >
                Start contributing
              </button>
            </div>

            {/* Product Mockup - Interactive Chat Component */}
            <div className="w-full max-w-[860px] px-4 animate-hero-image-fade">
              <LandingChatDemo />
            </div>
          </div>
        </div>
      </section>

      <PartnersSection />

      {/* Features Section */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-4 md:pb-6 mt-6 md:mt-16"
        suppressHydrationWarning
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Feature 01 */}
          <div className={`relative rounded-xl overflow-hidden min-h-[546px] sm:min-h-[624px] md:min-h-[600px] transition-all duration-800 ${
            featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } delay-100`}>
            {/* Background Image */}
            <Image
              src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/Group%201426350.jpg"
              alt="Background 1"
              width={640}
              height={640}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover absolute inset-0"
            />

            {/* Dark Overlay (10%) */}
            <div className="absolute inset-0 bg-black/10 z-0" />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 md:p-8">
              {/* Mockup Image Area */}
              <div className="flex-1 flex items-center justify-center overflow-visible">
                <div className="w-full max-w-[400px] aspect-[1/1] sm:aspect-[1.4/1] relative">
                  <MCPConfigurationSVG />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-white mt-auto">
                <h3 className="text-xl sm:text-2xl md:text-2xl font-semibold mb-2 md:mb-3">Add your own MCPs</h3>
                <p className="text-sm sm:text-sm opacity-90">
                  Add your own custom MCPs to the platform or import them
                  directly from the integrated Store marketplace.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 02 */}
          <div className={`relative rounded-xl overflow-hidden min-h-[546px] sm:min-h-[624px] md:min-h-[600px] transition-all duration-800 ${
            featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } delay-300`}>
            {/* Background Image */}
            <Image
              src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/img-fondo/Group%201426344%20%281%29.png"
              alt="Background 2"
              width={640}
              height={640}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover absolute inset-0"
            />

            {/* Dark Overlay (10%) */}
            <div className="absolute inset-0 bg-black/10 z-0" />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 md:p-8">
              {/* Mockup Image Area */}
              <div className="flex-1 flex items-center justify-center overflow-visible">
                <div className="w-full max-w-[400px] aspect-[1.4/1] relative">
                  <ModelSelectorSVG />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-white mt-auto">
                <h3 className="text-xl sm:text-2xl md:text-2xl font-semibold mb-2 md:mb-3">Hundreds of models available</h3>
                <p className="text-sm sm:text-sm opacity-90">
                  Select from hundreds of available AI models across multiple
                  providers to match your specific requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MCP Store Card - Full Width */}
        <MCPStoreSection />
      </section>

      <BuiltWithSection />

      <AboutSection />

      <ContributeSection onOpenQuestionnaire={openQuestionnaire} />

      <TryNowSection
        onDownload={() => handleDownload("footer")}
        isDownloading={isDownloading}
        downloadUrl={downloadUrl}
        getPlatformLabel={getPlatformLabel}
      />

      <Questionnaire
        isOpen={isQuestionnaireOpen}
        onClose={closeQuestionnaire}
      />
    </div>
  );
}
