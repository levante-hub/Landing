'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Code, ChevronDown, CheckCircle2 } from 'lucide-react';

export const MCPConfigurationSVG = () => {
  const [serverName, setServerName] = useState('');
  const [url, setUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(0);

  const fullServerName = "mcp-levante";
  const fullUrl = "https://levanteapp.com/mcp";

  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      if (!isMounted) return;

      // Reset
      setServerName('');
      setUrl('');
      setIsSuccess(false);
      setStep(0);
      await new Promise(r => setTimeout(r, 1000));

      // Type Server Name
      if (!isMounted) return;
      for (let i = 1; i <= fullServerName.length; i++) {
        if (!isMounted) return;
        setServerName(fullServerName.slice(0, i));
        await new Promise(r => setTimeout(r, 80));
      }
      await new Promise(r => setTimeout(r, 500));

      // Type URL
      if (!isMounted) return;
      for (let i = 1; i <= fullUrl.length; i++) {
        if (!isMounted) return;
        setUrl(fullUrl.slice(0, i));
        await new Promise(r => setTimeout(r, 50));
      }
      await new Promise(r => setTimeout(r, 800));

      // Click Add Server
      if (!isMounted) return;
      setStep(1); // Visual click state
      await new Promise(r => setTimeout(r, 200));
      setIsSuccess(true);
      
      // Pause at the end
      await new Promise(r => setTimeout(r, 3500));
      if (isMounted) sequence();
    };

    sequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-sans relative group">
      <div className="w-full h-[264px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col p-1 relative">
        {/* Header */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-start">
          <h3 className="text-[13px] font-bold text-gray-900 leading-tight tracking-tight">Add MCP Integration</h3>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2 flex gap-1.5">
          <div className="flex-1 flex bg-[#F3F4F6] rounded-md p-0.5">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-gray-900 bg-white shadow-sm rounded">
              <FileText size={12} strokeWidth={2.5} />
              Form
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-gray-500 rounded">
              <Code size={12} strokeWidth={2.5} />
              JSON
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 py-2 flex flex-col flex-1 gap-3">
          {/* Server Name Field */}
          <div>
            <label className="text-[11px] font-medium text-gray-900 mb-1 block">
              Server Name
            </label>
            <div className="w-full h-8 bg-white border border-gray-200 rounded px-2 flex items-center text-[11px] text-gray-800">
              {serverName}
              {!isSuccess && <span className="w-[1px] h-3.5 bg-gray-400 ml-0.5 animate-caret"></span>}
            </div>
          </div>

          {/* Connection Type Field */}
          <div>
            <label className="text-[11px] font-medium text-gray-900 mb-1 block">
              Connection Type
            </label>
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-white border border-gray-200 rounded px-2 flex items-center justify-between text-[11px] text-gray-800">
                HTTP
                <ChevronDown size={12} className="text-gray-400" />
              </div>
              <div className="flex-1 h-8 bg-white border border-gray-200 rounded px-2 flex items-center text-[11px] text-gray-800 overflow-hidden">
                <span className="truncate">{url}</span>
                {serverName.length === fullServerName.length && !isSuccess && (
                  <span className="w-[1px] h-3.5 bg-gray-400 ml-0.5 animate-caret"></span>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-auto flex justify-end gap-2 pb-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-medium text-gray-700">
              Cancel
            </button>
            <button className={`px-3 py-1.5 rounded text-[11px] font-medium text-white shadow-sm transition-all duration-200 ${
              step === 1 ? 'bg-black scale-95' : 'bg-black hover:bg-gray-900'
            }`}>
              Add Server
            </button>
          </div>
        </div>

        {/* Success Overlay */}
        <div className={`absolute inset-0 bg-white/95 flex flex-col items-center justify-center transition-all duration-500 z-20 ${
          isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none translate-y-2'
        }`}>
          <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="text-green-500 w-12 h-12" strokeWidth={1.5} />
            <span className="text-[14px] font-bold text-gray-900">New MCP is added</span>
          </div>
        </div>
      </div>

      {/* Simulated Cursor */}
      {!isSuccess && serverName.length === fullServerName.length && url.length === fullUrl.length && (
        <div className={`absolute right-[40px] bottom-[25px] transition-all duration-700 pointer-events-none z-30 ${
          step === 1 ? 'scale-90 translate-y-1' : ''
        }`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="black" className="drop-shadow-md">
            <path d="M0,0 L12,12 L7,12 L10,18 L8,19 L5,13 L0,18 Z" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      <style jsx>{`
        @keyframes caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-caret {
          animation: caret 1s infinite;
        }
      `}</style>
    </div>
  );
};


