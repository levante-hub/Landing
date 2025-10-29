import Image from "next/image";

export const AboutSection = () => {
  return (
    <section id="about" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 mt-16">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo_waves.svg"
          alt="Levante Logo"
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </div>

      {/* Main Text */}
      <div className="space-y-6 mb-8">
        <p className="text-white text-xl md:text-2xl leading-relaxed">
          At Levante we have designed a suite of artificial intelligence tools specifically designed to boost e-commerce.
        </p>

        <p className="text-white text-xl md:text-2xl leading-relaxed">
          Our goal is to help you automate processes, improve customer experience, and make decisions based on real data, all from an intuitive and secure platform.
        </p>
      </div>

      {/* Signature */}
      <div className="text-white">
        <p className="text-base mb-1">Sincerely,</p>
        <p className="text-lg" style={{ fontFamily: 'Figma Hand, cursive' }}>
          El equipo humano de minte y CLAi, desde{" "}
          <span className="text-blue-400">Alicante</span> y{" "}
          <span className="text-blue-400">Granada</span> españa
        </p>
      </div>
    </section>
  );
};
