'use client';

import { useState } from 'react';
import {
  SendIcon,
  Wrench,
  ChevronDown,
  ChevronsUpDown,
  GlobeIcon,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const LandingChatDemo = () => {
  const [input, setInput] = useState('');
  const [webSearch, setWebSearch] = useState(false);
  const [mcpTools, setMcpTools] = useState(true);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const [toolsOpen, setToolsOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [toolsSearchQuery, setToolsSearchQuery] = useState('');
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMessage, setUserMessage] = useState('');

  const mockModels = [
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', contextLength: 128000 },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', contextLength: 200000 },
    { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google', contextLength: 32000 },
  ];

  const tools = [
    { id: 'web-search', label: 'Web Search', icon: GlobeIcon, enabled: webSearch, onChange: setWebSearch },
    { id: 'mcp-tools', label: 'MCP Tools', icon: Wrench, enabled: mcpTools, onChange: setMcpTools }
  ];

  const modelMessages: Record<string, string> = {
    'openai/gpt-4o': '🚀 GPT-4o via Levante! Your local client connecting to hundreds of models—cloud or local. Add any tool through MCPs, keep your setup open-source, and switch models instantly!',
    'anthropic/claude-3.5-sonnet': '✨ Claude 3.5 Sonnet ready! Levante is your open-source local client for any model. Integrate custom tools via MCPs, download models to run locally, or connect to cloud APIs—your choice!',
    'google/gemini-pro': '🌟 Gemini Pro at your command! Levante gives you one local client for all models. Connect tools via MCP protocol, run downloaded models locally, or use cloud APIs. Open-source freedom!',
  };

  // Filtrado de herramientas basado en búsqueda
  const filteredTools = toolsSearchQuery.trim()
    ? tools.filter(tool => tool.label.toLowerCase().includes(toolsSearchQuery.toLowerCase()))
    : tools;

  // Filtrado de modelos basado en búsqueda
  const filteredModels = modelSearchQuery.trim()
    ? mockModels.filter(model =>
        model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(modelSearchQuery.toLowerCase())
      )
    : mockModels;

  const activeCount = tools.filter(t => t.enabled).length;
  const selectedModelData = mockModels.find(m => m.id === selectedModel);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setUserMessage(input);
    setInput('');
    setDisplayedMessage('');
    setIsTyping(true);

    // Start typewriter effect
    const message = modelMessages[selectedModel];
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedMessage(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(intervalId);
      }
    }, 30);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white transition-all duration-300",
      userMessage ? "min-h-[700px]" : toolsOpen || modelOpen ? "min-h-[500px]" : "min-h-[400px]"
    )}>
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-12 pb-16">
        <div className="w-full max-w-3xl flex flex-col items-center gap-8">

          {/* Welcome Screen */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/logo_negro.svg"
                alt="Levante"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-3xl font-serif text-gray-800">
                Hello, User
              </h1>
            </div>
          </div>

          {/* Chat Messages */}
          {userMessage && (
            <div className="w-full max-w-2xl space-y-4">
              {/* User Message */}
              <div className="flex gap-3 justify-end">
                <div className="flex-1 max-w-[80%]">
                  <div className="p-4 rounded-lg bg-gray-900 text-white">
                    <p className="text-sm">{userMessage}</p>
                  </div>
                </div>
              </div>

              {/* AI Message with Typewriter Effect */}
              {(displayedMessage || isTyping) && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium">
                      AI
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-sm text-gray-800">
                        {displayedMessage}
                        {isTyping && <span className="inline-block w-0.5 h-4 bg-gray-900 ml-1 animate-pulse" />}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Input */}
          <div className="w-full">
            <form
              className="w-full mx-auto divide-y rounded-xl border border-gray-200 bg-white shadow-sm"
              onSubmit={handleSubmit}
            >
              {/* Textarea */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything you want to know..."
                rows={1}
                className={cn(
                  "w-full resize-none p-3 bg-white",
                  "border-none outline-none focus:outline-none focus:ring-0",
                  "text-gray-900 placeholder:text-gray-400",
                  "max-h-[6lh]"
                )}
              />

              {/* Toolbar */}
              <div className="flex items-center justify-between p-2 pt-3">
                <div className="flex items-center gap-1">
                  {/* Tools Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setToolsOpen(!toolsOpen)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm cursor-pointer',
                        'hover:bg-gray-100 transition-colors',
                        activeCount > 0 ? 'text-gray-900' : 'text-gray-600'
                      )}
                    >
                      <Wrench size={16} />
                      <span>Tools</span>
                      {activeCount > 0 && (
                        <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-xs text-white">
                          {activeCount}
                        </span>
                      )}
                      <ChevronDown size={14} />
                    </button>

                    {/* Tools Dropdown */}
                    {toolsOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => {
                            setToolsOpen(false);
                            setToolsSearchQuery(''); // Reset search on close
                          }}
                        />
                        <div className="absolute left-0 top-full mt-2 w-80 z-50 rounded-lg border border-gray-200 bg-white shadow-lg">
                          <div className="p-4 border-b border-gray-200">
                            <p className="text-sm text-gray-600 text-center">
                              Connect tools through the Store, or create your own
                            </p>
                          </div>
                          <div className="p-1">
                            {filteredTools.length === 0 ? (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No tools found
                              </div>
                            ) : (
                              filteredTools.map((tool) => {
                              const Icon = tool.icon;
                              return (
                                <div
                                  key={tool.id}
                                  className="flex items-center justify-between rounded-sm px-2 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => tool.onChange(!tool.enabled)}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon size={16} className="text-gray-600" />
                                    <span className="text-sm text-gray-900">{tool.label}</span>
                                  </div>
                                  {/* Simple Switch */}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={tool.enabled}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      tool.onChange(!tool.enabled);
                                    }}
                                    className={cn(
                                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                                      "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                                      tool.enabled ? "bg-gray-900" : "bg-gray-300"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                                        tool.enabled ? "translate-x-4" : "translate-x-0"
                                      )}
                                    />
                                  </button>
                                </div>
                              );
                            })
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Model Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setModelOpen(!modelOpen)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium cursor-pointer',
                        'hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900',
                        'w-[200px] text-left truncate',
                        modelOpen && 'bg-gray-100 text-gray-900'
                      )}
                    >
                      <span className="truncate">{selectedModelData?.name}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>

                    {/* Model Dropdown */}
                    {modelOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => {
                            setModelOpen(false);
                            setModelSearchQuery(''); // Reset search on close
                          }}
                        />
                        <div className="absolute right-0 top-full mt-2 w-[300px] z-50 rounded-lg border border-gray-200 bg-white shadow-lg">
                          <div className="max-h-[300px] overflow-y-auto">
                            <div className="p-2">
                              {mockModels.map((model) => (
                                <button
                                  key={model.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedModel(model.id);
                                    setModelOpen(false);
                                    setModelSearchQuery('');
                                  }}
                                  className="w-full flex items-center px-2 py-2 rounded-sm hover:bg-gray-100 cursor-pointer text-left"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 text-gray-900",
                                      selectedModel === model.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col flex-1">
                                    <span className="text-sm text-gray-900">{model.name}</span>
                                    <span className="text-xs text-gray-600">
                                      {Math.round(model.contextLength / 1000)}k context
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
                              Hundreds more models available
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!input}
                    className={cn(
                      "flex items-center justify-center h-9 w-9 rounded-lg",
                      "transition-colors",
                      input
                        ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <SendIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
