export type Platform = 'windows' | 'macos-intel' | 'macos-arm' | 'linux' | 'unknown';

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  // Detectar Windows
  if (userAgent.includes('win')) {
    return 'windows';
  }

  // Detectar macOS
  if (userAgent.includes('mac') || platform.includes('mac')) {
    // Detectar Apple Silicon (ARM) vs Intel
    // Los Macs ARM tienen "arm" en el userAgent o usan la API navigator.userAgentData
    if (userAgent.includes('arm') || userAgent.includes('apple silicon')) {
      return 'macos-arm';
    }

    // Intentar usar la nueva API si está disponible
    if ('userAgentData' in navigator) {
      const navData = (navigator as any).userAgentData;
      if (navData?.getHighEntropyValues) {
        // Esto es async, pero para simplificar usamos detección básica
        return 'macos-arm'; // Por defecto ARM para nuevos Macs
      }
    }

    // Por defecto, asumimos Intel si no podemos detectar ARM
    return 'macos-intel';
  }

  // Detectar Linux
  if (userAgent.includes('linux') || platform.includes('linux')) {
    return 'linux';
  }

  return 'unknown';
}

export function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    'windows': 'Windows',
    'macos-intel': 'macOS (Intel)',
    'macos-arm': 'macOS (Apple Silicon)',
    'linux': 'Linux',
    'unknown': 'Unknown Platform'
  };

  return names[platform];
}
