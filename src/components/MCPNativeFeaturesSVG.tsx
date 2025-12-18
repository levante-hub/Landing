'use client';

import React, { useEffect, useState } from 'react';

export const MCPNativeFeaturesSVG = () => {
  const [step, setStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 6);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 450"
        className={`w-full h-full max-w-lg transition-all duration-[1000ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
          isMounted && step < 5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Side Menu Background */}
        <g className="drop-shadow-lg">
          <rect x="10" y="50" width="280" height="180" rx="12" fill="white" />
          <rect x="10" y="50" width="280" height="180" rx="12" stroke="#E5E7EB" strokeWidth="1" />
        </g>

        {/* Plus Button */}
        <g transform="translate(25, 65)">
          <path d="M0 8h16M8 0v16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Menu Items */}
        <g transform="translate(20, 100)">
          {/* Subir archivo */}
          <g transform="translate(0, 0)">
            <path d="M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M16 6l-4-4-4 4M12 2v10" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2) scale(0.8)" />
            <text x="32" y="22" fill="#111827" fontSize="14" fontWeight="500">Subir archivo</text>
          </g>

          {/* example */}
          <g transform="translate(0, 45)">
            <rect 
              x="-5" y="-5" width="270" height="40" rx="8" 
              fill={step >= 1 ? "#F3F4F6" : "transparent"} 
              className="transition-colors duration-300 ease-in-out"
            />
            <path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M4 7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M4 7h16M10 11h4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2) scale(0.8)" />
            <text x="32" y="22" fill="#111827" fontSize="14" fontWeight="500">example</text>
            <path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(245, 8) scale(0.8)" />
          </g>

          {/* Context7 */}
          <g transform="translate(0, 90)">
            <path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M4 7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M4 7h16M10 11h4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2) scale(0.8)" />
            <text x="32" y="22" fill="#111827" fontSize="14" fontWeight="500">Context7</text>
            <path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(245, 8) scale(0.8)" />
          </g>
        </g>

        {/* Right Side Panel (Dropdown) */}
        <g 
          transform="translate(300, 20)" 
          className={`transition-all duration-300 ease-out ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
        >
          <g className="drop-shadow-xl">
            <rect x="0" y="0" width="280" height="410" rx="12" fill="white" />
            <rect x="0" y="0" width="280" height="410" rx="12" stroke="#E5E7EB" strokeWidth="1" />
          </g>

          {/* Prompts Section */}
          <text x="20" y="35" fill="#6B7280" fontSize="12" fontWeight="600">Prompts</text>
          
          <g transform="translate(20, 60)">
            {/* code-review */}
            <g transform="translate(0, 0)" className={`transition-opacity duration-200 ease-out ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(1)" />
              <text x="35" y="15" fill="#111827" fontSize="14" fontWeight="600">code-review</text>
              <text x="35" y="32" fill="#6B7280" fontSize="11">Help review code for best practice...</text>
            </g>

            {/* explain-concept */}
            <g transform="translate(0, 65)" className={`transition-opacity duration-200 ease-out delay-[40ms] ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(1)" />
              <text x="35" y="15" fill="#111827" fontSize="14" fontWeight="600">explain-concept</text>
              <text x="35" y="32" fill="#6B7280" fontSize="11">Explain technical concepts in simp...</text>
            </g>

            {/* debug-helper */}
            <g transform="translate(0, 130)" className={`transition-opacity duration-200 ease-out delay-[80ms] ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(1)" />
              <text x="35" y="15" fill="#111827" fontSize="14" fontWeight="600">debug-helper</text>
              <text x="35" y="32" fill="#6B7280" fontSize="11">Help debug code issues and errors</text>
            </g>
          </g>

          {/* Resources Section */}
          <text x="20" y="270" fill="#6B7280" fontSize="12" fontWeight="600">Recursos</text>

          <g transform="translate(20, 300)">
            {/* server-config */}
            <g transform="translate(0, 0)" className={`transition-opacity duration-200 ease-out delay-[120ms] ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="35" y="15" fill="#111827" fontSize="14" fontWeight="600">server-config</text>
              <text x="35" y="32" fill="#6B7280" fontSize="11">Current server configuration and s...</text>
            </g>

            {/* system-stats */}
            <g transform="translate(0, 65)" className={`transition-opacity duration-200 ease-out delay-[160ms] ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="35" y="15" fill="#111827" fontSize="14" fontWeight="600">system-stats</text>
              <text x="35" y="32" fill="#6B7280" fontSize="11">Current system statistics and metr...</text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

