import Image from "next/image";
import posthog from 'posthog-js';

interface ContributeSectionProps {
  onOpenQuestionnaire: () => void
}

export const ContributeSection = ({ onOpenQuestionnaire }: ContributeSectionProps) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-16 mb-14 md:mb-20">
      <div className="relative rounded-xl overflow-hidden min-h-[500px] md:min-h-[600px]">
        {/* Background Image */}
        <Image
          src="https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/img-fondo/Rectangle%202594.png"
          alt="Alicante cityscape"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
          priority
        />

        {/* Content Card */}
        <div className="relative z-10 flex items-center min-h-[500px] md:min-h-[600px] p-8 md:p-12">
          <div className="bg-white rounded-xl p-8 md:p-12 max-w-[550px] shadow-xl">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/logo_negro.svg"
                alt="Levante Logo"
                width={60}
                height={60}
                className="w-[60px] h-[60px]"
              />
            </div>

            {/* Title */}
            <h2 className="text-black text-[22px] md:text-4xl font-medium mb-6 leading-tight">
              Levante is an open-source project funded by the community.
            </h2>

            {/* Subtitle */}
            <p className="text-black text-lg md:text-xl mb-8">
              Inspire, innovate, drive. Let's build Levante together
            </p>

            {/* CTA Button */}
            <button
              onClick={() => {
                posthog.capture('contribute_button_clicked');
                onOpenQuestionnaire();
              }}
              className="bg-black text-white px-10 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Contribute
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
