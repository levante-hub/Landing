'use client';

import { useState, useCallback } from 'react';
import { MCPServerExtended } from '@/lib/registry/types';
import { deepLinkBuilder, DeepLinkResult } from '@/lib/deeplink/builder';
import { protocolDetector } from '@/lib/deeplink/detector';
import { safeCapture } from '@/lib/posthog';

export interface UseDeepLinkOptions {
  onSuccess?: (mcpId: string) => void;
  onFailure?: (mcpId: string) => void;
  detectProtocol?: boolean;
}

export interface UseDeepLinkReturn {
  openDeepLink: (
    entry: MCPServerExtended
  ) => Promise<{
    success: boolean;
    method?: string;
    error?: string;
    warnings?: string[];
  }>;
  isOpening: boolean;
  showFallback: boolean;
  closeFallback: () => void;
  currentMCP: MCPServerExtended | null;
}

export function useDeepLink(options: UseDeepLinkOptions = {}): UseDeepLinkReturn {
  const [isOpening, setIsOpening] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [currentMCP, setCurrentMCP] = useState<MCPServerExtended | null>(null);

  const openDeepLink = useCallback(
    async (entry: MCPServerExtended) => {
      setCurrentMCP(entry);

      const result: DeepLinkResult = deepLinkBuilder.build({ entry });

      if (!result.url) {
        safeCapture('mcp_install_error', {
          mcpId: entry.id,
          mcpName: entry.name,
          error: result.error || 'Unknown error',
        });

        return {
          success: false,
          error: result.error,
        };
      }

      setIsOpening(true);

      safeCapture('mcp_install_clicked', {
        mcpId: entry.id,
        mcpName: entry.name,
        transport: entry.configuration?.template?.type,
        source: entry.source,
        category: entry.category,
      });

      if (options.detectProtocol) {
        const detectionResult = await protocolDetector.detect(result.url, {
          timeout: 2500,
          onSuccess: () => {
            safeCapture('mcp_install_success', {
              mcpId: entry.id,
              method: 'protocol_detected',
            });
            options.onSuccess?.(entry.id);
          },
          onFailure: () => {
            safeCapture('mcp_install_failed', {
              mcpId: entry.id,
              reason: 'protocol_not_detected',
            });
            setShowFallback(true);
            options.onFailure?.(entry.id);
          },
        });

        setIsOpening(false);

        return {
          success: detectionResult.installed === true,
          method: detectionResult.method,
          warnings: result.warnings,
        };
      } else {
        protocolDetector.open(result.url);
        setIsOpening(false);

        setTimeout(() => {
          safeCapture('mcp_install_assumed_success', {
            mcpId: entry.id,
            method: 'direct_open',
          });
          options.onSuccess?.(entry.id);
        }, 500);

        return {
          success: true,
          method: 'direct',
          warnings: result.warnings,
        };
      }
    },
    [options]
  );

  const closeFallback = useCallback(() => {
    setShowFallback(false);
    setCurrentMCP(null);
  }, []);

  return {
    openDeepLink,
    isOpening,
    showFallback,
    closeFallback,
    currentMCP,
  };
}
