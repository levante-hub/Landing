'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Code, ChevronDown } from 'lucide-react';

export const MCPConfigurationSVG = () => {
  const [serverName, setServerName] = useState('');
  const [url, setUrl] = useState('');
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
      
      // Pause at the end
      await new Promise(r => setTimeout(r, 3000));
      if (isMounted) sequence();
    };

    sequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-sans relative">
      <div className="w-full h-[264px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col p-1">
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
              <span className="w-[1px] h-3.5 bg-gray-400 ml-0.5 animate-caret"></span>
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
                {serverName.length === fullServerName.length && (
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
            <button className="px-3 py-1.5 bg-black rounded text-[11px] font-medium text-white shadow-sm">
              Add Server
            </button>
          </div>
        </div>
      </div>

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


