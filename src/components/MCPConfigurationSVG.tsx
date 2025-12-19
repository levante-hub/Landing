'use client';

import React, { useEffect, useState } from 'react';

export const MCPConfigurationSVG = () => {
  const [lines, setLines] = useState<string[]>([]);
  const fullJson = [
    '{',
    '  "mcpServers": {',
    '    "ree": {',
    '      "name": "ree",',
    '      "transport": "stdio",',
    '      "command": "/Users/...",',
    '      "args": ["-m", "ree_mcp"],',
    '      "env": {',
    '        "REE_API_TOKEN": "9053..."',
    '      }',
    '    }',
    '  }',
    '}'
  ];

  useEffect(() => {
    let currentLine = 0;
    const animate = () => {
      if (currentLine < fullJson.length) {
        setLines(prev => [...prev, fullJson[currentLine]]);
        currentLine++;
        setTimeout(animate, 100);
      } else {
        setTimeout(() => {
          setLines([]);
          currentLine = 0;
          setTimeout(animate, 500);
        }, 4000);
      }
    };

    animate();
    return () => { currentLine = 999; }; // Simple way to stop the chain on unmount
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
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-gray-500 rounded">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 3l1.912 5.886h6.191l-5.007 3.638 1.912 5.886-5.008-3.638-5.008 3.638 1.912-5.886-5.007-3.638h6.191z" />
              </svg>
              Automatic
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-gray-900 bg-white shadow-sm rounded">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
              Custom
            </button>
          </div>
        </div>

        {/* Configuration Area */}
        <div className="px-4 py-2 flex flex-col flex-1 min-h-0 mb-2">
          <label className="text-[11px] font-medium text-gray-900 mb-1">
            Complete MCP Configuration (.mcp.json)
          </label>
          <div className="flex-1 bg-white rounded border border-gray-200 p-2.5 font-mono text-[9px] sm:text-[10px] text-gray-800 overflow-hidden relative">
            <div className="space-y-0.5">
              {lines.map((line, i) => (
                <div 
                  key={i} 
                  className="whitespace-pre transition-all duration-300 opacity-0 animate-fade-in-down"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

