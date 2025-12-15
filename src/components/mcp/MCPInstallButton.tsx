'use client';

import { MouseEvent, useMemo, useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { MCPServerExtended } from '@/lib/registry/types';
import { useDeepLink, UseDeepLinkReturn } from '@/hooks/useDeepLink';

type DeepLinkOpener = UseDeepLinkReturn['openDeepLink'];

interface MCPInstallButtonProps {
  mcp: MCPServerExtended;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onInstallSuccess?: (mcpId: string) => void;
  openDeepLink?: DeepLinkOpener;
  isOpeningOverride?: boolean;
}

export function MCPInstallButton({
  mcp,
  variant = 'default',
  size = 'md',
  className = '',
  onInstallSuccess,
  openDeepLink,
  isOpeningOverride,
}: MCPInstallButtonProps) {
  const [isInstalled, setIsInstalled] = useState(false);
  const usingExternalHook = useMemo(() => Boolean(openDeepLink), [openDeepLink]);

  const { openDeepLink: hookOpenDeepLink, isOpening: hookIsOpening } = useDeepLink({
    detectProtocol: true,
    onSuccess: (mcpId) => {
      if (usingExternalHook) return;
      setIsInstalled(true);
      onInstallSuccess?.(mcpId);
      setTimeout(() => setIsInstalled(false), 3000);
    },
  });

  const resolvedOpenDeepLink = openDeepLink ?? hookOpenDeepLink;
  const resolvedIsOpening = isOpeningOverride ?? hookIsOpening;

  const handleSuccess = () => {
    setIsInstalled(true);
    onInstallSuccess?.(mcp.id);
    setTimeout(() => setIsInstalled(false), 3000);
  };

  const handleInstall = async (e: MouseEvent) => {
    e.stopPropagation();
    const result = await resolvedOpenDeepLink(mcp);
    if (usingExternalHook && result?.success) {
      handleSuccess();
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  } as const;

  const variantClasses = {
    default: 'bg-black text-white hover:bg-black/90',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  } as const;

  const baseClasses =
    'rounded-full font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalled || resolvedIsOpening}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {resolvedIsOpening ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Opening...
        </>
      ) : isInstalled ? (
        <>
          <Check className="w-4 h-4" />
          Opened
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Install
        </>
      )}
    </button>
  );
}
