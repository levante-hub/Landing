'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Terminal, X } from 'lucide-react';
import { MCPServerExtended as MCPServer } from '@/lib/registry/types';
import { MCPBadges } from './MCPBadges';

interface MCPInfoSheetProps {
  mcp: MCPServer | null;
  open: boolean;
  onClose: () => void;
}

export function MCPInfoSheet({ mcp, open, onClose }: MCPInfoSheetProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(false);
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setIsVisible(false);
  }, [open]);

  if (!open || !mcp) return null;

  const template = mcp.configuration?.template;
  const envEntries = template?.env ? Object.entries(template.env) : [];
  const args = template?.args || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`relative h-full w-full max-w-md bg-white text-slate-900 shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Close info sheet"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-6 h-full overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
              {mcp.logoUrl ? (
                <img
                  src={mcp.logoUrl}
                  alt={mcp.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-2xl">{mcp.icon || '🧩'}</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{mcp.name}</h2>
              <p className="text-sm text-slate-600 mt-1">{mcp.description}</p>
              <MCPBadges mcp={mcp} className="mt-3" />
            </div>
          </div>

          {template && (
            <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Terminal className="w-4 h-4" />
                  Transporte
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                  {template.type}
                </span>
              </div>

              {template.command && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Comando</p>
                  <code className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">
                    {template.command} {args.join(' ')}
                  </code>
                </div>
              )}

              {args.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Argumentos</p>
                  <div className="flex flex-wrap gap-2">
                    {args.map((arg) => (
                      <span
                        key={arg}
                        className="text-xs px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-800"
                      >
                        {arg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {template.url && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">URL</p>
                  <code className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 break-all">
                    {template.url}
                  </code>
                </div>
              )}
            </section>
          )}

          <section>
            <p className="text-sm font-semibold mb-1 text-slate-900">Variables de Entorno</p>
            {envEntries.length > 0 ? (
              <div className="space-y-1 text-sm">
                {envEntries.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4">
                    <span className="text-slate-900">{key}</span>
                    <span className="text-slate-600 break-all">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                No requiere variables de entorno
              </p>
            )}
          </section>

          {mcp.maintainer && (
            <section>
              <p className="text-sm font-semibold mb-2 text-slate-900">Mantenedor</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Nombre</span>
                  <span className="text-slate-900">{mcp.maintainer.name}</span>
                </div>
                {mcp.maintainer.url && (
                  <a
                    href={mcp.maintainer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <span>Sitio Web</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {mcp.maintainer.github && (
                  <a
                    href={`https://github.com/${mcp.maintainer.github.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </section>
          )}

          {(mcp.metadata?.homepage || mcp.metadata?.repository) && (
            <section>
              <p className="text-sm font-semibold mb-2 text-slate-900">Información Adicional</p>
              <div className="space-y-2 text-sm">
                {mcp.metadata.homepage && (
                  <a
                    href={mcp.metadata.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <span>Página Principal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {mcp.metadata.repository && (
                  <a
                    href={mcp.metadata.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <span>Repositorio</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
