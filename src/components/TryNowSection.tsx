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
  const handleDownload = () => {
    // Track download event
    safeCapture('download_button_clicked', { location: 'footer' });
    
    // Call parent download handler
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <footer className="relative w-full min-h-[700px] md:min-h-[850px] flex items-center justify-center mt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h2 className="text-black text-[4.3rem] md:text-[7rem] font-normal leading-tight">
          Try Levante
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
    </footer>
  );
};
