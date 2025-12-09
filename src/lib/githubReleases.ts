import { Platform } from './platformDetector';

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  assets: GitHubAsset[];
}

export interface PlatformUrls {
  windows?: string;
  'macos-intel'?: string;
  'macos-arm'?: string;
  linux?: string;
}

const CACHE_KEY = 'levante_latest_release';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos en milisegundos
const GITHUB_API_URL = 'https://api.github.com/repos/levante-hub/levante/releases/latest';

interface CachedData {
  data: GitHubRelease;
  timestamp: number;
}

function getCachedRelease(): GitHubRelease | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Verificar si el caché está expirado
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

function setCachedRelease(release: GitHubRelease): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheData: CachedData = {
      data: release,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

export async function fetchLatestRelease(): Promise<GitHubRelease> {
  // Intentar obtener del caché primero
  const cached = getCachedRelease();
  if (cached) {
    return cached;
  }

  // Si no hay caché, hacer fetch a la API
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const release: GitHubRelease = await response.json();

    // Guardar en caché
    setCachedRelease(release);

    return release;
  } catch (error) {
    console.error('Error fetching GitHub release:', error);
    throw error;
  }
}

export function mapAssetsToPlatforms(assets: GitHubAsset[]): PlatformUrls {
  const platformUrls: PlatformUrls = {};

  for (const asset of assets) {
    const nameLower = asset.name.toLowerCase();

    // Prefer .dmg for macOS; treat non-arch DMGs as universal
    if (nameLower.includes('.dmg')) {
      const isArm =
        nameLower.includes('arm') ||
        nameLower.includes('aarch64') ||
        nameLower.includes('apple-silicon') ||
        nameLower.includes('m1') ||
        nameLower.includes('m2');
      const isIntel = nameLower.includes('x64') || nameLower.includes('intel');

      if (isArm) {
        platformUrls['macos-arm'] = asset.browser_download_url;
      } else if (isIntel) {
        platformUrls['macos-intel'] = asset.browser_download_url;
      } else {
        // Universal DMG: use for both architectures
        platformUrls['macos-arm'] = asset.browser_download_url;
        platformUrls['macos-intel'] = asset.browser_download_url;
      }
      continue;
    }

    // Detectar Windows - priorizar .exe y .msi
    if (nameLower.includes('.exe') || nameLower.includes('.msi')) {
      // Siempre priorizar .exe y .msi
      platformUrls.windows = asset.browser_download_url;
    } else if ((nameLower.includes('win') && !nameLower.includes('darwin')) && !platformUrls.windows) {
      // Solo usar otros archivos win si no hay un .exe o .msi ya asignado
      platformUrls.windows = asset.browser_download_url;
    }
    // Detectar macOS ARM (buscar darwin-arm64 o arm64)
    else if ((nameLower.includes('darwin-arm64') || nameLower.includes('darwin') && nameLower.includes('arm64')) ||
             ((nameLower.includes('mac') || nameLower.includes('macos')) &&
              (nameLower.includes('arm64') || nameLower.includes('aarch64') ||
               nameLower.includes('apple-silicon') || nameLower.includes('m1') ||
               nameLower.includes('m2')))) {
      platformUrls['macos-arm'] = asset.browser_download_url;
    }
    // Detectar macOS Intel (buscar darwin-x64 o x64)
    else if ((nameLower.includes('darwin-x64') || nameLower.includes('darwin') && nameLower.includes('x64')) ||
             ((nameLower.includes('mac') || nameLower.includes('macos') || nameLower.includes('.dmg')) &&
              (nameLower.includes('x64') || nameLower.includes('intel')) &&
              !nameLower.includes('arm') && !nameLower.includes('aarch64'))) {
      platformUrls['macos-intel'] = asset.browser_download_url;
    }
    // Detectar Linux (buscar linux, .appimage, .deb, .rpm, .tar.gz)
    else if (nameLower.includes('linux') || nameLower.includes('.appimage') ||
             nameLower.includes('.deb') || nameLower.includes('.rpm') ||
             (nameLower.includes('.tar.gz') && !nameLower.includes('darwin'))) {
      platformUrls.linux = asset.browser_download_url;
    }
  }

  return platformUrls;
}

export function getDownloadUrlForPlatform(
  platformUrls: PlatformUrls,
  platform: Platform
): string | null {
  // Intentar obtener URL para la plataforma específica
  if (platform !== 'unknown' && platformUrls[platform]) {
    return platformUrls[platform] || null;
  }

  // Fallback: retornar la primera URL disponible
  const availableUrl =
    platformUrls.windows ||
    platformUrls['macos-arm'] ||
    platformUrls['macos-intel'] ||
    platformUrls.linux;

  return availableUrl || null;
}
