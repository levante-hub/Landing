'use client';

import { useEffect } from 'react';
import { X, Terminal, Settings2, ExternalLink, AlertTriangle, Package } from 'lucide-react';
import { MCPServerExtended } from '@/lib/registry/types';
import { deepLinkBuilder } from '@/lib/deeplink/builder';
import { MCPInstallButton } from './MCPInstallButton';
import { safeCapture } from '@/lib/posthog';
import type { UseDeepLinkReturn } from '@/hooks/useDeepLink';

interface MCPDetailModalProps {
  mcp: MCPServerExtended | null;
  isOpen: boolean;
  onClose: () => void;
  openDeepLink?: UseDeepLinkReturn['openDeepLink'];
  isOpening?: boolean;
  currentMCPId?: string;
}

export function MCPDetailModal({
  mcp,
  isOpen,
  onClose,
  openDeepLink,
  isOpening,
  currentMCPId,
}: MCPDetailModalProps) {
  useEffect(() => {
    if (isOpen && mcp) {
      safeCapture('mcp_detail_modal_opened', {
        mcpId: mcp.id,
        mcpName: mcp.name,
      });
    }
  }, [isOpen, mcp]);

  if (!isOpen || !mcp) return null;

  const template = mcp.configuration?.template;
  const commandPreview = deepLinkBuilder.getCommandPreview(mcp);
  const requiredFields = deepLinkBuilder.getRequiredFields(mcp);
  const hasEnvVars = template?.env && Object.keys(template.env).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              {mcp.logoUrl ? (
                <img src={mcp.logoUrl} alt={mcp.name} className="w-full h-full object-cover rounded-xl" />
              ) : mcp.icon ? (
                <span className="text-3xl">{mcp.icon}</span>
              ) : (
                <Package className="w-8 h-8 text-slate-600" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">{mcp.displayName || mcp.name}</h2>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {mcp.category}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    mcp.source === 'official'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {mcp.source}
                </span>

                {mcp.status === 'experimental' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Experimental
                  </span>
                )}

                {mcp.status === 'deprecated' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                    Deprecated
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-slate-600">{mcp.description}</p>
          </div>

          {template && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Transport Configuration
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Type</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">{template.type}</span>
                </div>
                <div className="border-t border-slate-200 my-3" />
                <div>
                  <span className="text-sm text-slate-600 block mb-2">Command</span>
                  <code className="block text-sm bg-white p-3 rounded border border-slate-200 font-mono text-slate-900">
                    {commandPreview}
                  </code>
                </div>
                {hasEnvVars && (
                  <p className="mt-3 text-xs text-slate-600">
                    This MCP requires environment variables. Configure them in Levante after installation.
                  </p>
                )}
              </div>
            </div>
          )}

          {requiredFields.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Required Configuration
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 text-sm">Setup Required</p>
                    <p className="text-xs text-amber-700 mt-1">
                      This MCP requires additional configuration after installation
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
                {requiredFields.map((field) => (
                  <div key={field.key}>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-slate-900">{field.key}</code>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{field.type}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700">Required</span>
                    </div>
                    <p className="text-xs text-slate-600">{field.description || field.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(mcp.metadata || mcp.maintainer) && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Metadata</h3>
              <div className="space-y-2">
                {mcp.maintainer && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Maintainer</span>
                    <span className="text-slate-900">{mcp.maintainer.name}</span>
                  </div>
                )}
                {mcp.metadata?.author && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Author</span>
                    <span className="text-slate-900">{mcp.metadata.author}</span>
                  </div>
                )}
                {mcp.metadata?.homepage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Homepage</span>
                    <a
                      href={mcp.metadata.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      onClick={() => safeCapture('mcp_homepage_clicked', { mcpId: mcp.id })}
                    >
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {mcp.version && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Version</span>
                    <span className="text-slate-900">v{mcp.version}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-6 bg-slate-50 rounded-b-2xl">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-white transition-colors font-medium"
              >
              Close
            </button>
            <div className="flex-1">
              <MCPInstallButton
                mcp={mcp}
                variant="default"
                size="md"
                className="w-full justify-center"
                openDeepLink={openDeepLink}
                isOpeningOverride={currentMCPId === mcp.id ? isOpening : false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
