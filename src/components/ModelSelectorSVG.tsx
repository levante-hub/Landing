'use client';

import React, { useEffect, useState } from 'react';

export const ModelSelectorSVG = () => {
  const [step, setStep] = useState(0);
  const [searchText, setSearchText] = useState('');
  
  const models = [
    { name: "THUDM: GLM 4.1V 9B Thinking", context: "66k context" },
    { name: "Z.AI: GLM 4.5V", context: "66k context" },
    { name: "Z.AI: GLM 4.5", context: "131k context" },
    { name: "Z.AI: GLM 4.5 Air (free)", context: "131k context" },
    { name: "Z.AI: GLM 4.5 Air", context: "131k context" },
    { name: "Z.AI: GLM 4 32B", context: "131k context" },
  ];

  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      if (!isMounted) return;
      
      // Step 0: Initial state
      setStep(0);
      setSearchText('');
      await new Promise(r => setTimeout(r, 1500));

      if (!isMounted) return;
      // Step 1: Click button & Open dropdown
      setStep(1);
      await new Promise(r => setTimeout(r, 600));

      if (!isMounted) return;
      // Step 2-4: Type "GLM"
      setStep(2);
      const fullText = "GLM";
      for (let i = 1; i <= fullText.length; i++) {
        if (!isMounted) return;
        setSearchText(fullText.slice(0, i));
        await new Promise(r => setTimeout(r, 200));
      }
      await new Promise(r => setTimeout(r, 400));

      if (!isMounted) return;
      // Step 5: Show models (already handled by step >= 1 visually, but let's refine)
      setStep(3);
      await new Promise(r => setTimeout(r, 800));

      if (!isMounted) return;
      // Step 6: Hover over Z.AI: GLM 4.5V
      setStep(4);
      await new Promise(r => setTimeout(r, 3000));

      if (isMounted) sequence();
    };

    sequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-sans relative">
      <div className="w-full h-[264px] relative flex flex-col items-center justify-end">
        {/* Dropdown Menu */}
        <div 
          className={`w-full bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-out absolute bottom-[42px] ${
            step >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="3">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-[11px] text-gray-900 font-medium">
              {searchText}
              {step >= 2 && step < 3 && <span className="animate-pulse">|</span>}
            </span>
          </div>

          {/* Category */}
          <div className="px-2.5 pt-1.5 pb-0.5">
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Openrouter</span>
          </div>

          {/* Model List */}
          <div className="pb-0.5">
            {models.slice(0, 4).map((model, index) => (
              <div 
                key={model.name}
                className={`px-6 py-1 transition-colors duration-300 ${
                  step === 4 && index === 1 ? 'bg-gray-50' : ''
                }`}
              >
                <div className="text-[10px] font-bold text-gray-900 truncate">{model.name}</div>
                {model.context && (
                  <div className="text-[8px] text-gray-400 mt-0">{model.context}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trigger Button Area */}
        <div className="w-full flex items-stretch gap-1.5">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between shadow-sm">
            <span className="text-[10px] font-bold text-gray-900 truncate">IBM: Granite 4.0 M...</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="3">
              <path d="M7 10l5 5 5-5" />
            </svg>
          </div>
          <div className="bg-black rounded-lg px-3 flex items-center justify-center shadow-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Simulated Cursor for Step 1 (Opening) */}
      {step === 0 && (
        <div className="absolute right-[20px] bottom-0 transition-all duration-1000 animate-bounce z-20">
          <div className="w-4 h-4 rounded-full bg-black/20 animate-ping absolute -inset-1" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
            <path d="M0,0 L12,12 L7,12 L10,18 L8,19 L5,13 L0,18 Z" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  );
};

