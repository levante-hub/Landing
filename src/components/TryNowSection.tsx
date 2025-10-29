import Image from "next/image";
import { safeCapture } from '@/lib/posthog';

export const TryNowSection = () => {
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
          onClick={() => safeCapture('download_button_clicked', { location: 'footer' })}
          className="bg-white text-black px-10 py-4 rounded-full text-base font-medium hover:bg-gray-100 transition-colors cursor-pointer shadow-lg flex items-center gap-2"
        >
          Download
          <span>↓</span>
        </button>
      </div>
    </footer>
  );
};
