'use client';

import { deepLinkBuilder } from '@/lib/deeplink/builder';
import { MCPServerExtended } from '@/lib/registry/types';

interface MCPBadgesProps {
  mcp: MCPServerExtended;
  showCategory?: boolean;
  showSource?: boolean;
  className?: string;
}

export function MCPBadges({
  mcp,
  showCategory = true,
  showSource = true,
  className = '',
}: MCPBadgesProps) {
  const requiresConfig = deepLinkBuilder.requiresConfiguration(mcp);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showCategory && (
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {mcp.category}
        </span>
      )}

      {showSource && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            mcp.source === 'official'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-700 border border-gray-200'
          }`}
        >
          {mcp.source}
        </span>
      )}

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

      {requiresConfig && (
        <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Configuration required
        </span>
      )}
    </div>
  );
}
