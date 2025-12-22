'use client';

import React, { useEffect, useState } from 'react';
import { Search, Layout, Plus, Store, Box, Settings, SlidersHorizontal, ArrowUp } from 'lucide-react';
import Image from 'next/image';

export const HeroChatSVG = () => {
  const [step, setStep] = useState(0);
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  const fullInput = "What is Levante and how does it work?";
  const fullResponse = "Levante is an open-source, MCP-native AI workspace that brings your models, tools, and data together in one secure desktop client. Connect to any MCP server, run local or cloud models, and guide users with interactive apps through https://www.levanteapp.com.";

  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      if (!isMounted) return;

      setStep(0);
      setInputText('');
      setAiResponse('');
      setShowResponse(false);
      await new Promise(r => setTimeout(r, 1500));

      if (!isMounted) return;
      setStep(1); // Typing user input
      for (let i = 1; i <= fullInput.length; i++) {
        if (!isMounted) return;
        setInputText(fullInput.slice(0, i));
        await new Promise(r => setTimeout(r, 50)); // Slightly faster typing
      }
      await new Promise(r => setTimeout(r, 1200));

      if (!isMounted) return;
      setStep(2); // Sent, show user bubble
      await new Promise(r => setTimeout(r, 800));

      if (!isMounted) return;
      setStep(3); // AI Typing
      setShowResponse(true);
      for (let i = 1; i <= fullResponse.length; i++) {
        if (!isMounted) return;
        setAiResponse(fullResponse.slice(0, i));
        await new Promise(r => setTimeout(r, 20)); // Slightly faster AI response
      }
      
      await new Promise(r => setTimeout(r, 5000));
      if (isMounted) sequence();
    };

    sequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full max-w-full aspect-[0.8/1] md:aspect-[1.25/1] bg-[#E5E5E5] rounded-3xl border border-slate-300 shadow-2xl flex overflow-hidden text-left font-sans select-none mx-auto">
      {/* SIDEBAR */}
      <div className="w-[240px] hidden md:flex flex-col p-4 border-r border-slate-300/50">
        {/* Window Controls */}
        <div className="flex items-center mb-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-sm" />
          </div>
        </div>

        {/* Brand */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image src="/logo_negro.svg" alt="Levante" width={22} height={22} className="opacity-90" />
            <span className="text-[15px] font-bold text-slate-800">Levante</span>
          </div>
          <div className="flex gap-2 text-slate-600">
            <Layout size={18} strokeWidth={1.5} />
            <Plus size={18} strokeWidth={1.5} />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search size={14} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            readOnly
            className="w-full bg-white border-none rounded-lg py-1.5 pl-9 text-[13px] placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* History */}
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Today</div>
          {[
            "Custom actions in Minte...",
            "New sales in this Q1 with...",
            "New sales in this Q1 with..."
          ].map((text, i) => (
            <div key={i} className="px-2 py-1.5 text-[13px] text-slate-700 truncate hover:bg-slate-300/30 rounded-lg cursor-default">
              {text}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 space-y-3 px-1">
          <div className="flex items-center gap-3 text-slate-700 text-[13px] font-medium">
            <Store size={18} strokeWidth={1.5} /> Store
          </div>
          <div className="flex items-center gap-3 text-slate-700 text-[13px] font-medium">
            <Box size={18} strokeWidth={1.5} /> Model
          </div>
          <div className="flex items-center gap-3 text-slate-700 text-[13px] font-medium">
            <Settings size={18} strokeWidth={1.5} /> Settings
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 bg-white flex flex-col m-3 rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
        {/* Chat Header */}
        <div className="h-12 border-b border-slate-100 flex items-center px-6 flex-shrink-0">
          <h2 className="text-[13px] font-semibold text-slate-800">Chat</h2>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 flex flex-col min-h-0">
          {/* User Bubble */}
          {step >= 2 && (
            <div className={`self-end bg-slate-100 px-4 py-2.5 rounded-2xl text-[14px] text-slate-800 max-w-[85%] transition-all duration-500`}>
              {fullInput}
            </div>
          )}

          {/* AI Bubble */}
          {showResponse && (
            <div className="flex items-start gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image src="/logo_negro.svg" alt="AI" width={18} height={18} className="opacity-70" />
              </div>
              <div className="flex-1 pt-1 md:pt-1.5 min-w-0">
                <p className="text-[14px] leading-relaxed text-slate-800 font-medium break-words">
                  {aiResponse}
                  {step === 3 && aiResponse.length < fullResponse.length && (
                    <span className="inline-block w-[2px] h-[14px] bg-slate-400 ml-1 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input Box Area */}
        <div className="p-4 md:p-6 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-3xl p-3 md:p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col min-h-[70px] md:min-h-[100px] justify-between relative group">
            <div className="text-[14px] md:text-[15px] text-slate-400">
              {step === 1 ? (
                <span className="text-slate-800">{inputText}<span className="border-r-2 border-slate-400 ml-0.5 animate-caret"></span></span>
              ) : (
                "How can I help you?"
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2 md:mt-4">
              <div className="p-1 md:p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-default">
                <SlidersHorizontal className="text-slate-600 w-4 h-4 md:w-[18px] md:h-[18px]" />
              </div>
              
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                (step === 1 && inputText.length === fullInput.length) || step === 2 
                  ? 'bg-blue-600 scale-105' 
                  : 'bg-blue-500 opacity-90'
              }`}>
                <ArrowUp className="text-white w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
              </div>
            </div>
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


