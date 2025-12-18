'use client';

import React, { useEffect, useState } from 'react';

export const InteractiveMCPAppsSVG = () => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [time, setTime] = useState('12:00 PM');

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 6);
    }, 1000);

    // Simulated clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(clockTimer);
    };
  }, []);

  // Calculate temp based on step
  const temp = Math.min(Math.round(step * 2.5), 10);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 450"
        className={`w-full h-full max-w-lg drop-shadow-2xl transition-all duration-[1000ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
          isVisible && step < 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Card Background */}
        <defs>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDFBF7" />
            <stop offset="100%" stopColor="#EAE3D2" />
          </linearGradient>
          
          <radialGradient id="sunGradient" cx="35%" cy="35%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </radialGradient>

          <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>

        <g transform="translate(50, 0)">
          <rect width="500" height="450" rx="24" fill="url(#cardGradient)" stroke="#D6CDBB" strokeWidth="1" />

          {/* Header Text */}
          <g transform="translate(40, 60)">
            <text fill="#334155" fontSize="36" fontWeight="700">Granada</text>
            <text fill="#64748B" fontSize="18" y="40">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {time}</text>
          </g>

          {/* Weather Icon (Animated Sun & Cloud) */}
          <g transform="translate(100, 220)">
            {/* Sun Rays */}
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="30s"
                repeatCount="indefinite"
              />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <rect
                  key={angle}
                  x="-3"
                  y="-75"
                  width="6"
                  height="22"
                  rx="3"
                  fill="#FDE047"
                  fillOpacity="0.6"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>

            {/* Sun Body with Glow */}
            <g filter="url(#sunGlow)">
              <circle r="45" fill="url(#sunGradient)" />
            </g>
            
            {/* Cloud */}
            <g transform="translate(-40, 10)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-40,10; -30,10; -40,10"
                dur="4s"
                repeatCount="indefinite"
              />
              <path
                d="M25,20 a20,20 0 0,1 0,-40 a25,25 0 0,1 45,-10 a20,20 0 0,1 25,20 a20,20 0 0,1 -20,20 Z"
                fill="white"
                fillOpacity="0.95"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))"
              />
            </g>
          </g>

          {/* Temperature Text */}
          <g transform="translate(320, 220)">
            <text fill="#1E293B" fontSize="96" fontWeight="700" textAnchor="middle">
              {temp}°C
            </text>
            <text fill="#64748B" fontSize="24" y="40" textAnchor="middle">Celsius</text>
          </g>

          {/* Bottom Glass Section */}
          <g transform="translate(40, 320)">
            <rect width="420" height="100" rx="20" fill="black" fillOpacity="0.03" stroke="#D6CDBB" strokeOpacity="0.5" />
            
            <g transform="translate(30, 35)">
              <text fill="#64748B" fontSize="14">Condition</text>
              <text fill="#334155" fontSize="24" fontWeight="600" y="30">Rainy</text>
            </g>

            <g transform="translate(390, 35)" textAnchor="end">
              <text fill="#64748B" fontSize="14">Humidity</text>
              <text fill="#334155" fontSize="24" fontWeight="600" y="30">56%</text>
            </g>
          </g>

          {/* Interactive "Native View" Indicators */}
          <circle cx="460" cy="40" r="6" fill="#10B981" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};

