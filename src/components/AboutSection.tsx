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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div 
        id="about" 
        className={`px-8 sm:px-12 md:px-16 py-16 mt-16 bg-[#FBFBFB] rounded-3xl transition-all duration-1000 ${
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
            className="w-20 h-20 animate-rotate-full"
          />
        </div>

        {/* Main Text */}
        <div className="space-y-6 mb-16 max-w-full md:max-w-[60%]">
          <p className="text-slate-900 text-xl md:text-2xl leading-relaxed">
            Levante is an open-source, MCP-native AI workspace that brings your models, tools, and data together in one secure desktop client.
          </p>

          <p className="text-slate-900 text-xl md:text-2xl leading-relaxed">
            Connect to any MCP server, run local or cloud models, and guide users with interactive apps while keeping workflows intuitive, observable, and under your control.
          </p>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-16 max-w-3xl">
          {[
            {
              name: "Saúl Gómez",
              image: "/saul-img.png",
              linkedin: "https://www.linkedin.com/in/saul-gomez-jimenez-47b30328b/"
            },
            {
              name: "Oliver Montes",
              image: "/oliver-img.png",
              linkedin: "https://www.linkedin.com/in/olivermontes/"
            },
            {
              name: "Alejandro Gómez",
              image: "/Alejandro-img.png",
              linkedin: "https://www.linkedin.com/in/alejandro-gomez-cerezo/"
            },
            {
              name: "Dennis Montes",
              image: "/dennis-img.png",
              linkedin: "https://www.linkedin.com/in/dennis-montes/"
            }
          ].map((member) => (
            <div key={member.name} className="flex flex-col items-start gap-2">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shadow transition-all duration-300">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-slate-900 text-base font-medium leading-tight">{member.name}</h3>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-900 text-xs transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Signature */}
        <div className="text-slate-900">
          <p className="text-base mb-1">Sincerely,</p>
          <p className="text-lg italic">
            The human team from Alicante and Granada, Spain
          </p>
        </div>
      </div>
    </section>
  );
};
