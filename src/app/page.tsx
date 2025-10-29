import Image from "next/image";
import { LandingChatDemo } from "@/components/LandingChatDemo";
import { PartnersSection } from "@/components/PartnersSection";

export default function Home() {
  return (
    <div>
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="text-white text-lg font-normal">Levante</span>
        </div>

        <div className="flex items-center gap-8">
          <a href="#" className="text-white text-sm">Features</a>
          <a href="#" className="text-white text-sm">Features</a>
          <a href="#" className="text-white text-sm">Features</a>
          <a href="#" className="text-white text-sm">Features</a>
        </div>

        <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer">
          Download
          <span>↓</span>
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
              style={{ objectPosition: 'center' }}
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
              Join the open-source mission to democratize Model Context Protocols
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <button className="bg-white text-black rounded-full text-base font-medium flex items-center justify-center gap-2 w-[239px] h-[50px] hover:bg-gray-100 transition-colors cursor-pointer">
                Download
                <span>↓</span>
              </button>
              <a href="#" className="text-white text-base underline hover:no-underline transition-all">
                Start contributing
              </a>
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
    </div>
  );
}
