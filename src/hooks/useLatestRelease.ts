import { useState, useEffect } from 'react';
import { detectPlatform, Platform } from '@/lib/platformDetector';
import {
  fetchLatestRelease,
  mapAssetsToPlatforms,
  getDownloadUrlForPlatform,
  PlatformUrls
} from '@/lib/githubReleases';

export interface UseLatestReleaseResult {
  downloadUrl: string | null;
  isLoading: boolean;
  error: string | null;
  platform: Platform;
  allUrls: PlatformUrls;
  version: string | null;
}

export function useLatestRelease(): UseLatestReleaseResult {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [allUrls, setAllUrls] = useState<PlatformUrls>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    async function loadRelease() {
      try {
        setIsLoading(true);
        setError(null);

        // Detectar plataforma del usuario
        const detectedPlatform = detectPlatform();
        setPlatform(detectedPlatform);

        // Obtener última release
        const release = await fetchLatestRelease();
        setVersion(release.tag_name);

        // Mapear assets a plataformas
        const platformUrls = mapAssetsToPlatforms(release.assets);
        setAllUrls(platformUrls);

        // Obtener URL específica para la plataforma
        const url = getDownloadUrlForPlatform(platformUrls, detectedPlatform);

        if (!url) {
          setError('No download available for your platform');
        }

        setDownloadUrl(url);
      } catch (err) {
        console.error('Error loading release:', err);
        setError('Failed to load download');
      } finally {
        setIsLoading(false);
      }
    }

    loadRelease();
  }, []);

  return {
    downloadUrl,
    isLoading,
    error,
    platform,
    allUrls,
    version
  };
}
