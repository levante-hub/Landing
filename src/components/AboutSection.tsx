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
          Levante is an open-source, MCP-native AI workspace that brings your models, tools, and data together in one secure desktop client.
        </p>

        <p className="text-white text-xl md:text-2xl leading-relaxed">
          Connect to any MCP server, run local or cloud models, and guide users with interactive apps while keeping workflows intuitive, observable, and under your control.
        </p>
      </div>

      {/* Signature */}
      <div className="text-white">
        <p className="text-base mb-1">Sincerely,</p>
        <p className="text-lg italic">
          The human team from minte and CLAi, from{" "}
          <span className="text-blue-400">Alicante</span> and{" "}
          <span className="text-blue-400">Granada</span>, Spain
        </p>
      </div>
    </section>
  );
};
