import Image from 'next/image';

export const PartnersSection = () => {
  const partners = [
    {
      name: 'Cloud Levante',
      logo: 'https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/logos%20empresas/Cloud-Levante.png',
    },
    {
      name: 'Minte',
      logo: '/minte-logo.svg',
    },
    {
      name: 'CLAi',
      logo: '/clai-logo.webp',
    },
    {
      name: 'Product Makers',
      logo: 'https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/logos%20empresas/logo_product_makers%20%281%29.png',
    },
  ];

  // Duplicate partners for seamless loop
  const marqueePartners = [...partners, ...partners];

  return (
    <section className="pt-12 pb-12 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-slate-900 text-center text-2xl font-medium mb-3">
          Our collaborators
        </h2>
        <p className="text-slate-600 text-center text-base mb-8">
          Leading companies that trust in our vision
        </p>
      </div>

      {/* Mobile Marquee */}
      <div className="md:hidden relative w-full">
        <div className="flex animate-marquee w-max">
          {marqueePartners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-8 h-10 flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={66}
                height={26}
                className={`object-contain grayscale opacity-60 ${index % partners.length === 2 ? '' : 'brightness-0'} ${index % partners.length === 1 ? 'h-3.5' : index % partners.length === 2 ? 'h-2.5' : 'h-3'}`}
                style={{ height: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Marquee */}
      <div className="hidden md:block relative w-full max-w-[400px] mx-auto overflow-hidden">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FEFEFE] to-transparent z-10 pointer-events-none" />
        
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FEFEFE] to-transparent z-10 pointer-events-none" />
        
        {/* Marquee container */}
        <div className="flex animate-marquee w-max">
          {marqueePartners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-12 h-10 flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={66}
                height={26}
                className={`object-contain grayscale opacity-60 ${[2, 3].includes(index % partners.length) ? '' : 'brightness-0'} ${index % partners.length === 1 ? 'h-5' : index % partners.length === 2 ? 'h-3' : index % partners.length === 3 ? 'h-5' : 'h-4'}`}
                style={{ height: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
