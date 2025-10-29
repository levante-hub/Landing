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

  return (
    <section className="bg-[#222222] pt-4 pb-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-white text-center text-2xl font-medium mb-3">
          Our collaborators
        </h2>
        <p className="text-white/60 text-center text-base mb-8">
          Leading companies that trust in our vision
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="relative h-14 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={56}
                className={`object-contain w-auto ${index === 1 ? 'h-20' : 'h-14'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
