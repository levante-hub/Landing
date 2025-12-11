import Image from 'next/image';

export const PartnersSection = () => {
  const partners = [
    {
      name: 'Cloud Levante',
      logo: 'https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/logos%20empresas/Cloud-Levante.png',
    },
    {
      name: 'Partner 2',
      logo: 'https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/logos%20empresas/Logo%20completo%20PNG.png',
    },
    {
      name: 'Minte',
      logo: 'https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/logos%20empresas/logo-minte-white%20%281%29.png',
    },
    {
      name: 'Product Makers',
      logo: 'https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/logos%20empresas/logo_product_makers%20%281%29.png',
    },
  ];

  // Duplicate partners for seamless loop
  const marqueePartners = [...partners, ...partners];

  return (
    <section className="pt-4 pb-12 overflow-hidden">
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
        <div className="flex animate-marquee">
          {marqueePartners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-8 h-14 flex items-center justify-center opacity-70"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={48}
                className={`object-contain w-auto grayscale ${index % partners.length === 1 ? 'h-16' : 'h-12'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="relative h-14 flex items-center justify-center opacity-70"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={56}
                  className={`object-contain w-auto grayscale ${index === 1 ? 'h-20' : 'h-14'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
