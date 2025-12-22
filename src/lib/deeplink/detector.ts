export interface ProtocolDetectionResult {
  installed: boolean | null;
  method: 'visibility' | 'blur' | 'timeout' | 'unknown';
  timestamp: number;
}

export interface ProtocolDetectorOptions {
  timeout?: number;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export class ProtocolDetector {
  async detect(
    url: string,
    options: ProtocolDetectorOptions = {}
  ): Promise<ProtocolDetectionResult> {
    const { timeout = 2500 } = options;

    return new Promise((resolve) => {
      let detected = false;
      let detectionMethod: ProtocolDetectionResult['method'] = 'unknown';
      const startTime = Date.now();

      const visibilityHandler = () => {
        if (document.hidden) {
          detected = true;
          detectionMethod = 'visibility';
          cleanup();
          options.onSuccess?.();
          resolve({
            installed: true,
            method: detectionMethod,
            timestamp: Date.now() - startTime,
          });
        }
      };

      document.addEventListener('visibilitychange', visibilityHandler);

      const blurHandler = () => {
        detected = true;
        detectionMethod = 'blur';
        cleanup();
        options.onSuccess?.();
        resolve({
          installed: true,
          method: detectionMethod,
          timestamp: Date.now() - startTime,
        });
      };

      window.addEventListener('blur', blurHandler);

      const timeoutId = setTimeout(() => {
        if (!detected) {
          cleanup();
          options.onFailure?.();
          resolve({
            installed: false,
            method: 'timeout',
            timestamp: Date.now() - startTime,
          });
        }
      }, timeout);

      const cleanup = () => {
        document.removeEventListener('visibilitychange', visibilityHandler);
        window.removeEventListener('blur', blurHandler);
        clearTimeout(timeoutId);
      };

      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);

        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 500);
      } catch (error) {
        console.error('Error opening protocol:', error);
        cleanup();
        resolve({
          installed: false,
          method: 'unknown',
          timestamp: Date.now() - startTime,
        });
      }
    });
  }

  open(url: string): void {
    try {
      window.location.href = url;
    } catch (error) {
      console.error('Error opening deep link:', error);
    }
  }
}

export const protocolDetector = new ProtocolDetector();
