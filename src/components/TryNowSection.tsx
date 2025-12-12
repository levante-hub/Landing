import { safeCapture } from '@/lib/posthog';

interface TryNowSectionProps {
  onDownload?: () => void;
  isDownloading?: boolean;
  downloadUrl?: string | null;
  getPlatformLabel?: () => string;
}

export const TryNowSection = ({
  onDownload,
  isDownloading = false,
  downloadUrl,
  getPlatformLabel
}: TryNowSectionProps) => {
  const titleText = "Try Levante";

  const handleDownload = () => {
    // Track download event
    safeCapture('download_button_clicked', { location: 'footer' });
    
    // Call parent download handler
    if (onDownload) {
      onDownload();
    }
  };

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
          className="text-black text-[3.65rem] md:text-[7rem] font-normal leading-tight typing-title"
          aria-label={titleText}
        >
          {titleText}
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
          75% {
            width: ${titleText.length}ch;
          }
          85% {
            width: ${titleText.length}ch;
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
          animation: typing 2.8s steps(${titleText.length}) infinite,
            caret 1s step-end infinite;
        }
      `}</style>
    </footer>
  );
};
