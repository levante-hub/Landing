'use client';

import React, { useEffect, useState } from 'react';

export const ChristmasFrameDecorations = () => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(isSafariBrowser);
  }, []);

  const glowId = "url(#glow)";

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <radialGradient id="berryGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="100%" stopColor="#D32F2F" />
          </radialGradient>

          {/* Recorte para seguir las esquinas redondeadas del div principal */}
          <clipPath id="frameClip">
            <rect x="0" y="0" width="1200" height="800" rx="24" />
          </clipPath>
        </defs>

        {/* --- Marco que respeta el recorte --- */}
        <g clipPath="url(#frameClip)">
          {/* Superior */}
          <g transform="translate(0, -5)">
            {[...Array(20)].map((_, i) => (
              <path key={`f-t-${i}`} d="M0 0 Q20 -15 40 0 T80 0 T120 0" fill="#1B5E20" transform={`translate(${i * 65 - 20}, 10) scale(1.2)`} />
            ))}
            {[...Array(40)].map((_, i) => (
              <circle key={`b-t-${i}`} cx={i * 30 + 15} cy={12} r="2.5" fill="url(#berryGlow)" />
            ))}
          </g>

          {/* Inferior */}
          <g transform="translate(0, 790)">
            {[...Array(20)].map((_, i) => (
              <path key={`f-b-${i}`} d="M0 0 Q20 15 40 0 T80 0 T120 0" fill="#1B5E20" transform={`translate(${i * 65 - 20}, -5) scale(1.2)`} />
            ))}
            {[...Array(40)].map((_, i) => (
              <circle key={`b-b-${i}`} cx={i * 30 + 15} cy={-2} r="2.5" fill="url(#berryGlow)" />
            ))}
          </g>

          {/* Izquierda */}
          <g transform="translate(-5, 0)">
            {[...Array(15)].map((_, i) => (
              <path key={`f-l-${i}`} d="M0 0 Q-15 20 0 40 T0 80 T0 120" fill="#1B5E20" transform={`translate(10, ${i * 60 - 20}) scale(1.2)`} />
            ))}
            {[...Array(30)].map((_, i) => (
              <circle key={`b-l-${i}`} cx={12} cy={i * 30 + 15} r="2.5" fill="url(#berryGlow)" />
            ))}
          </g>

          {/* Derecha */}
          <g transform="translate(1190, 0)">
            {[...Array(15)].map((_, i) => (
              <path key={`f-r-${i}`} d="M0 0 Q15 20 0 40 T0 80 T0 120" fill="#1B5E20" transform={`translate(0, ${i * 60 - 20}) scale(1.2)`} />
            ))}
            {[...Array(30)].map((_, i) => (
              <circle key={`b-r-${i}`} cx={5} cy={i * 30 + 15} r="2.5" fill="url(#berryGlow)" />
            ))}
          </g>

          {/* Cable de luces siguiendo el borde interno */}
          <rect
            x="4"
            y="4"
            width="1192"
            height="792"
            rx="20"
            fill="none"
            stroke="#212121"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Bombillas perimetrales - Desactivadas en Safari para máximo rendimiento */}
          {!isSafari && [...Array(40)].map((_, i) => {
            let x = 0, y = 0;
            const step = i / 40;
            const perimeter = 2 * (1200 + 800);
            const pos = step * perimeter;

            if (pos <= 1200) { x = pos; y = 2; }
            else if (pos <= 1200 + 800) { x = 1198; y = pos - 1200; }
            else if (pos <= 2400 + 800) { x = 1200 - (pos - 2000); y = 798; }
            else { x = 2; y = 800 - (pos - 3200); }

            return (
              <circle
                key={`light-internal-${i}`}
                cx={x}
                cy={y}
                r={4}
                fill="#FFF176"
                filter={glowId}
                className="animate-pulse"
                style={{ animationDuration: `${1.5 + (i % 5) * 0.4}s` }}
              />
            );
          })}
        </g>

      </svg>
    </div>
  );
};

