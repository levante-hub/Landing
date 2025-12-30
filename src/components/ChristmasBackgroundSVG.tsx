'use client';

import React, { useEffect, useState } from 'react';

export const ChristmasBackgroundSVG = () => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(isSafariBrowser);
  }, []);

  const filterId = "url(#softShadow)";
  const glowId = "url(#glow)";

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 w-full h-full -z-10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            @keyframes snowfall {
              0% { transform: translate3d(0, -20px, 0); opacity: 0; }
              10% { opacity: 0.8; }
              90% { opacity: 0.8; }
              100% { transform: translate3d(20px, 820px, 0); opacity: 0; }
            }
            .snow-flake {
              animation: snowfall linear infinite;
              fill: white;
              will-change: transform;
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
            }
            .star {
              animation: twinkle var(--duration) ease-in-out infinite;
            }
          `}
        </style>
        {/* Cielo con Gradiente Suave (Día) */}
        <linearGradient id="skyGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFF5E1" />
          <stop offset="100%" stopColor="#E3F2FD" />
        </linearGradient>

        {/* Nieve con Profundidad (Día) */}
        <linearGradient id="snowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DDEAF3" />
        </linearGradient>

        {/* Gradiente para el Follaje del Pino (Día) */}
        <linearGradient id="treeLeafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5C946E" />
          <stop offset="100%" stopColor="#2D5A27" />
        </linearGradient>

        {/* Sombra Suave */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
          <feOffset dx="0" dy="6" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Resplandor (Glow) */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Volumen para el Muñeco de Nieve (Día) */}
        <radialGradient id="snowmanVolume" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="80%" stopColor="#E6EEF5" />
          <stop offset="100%" stopColor="#CBDCEB" />
        </radialGradient>

        {/* Gradiente Caramelo (Candy Cane) */}
        <linearGradient id="candyGradient" x1="0%" y1="0%" x2="0%" y2="20%" spreadMethod="repeat">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="50%" stopColor="#D32F2F" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* 1. FONDO: Cielo (Día) */}
      <rect width="1200" height="800" fill="url(#skyGradient)" />

      {/* 1.5 Nieve cayendo (Optimizado con translate3d para fluidez - Desactivado en Safari) */}
      {!isSafari && (
        <g opacity="0.8">
          {[...Array(35)].map((_, i) => (
            <circle
              key={i}
              className="snow-flake"
              r={2.5 + (i % 3)}
              cx={(i * 37) % 1200}
              cy="-10"
              style={{
                animationDuration: `${12 + (i % 10)}s`,
                animationDelay: `${-(i * 1.3)}s`,
                opacity: 0.6 + ((i % 5) / 10)
              }}
            />
          ))}
        </g>
      )}

      {/* 2. ELEMENTOS ILUSTRATIVOS */}
      <g transform="translate(0, 400)">
        
        {/* Colinas Lejanas */}
        <path
          d="M-100 220 Q300 150 600 220 T1300 220 L1300 400 L-100 400 Z"
          fill="#F4F7F9"
          opacity="0.7"
        />

        {/* Plano Medio: Colina Principal */}
        <path
          d="M-100 300 Q200 230 500 300 T1300 300 L1300 400 L-100 400 Z"
          fill="url(#snowGradient)"
        />

        {/* Bastones de Caramelo */}
        <g transform="translate(950, 340) rotate(-15)">
          <path d="M0 60 L0 15 A15 15 0 0 1 30 15" stroke="url(#candyGradient)" strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(720, 370) rotate(10)">
          <path d="M0 50 L0 15 A15 15 0 0 1 30 15" stroke="url(#candyGradient)" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>

        {/* Muñeco de Nieve */}
        <g transform="translate(1050, 375) scale(0.65)" filter={filterId}>
          <circle cy="-40" r="55" fill="url(#snowmanVolume)" />
          <circle cy="-125" r="40" fill="url(#snowmanVolume)" />
          <circle cx="-22" cy="-120" r="8" fill="#FF8A80" opacity="0.4" />
          <circle cx="22" cy="-120" r="8" fill="#FF8A80" opacity="0.4" />
          <circle cx="-12" cy="-135" r="4" fill="#212121" />
          <circle cx="12" cy="-135" r="4" fill="#212121" />
          <path d="M-10 -110 Q0 -100 10 -110" stroke="#212121" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M0 -125 L15 -120 L0 -115 Z" fill="#FF9800" />
          <g transform="translate(0, -100)">
            <path d="M-42 0 Q0 15 42 0 L42 18 Q0 28 -42 18 Z" fill="#1B5E20" />
            <path d="M25 12 L50 55 L30 62 L10 18 Z" fill="#1B5E20" />
          </g>
          <g transform="translate(0, -165)">
            <path d="M-35 0 Q0 -60 45 15 L30 35 Q0 25 -35 25 Z" fill="#D32F2F" />
            <rect x="-40" y="10" width="80" height="20" rx="10" fill="#FFFFFF" />
            <circle cx="48" cy="22" r="12" fill="#FFFFFF" />
          </g>
        </g>

        {/* Montón de Regalos */}
        <g transform="translate(1080, 360)">
          <g transform="translate(0, 0) rotate(5)">
            <rect width="40" height="40" rx="4" fill="#43A047" />
            <rect x="17" width="6" height="40" fill="#D32F2F" />
            <rect y="17" width="40" height="6" fill="#D32F2F" />
          </g>
          <g transform="translate(-50, 10) rotate(-10)">
            <rect width="35" height="30" rx="4" fill="#FB8C00" />
            <rect x="14" width="7" height="30" fill="#FFFFFF" />
          </g>
          <g transform="translate(-15, -20) rotate(15)">
            <rect width="25" height="25" rx="3" fill="#039BE5" />
            <rect x="10" width="5" height="25" fill="#FFEE58" />
          </g>
        </g>
      </g>
    </svg>
  );
};
