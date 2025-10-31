"use client";

import { useState } from "react";
import Image from "next/image";
import { safeCapture } from "@/lib/posthog";
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { LandingChatDemo } from "@/components/LandingChatDemo";
import { PartnersSection } from "@/components/PartnersSection";
import { BuiltWithSection } from "@/components/BuiltWithSection";
import { MeetTheTeamSection } from "@/components/MeetTheTeamSection";
import { AboutSection } from "@/components/AboutSection";
import { ContributeSection } from "@/components/ContributeSection";
import { TryNowSection } from "@/components/TryNowSection";
import { Questionnaire } from "@/components/questionnaire";
import { useLatestRelease } from "@/hooks/useLatestRelease";

export default function Home() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { downloadUrl, error: releaseError, platform } = useLatestRelease();

  // Track UTM parameters and handle social media deep links
  useUTMTracking();

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

  return (
    <div>
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Image src="/Logo.svg" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-normal">Levante</span>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollToSection("features")}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("team")}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            Team
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            About
          </button>
          <button
            onClick={openQuestionnaire}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            Contribute
          </button>
        </div>

        <button
          onClick={() => handleDownload("navbar")}
          disabled={!downloadUrl || isDownloading}
          className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </nav>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="relative min-h-[900px] rounded-2xl">
          {/* Background Image Container - Limited to top half */}
          <div className="absolute top-0 left-0 right-0 h-[55%] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/image-_4_.webp"
              alt="Background"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
              style={{ objectPosition: "center" }}
            />

            {/* Dark Overlay for contrast */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Gradient Overlay - darkens bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-[#222222] z-10" />
          </div>

          {/* Content Layer */}
          <div className="relative z-20 flex flex-col items-center justify-start pt-8 sm:pt-12 md:pt-14 px-4 sm:px-8">
            <h1 className="text-white text-center mb-4 text-3xl sm:text-4xl md:text-5xl font-medium leading-[115%] tracking-[-0.04em]">
              Implement MCPs easily
            </h1>

            <p className="text-white text-center mb-8 max-w-[450px] text-lg sm:text-xl">
              Join the open-source mission to democratize Model Context
              Protocols
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDownload("hero")}
                  disabled={!downloadUrl || isDownloading}
                  className="bg-white text-black rounded-full text-base font-medium flex items-center justify-center gap-2 min-w-[239px] h-[50px] px-6 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
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
            <div className="w-full max-w-[860px] px-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
                <LandingChatDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnersSection />

      {/* Features Section */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 01 */}
          <div className="relative rounded-xl overflow-hidden">
            {/* Background Image */}
            <Image
              src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/img-fondo/Group-1426344.webp"
              alt="Background 1"
              width={640}
              height={640}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              {/* Mockup Image */}
              <div className="flex-1 flex items-start justify-center pt-8">
                <div className="w-[85%] max-w-[500px]">
                  <Image
                    src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/img-fondo/Captura%20de%20pantalla%202025-10-29%20a%20las%2010.38.07.png"
                    alt="Feature 01 Mockup"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-white">
                <h3 className="text-2xl font-semibold mb-3">Add your own MCPs</h3>
                <p className="text-sm opacity-90">
                  Add your own custom MCPs to the platform or import them
                  directly from the integrated Store marketplace.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 02 */}
          <div className="relative rounded-xl overflow-hidden">
            {/* Background Image */}
            <Image
              src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/img-fondo/Group%201426344%20%281%29.png"
              alt="Background 2"
              width={640}
              height={640}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              {/* Mockup Image */}
              <div className="flex-1 flex items-start justify-center pt-8">
                <div className="w-[85%] max-w-[500px]">
                  <Image
                    src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/img-fondo/Captura%20de%20pantalla%202025-10-29%20a%20las%2010.40.45.png"
                    alt="Feature 02 Mockup"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-white">
                <h3 className="text-2xl font-semibold mb-3">Hundreds of models available</h3>
                <p className="text-sm opacity-90">
                  Select from hundreds of available AI models across multiple
                  providers to match your specific requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BuiltWithSection />

      <MeetTheTeamSection onOpenQuestionnaire={openQuestionnaire} />

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
