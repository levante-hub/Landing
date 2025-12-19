'use client';

import React, { useEffect, useState } from 'react';

export const MCPNativeFeaturesSVG = ({ isInView = false }: { isInView?: boolean }) => {
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % 2); // Solo cicla entre 0 (Example) y 1 (Subir archivo)
    }, 1700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 450"
        className="w-full h-full max-w-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Side Menu Background */}
        <g className="drop-shadow-lg">
          <rect x="10" y="50" width="280" height="180" rx="12" fill="#FDFBF7" />
          <rect x="10" y="50" width="280" height="180" rx="12" stroke="#D6CDBB" strokeWidth="1" />
        </g>

        {/* Plus Button */}
        <g transform="translate(25, 65)">
          <circle cx="8" cy="8" r="12" fill="#EAE3D2" fillOpacity="0.3" className="animate-pulse" />
          <path d="M0 8h16M8 0v16" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Menu Items */}
        <g transform="translate(20, 100)">
          {/* Subir archivo */}
          <g transform="translate(0, 0)">
            <rect 
              x="-5" y="-5" width="270" height="40" rx="8" 
              fill="#EAE3D2" 
              className={`transition-opacity duration-400 ${activeItem === 1 ? 'opacity-40' : 'opacity-0'}`}
            />
            <path d="M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M16 6l-4-4-4 4M12 2v10" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 7) scale(0.8)" />
            <text x="32" y="22" fill="#1E293B" fontSize="14" fontWeight="500">Subir archivo</text>
          </g>

          {/* Example */}
          <g transform="translate(0, 45)">
            <rect 
              x="-5" y="-5" width="270" height="40" rx="8" 
              fill="#EAE3D2" 
              className={`transition-opacity duration-400 ${activeItem === 0 ? 'opacity-50' : 'opacity-0'}`}
            />
            <path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M4 7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M4 7h16M10 11h4" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 7) scale(0.8)" />
            <text x="32" y="22" fill="#1E293B" fontSize="14" fontWeight="500">Example</text>
            <path d="M9 18l6-6-6-6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(245, 8) scale(0.8)" />
          </g>

          {/* Context7 */}
          <g transform="translate(0, 90)">
            <path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M4 7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M4 7h16M10 11h4" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 7) scale(0.8)" />
            <text x="32" y="22" fill="#1E293B" fontSize="14" fontWeight="500">Context7</text>
            <path d="M9 18l6-6-6-6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(245, 8) scale(0.8)" />
          </g>
        </g>

        {/* Right Side Panel (Dropdown) */}
        <g 
          transform="translate(300, 20)"
          className={`transition-opacity duration-600 ${activeItem === 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          <g className="drop-shadow-xl">
            <rect x="0" y="0" width="280" height="410" rx="12" fill="#FDFBF7" />
            <rect x="0" y="0" width="280" height="410" rx="12" stroke="#D6CDBB" strokeWidth="1" />
          </g>

          {/* Prompts Section */}
          <text x="20" y="35" fill="#64748B" fontSize="12" fontWeight="600">Prompts</text>
          
          <g transform="translate(20, 60)">
            {/* code-review */}
            <g transform="translate(0, 0)">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2)" />
              <text x="35" y="15" fill="#1E293B" fontSize="14" fontWeight="600">code-review</text>
              <text x="35" y="32" fill="#64748B" fontSize="11">Help review code for best practice...</text>
            </g>

            {/* explain-concept */}
            <g transform="translate(0, 65)">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2)" />
              <text x="35" y="15" fill="#1E293B" fontSize="14" fontWeight="600">explain-concept</text>
              <text x="35" y="32" fill="#64748B" fontSize="11">Explain technical concepts in simp...</text>
            </g>

            {/* debug-helper */}
            <g transform="translate(0, 130)">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2)" />
              <text x="35" y="15" fill="#1E293B" fontSize="14" fontWeight="600">debug-helper</text>
              <text x="35" y="32" fill="#64748B" fontSize="11">Help debug code issues and errors</text>
            </g>
          </g>

          {/* Resources Section */}
          <text x="20" y="270" fill="#64748B" fontSize="12" fontWeight="600">Recursos</text>

          <g transform="translate(20, 300)">
            {/* server-config */}
            <g transform="translate(0, 0)">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2)" />
              <text x="35" y="15" fill="#1E293B" fontSize="14" fontWeight="600">server-config</text>
              <text x="35" y="32" fill="#64748B" fontSize="11">Current server configuration and s...</text>
            </g>

            {/* system-stats */}
            <g transform="translate(0, 65)">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2)" />
              <text x="35" y="15" fill="#1E293B" fontSize="14" fontWeight="600">system-stats</text>
              <text x="35" y="32" fill="#64748B" fontSize="11">Current system statistics and metr...</text>
            </g>
          </g>
        </g>

        {/* Simulated Cursor */}
        <g 
          className="transition-all duration-850 ease-in-out"
          style={{ 
            transform: `translate(${activeItem === 0 ? '220px, 165px' : '220px, 120px'})`,
            opacity: 1
          }}
        >
          <path 
            d="M0,0 L12,12 L7,12 L10,18 L8,19 L5,13 L0,18 Z" 
            fill="black" 
            stroke="white" 
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
};

