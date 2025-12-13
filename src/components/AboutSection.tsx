'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, []);

  return (
    <section 
      id="about" 
      className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 mt-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
      }`}
    >
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
        <p className="text-slate-900 text-xl md:text-2xl leading-relaxed">
          Levante is an open-source, MCP-native AI workspace that brings your models, tools, and data together in one secure desktop client.
        </p>

        <p className="text-slate-900 text-xl md:text-2xl leading-relaxed">
          Connect to any MCP server, run local or cloud models, and guide users with interactive apps while keeping workflows intuitive, observable, and under your control.
        </p>
      </div>

      {/* Signature */}
      <div className="text-slate-900">
        <p className="text-base mb-1">Sincerely,</p>
        <p className="text-lg italic">
          The human team from Alicante and Granada, Spain
        </p>
      </div>
    </section>
  );
};
