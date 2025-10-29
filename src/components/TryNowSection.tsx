import Image from "next/image";
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
    <footer className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center mt-16">
      {/* Background Image */}
      <Image
        src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/img-fondo/Wallpaper.png"
        alt="Try Levante now"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* Download Button */}
      <div className="relative z-10">
        <button 
          onClick={handleDownload}
          disabled={!downloadUrl || isDownloading}
          className="bg-white text-black px-10 py-4 rounded-full text-base font-medium hover:bg-gray-100 transition-colors cursor-pointer shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <span className="animate-spin inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
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
