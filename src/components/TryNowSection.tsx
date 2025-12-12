"use client";

import { useState, useEffect } from 'react';
import { safeCapture } from '@/lib/posthog';

interface TryNowSectionProps {
  onDownload?: () => void;
  isDownloading?: boolean;
  downloadUrl?: string | null;
  getPlatformLabel?: () => string;
}

const titles = [
  "Try Levante",
  "Join our community",
  "Your AI Workspace",
  "Powered by open-source",
];

export const TryNowSection = ({
  onDownload,
  isDownloading = false,
  downloadUrl,
  getPlatformLabel
}: TryNowSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTitle = titles[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 2800); // Match animation duration

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    safeCapture('download_button_clicked', { location: 'footer' });
    if (onDownload) {
      onDownload();
    }
  };

  // Find the longest title for consistent width
  const maxLength = Math.max(...titles.map(t => t.length));

  return (
    <footer
      className="relative w-full min-h-[600px] md:min-h-[850px] flex items-start justify-center mt-32 md:mt-48 bg-white"
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/levante-footer.jpg')",
          backgroundSize: "100% auto",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center pt-0 md:pt-0 -translate-y-16 md:-translate-y-28">
        <h2
          key={currentIndex}
          className="text-black text-[3.65rem] md:text-[7rem] font-normal leading-tight typing-title"
          aria-label={currentTitle}
        >
          {currentTitle}
        </h2>
        {/* Download Button */}
        <button 
          onClick={handleDownload}
          disabled={!downloadUrl || isDownloading}
          className="bg-black text-white px-10 py-4 rounded-full text-sm md:text-base font-medium hover:bg-gray-900 transition-colors cursor-pointer shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Downloading...
            </>
          ) : (
            <>
              {getPlatformLabel && getPlatformLabel() ? `Download for ${getPlatformLabel()}` : 'Download'}
              <span>↓</span>
            </>
          )}
        </button>
      </div>
      <style jsx>{`
        @keyframes typing {
          0% {
            width: 0;
          }
          70% {
            width: ${currentTitle.length}ch;
          }
          85% {
            width: ${currentTitle.length}ch;
          }
          100% {
            width: 0;
          }
        }
        @keyframes caret {
          50% {
            border-color: transparent;
          }
        }
        .typing-title {
          white-space: nowrap;
          overflow: hidden;
          border-right: 3px solid currentColor;
          animation: typing 2.8s steps(${currentTitle.length}) forwards,
            caret 1s step-end infinite;
        }
      `}</style>
    </footer>
  );
};
