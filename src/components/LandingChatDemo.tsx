'use client';

import { useState } from 'react';
import posthog from 'posthog-js';
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

    posthog.capture('landing_chat_message_sent', {
      selected_model: selectedModel,
      web_search_enabled: webSearch,
      mcp_tools_enabled: mcpTools,
      message_length: input.length
    });

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
    <div className="relative w-full h-full">
      <Image
        src="/chat-hero.png"
        alt="Chat demo"
        width={860}
        height={600}
        priority
        className="w-full h-auto"
      />
    </div>
  );
};
