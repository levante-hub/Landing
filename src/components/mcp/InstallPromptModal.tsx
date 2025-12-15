'use client';

import { Download, X, ExternalLink } from 'lucide-react';
import { safeCapture } from '@/lib/posthog';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcpName?: string;
  downloadUrl?: string | null;
}

export function InstallPromptModal({
  isOpen,
  onClose,
  mcpName,
  downloadUrl,
}: InstallPromptModalProps) {
  if (!isOpen) return null;

  const isDownloadAvailable = Boolean(downloadUrl);

  const handleDownload = () => {
    safeCapture('levante_download_clicked', {
      source: 'mcp_install_fallback',
      mcpName,
    });

    if (downloadUrl) {
      window.location.href = downloadUrl;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Levante is not installed
          </h2>
          <p className="text-slate-600">
            To install {mcpName || 'this MCP'}, you need to have Levante installed on your
            computer.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">What is Levante?</h3>
          <p className="text-sm text-slate-600">
            Levante is an AI-powered desktop assistant that supports Model Context Protocol
            (MCP) servers to extend its capabilities with tools, data sources, and integrations.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-black/5 rounded-full p-2 mt-0.5">
              <Download className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Free Download</p>
              <p className="text-sm text-slate-600">Available for macOS, Windows, and Linux</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-black/5 rounded-full p-2 mt-0.5">
              <ExternalLink className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Easy Setup</p>
              <p className="text-sm text-slate-600">Install MCPs with one click after downloading Levante</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
          >
            Maybe Later
          </button>
          <button
            onClick={handleDownload}
            disabled={!isDownloadAvailable}
            className="flex-1 px-4 py-2 rounded-full bg-black text-white hover:bg-black/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download Levante
          </button>
        </div>
      </div>
    </div>
  );
}
