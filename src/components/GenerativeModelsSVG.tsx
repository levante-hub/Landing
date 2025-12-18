'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export const GenerativeModelsSVG = () => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const fullText = "a man walking his dog on the street";

  useEffect(() => {
    const sequence = async () => {
      // Step 0: Initial wait
      setStep(0);
      setTypedText('');
      await new Promise(r => setTimeout(r, 800));

      // Step 1: Show bubble
      setStep(1);
      await new Promise(r => setTimeout(r, 400));

      // Step 2: Typing animation
      setStep(2);
      for (let i = 0; i <= fullText.length; i++) {
        setTypedText(fullText.slice(0, i));
        await new Promise(r => setTimeout(r, 40));
      }
      await new Promise(r => setTimeout(r, 300));

      // Step 3: Show image
      setStep(3);
      await new Promise(r => setTimeout(r, 4000));

      // Loop
      sequence();
    };

    sequence();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg aspect-square bg-transparent">
        {/* User Message Bubble */}
        <div 
          className={`absolute top-[5%] left-[5%] max-w-[90%] transition-all duration-500 ease-out ${
            step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-[#F3F4F6] text-slate-900 px-6 py-3 rounded-full shadow-sm inline-block">
            <p className="text-sm md:text-base font-medium border-r-2 border-slate-900 animate-caret">
              {typedText}
              {step === 2 && typedText.length < fullText.length && <span className="opacity-0">|</span>}
            </p>
          </div>
        </div>

        {/* Generated Image */}
        <div 
          className={`absolute top-[20%] left-[5%] w-[90%] transition-all duration-700 ease-out ${
            step >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden">
            <Image 
              src="/person-walking-dog.png"
              alt="Man walking his dog on the street"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes caret {
            from, to { border-color: transparent }
            50% { border-color: currentColor }
          }
          .animate-caret {
            animation: caret 0.8s step-end infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

