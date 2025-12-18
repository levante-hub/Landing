'use client';

import React, { useEffect, useState } from 'react';

export const InteractiveMCPAppsSVG = () => {
  const [temp, setTemp] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [time, setTime] = useState('12:00 PM');

  useEffect(() => {
    setIsVisible(true);
    
    // Animate temperature from 0 to 10
    const duration = 2000;
    const steps = 10;
    const interval = duration / steps;
    let currentTemp = 0;
    
    const tempTimer = setInterval(() => {
      if (currentTemp < 10) {
        currentTemp += 1;
        setTemp(currentTemp);
      } else {
        clearInterval(tempTimer);
      }
    }, interval);

    // Simulated clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 60000);

    return () => {
      clearInterval(tempTimer);
      clearInterval(clockTimer);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 500 450"
        className={`w-full h-full max-w-md drop-shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Card Background */}
        <defs>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5D72E5" />
            <stop offset="100%" stopColor="#8E54B1" />
          </linearGradient>
          
          <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>

        <rect width="500" height="450" rx="24" fill="url(#cardGradient)" />

        {/* Header Text */}
        <g transform="translate(40, 60)">
          <text fill="white" fontSize="36" fontWeight="700">Granada</text>
          <text fill="white" fillOpacity="0.8" fontSize="18" y="40">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {time}</text>
        </g>

        {/* Weather Icon (Animated Sun & Cloud) */}
        <g transform="translate(80, 220)">
          {/* Sun */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="20s"
              repeatCount="indefinite"
            />
            <circle r="45" fill="#FFD700" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={angle}
                x="-4"
                y="-65"
                width="8"
                height="20"
                rx="4"
                fill="#FFD700"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>
          
          {/* Cloud */}
          <g transform="translate(-30, 0)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-30,0; -20,0; -30,0"
              dur="4s"
              repeatCount="indefinite"
            />
            <path
              d="M25,20 a20,20 0 0,1 0,-40 a25,25 0 0,1 45,-10 a20,20 0 0,1 25,20 a20,20 0 0,1 -20,20 Z"
              fill="white"
              fillOpacity="0.9"
            />
          </g>
        </g>

        {/* Temperature Text */}
        <g transform="translate(320, 220)">
          <text fill="white" fontSize="96" fontWeight="700" textAnchor="middle">
            {temp}°C°
          </text>
          <text fill="white" fillOpacity="0.8" fontSize="24" y="40" textAnchor="middle">Celsius</text>
        </g>

        {/* Bottom Glass Section */}
        <g transform="translate(40, 320)">
          <rect width="420" height="100" rx="20" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
          
          <g transform="translate(30, 35)">
            <text fill="white" fillOpacity="0.6" fontSize="14">Condition</text>
            <text fill="white" fontSize="24" fontWeight="600" y="30">Rainy</text>
          </g>

          <g transform="translate(390, 35)" textAnchor="end">
            <text fill="white" fillOpacity="0.6" fontSize="14">Humidity</text>
            <text fill="white" fontSize="24" fontWeight="600" y="30">56%%</text>
          </g>
        </g>

        {/* Interactive "Native View" Indicators */}
        <circle cx="460" cy="40" r="6" fill="#4ADE80" className="animate-pulse" />
      </svg>
    </div>
  );
};

