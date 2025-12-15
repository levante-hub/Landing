import { MCPServerExtended } from '@/lib/registry/types';

export interface DeepLinkBuilderOptions {
  entry: MCPServerExtended;
  skipValidation?: boolean;
}

export interface DeepLinkResult {
  url: string | null;
  error?: string;
  warnings?: string[];
}

export class DeepLinkBuilder {
  build(options: DeepLinkBuilderOptions): DeepLinkResult {
    const { entry, skipValidation = false } = options;
    const warnings: string[] = [];

    const template = entry.configuration?.template;
    if (!template) {
      return {
        url: null,
        error: 'Entry missing configuration template',
      };
    }

    // Infer transport type: prefer template.type; if missing but we have a command, fall back to entry.transport (stdio flow)
    const inferredType = template.type || (template.command ? entry.transport : undefined);
    if (!inferredType) {
      return {
        url: null,
        error: 'Missing transport type in template',
      };
    }

    const params = new URLSearchParams();
    params.set('name', entry.name);
    params.set('transport', inferredType);

    if (inferredType === 'stdio') {
      if (!template.command) {
        return {
          url: null,
          error: 'STDIO entry missing command',
        };
      }

      if (!skipValidation) {
        const validation = this.validateCommand(template.command);
        if (!validation.valid) {
          return {
            url: null,
            error: validation.error || 'Blocked command detected',
          };
        }
      }

      params.set('command', template.command);

      if (template.args && template.args.length > 0) {
        if (!skipValidation) {
          const validation = this.validateArgs(template.args);
          if (!validation.valid) {
            return {
              url: null,
              error: validation.error || 'Invalid arguments detected',
            };
          }
          if (validation.warnings) {
            warnings.push(...validation.warnings);
          }
        }

        params.set('args', template.args.join(','));
      }

      if (template.env && Object.keys(template.env).length > 0) {
        warnings.push(
          'This MCP requires environment variables. Configure them in Levante after installation.'
        );
      }
    } else if (
      inferredType === 'http' ||
      inferredType === 'sse' ||
      inferredType === 'streamable-http'
    ) {
      if (!template.url) {
        return {
          url: null,
          error: 'HTTP entry missing URL',
        };
      }

      params.set('url', template.url);

      if (template.headers && Object.keys(template.headers).length > 0) {
        if (!skipValidation) {
          const validation = this.validateHeaders(template.headers);
          if (!validation.valid) {
            return {
              url: null,
              error: validation.error || 'Invalid headers detected',
            };
          }
        }

        params.set('headers', JSON.stringify(template.headers));
      }
    }

    const url = `levante://mcp/add?${params.toString()}`;

    if (!skipValidation) {
      const validation = this.validateUrl(url);
      if (!validation.valid) {
        return {
          url: null,
          error: validation.error || 'Final URL validation failed',
        };
      }
    }

    return {
      url,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  private validateCommand(command: string): { valid: boolean; error?: string } {
    const blockedCommands = ['bash', 'sh', 'curl', 'rm', 'sudo'];
    if (blockedCommands.includes(command.toLowerCase())) {
      return {
        valid: false,
        error: `Blocked command detected: ${command}`,
      };
    }

    return { valid: true };
  }

  private validateArgs(
    args: string[]
  ): { valid: boolean; error?: string; warnings?: string[] } {
    const dangerousPatterns = [
      { pattern: /&&/, message: 'Shell operator && detected' },
      { pattern: /\|\|/, message: 'Shell operator || detected' },
      { pattern: /;/, message: 'Shell operator ; detected' },
      { pattern: /\|/, message: 'Pipe operator detected' },
      { pattern: /`/, message: 'Backtick operator detected' },
      { pattern: /\$\(/, message: 'Command substitution detected' },
      { pattern: />/i, message: 'Redirect operator detected' },
      { pattern: /</i, message: 'Redirect operator detected' },
      { pattern: /\.\.\//, message: 'Path traversal detected' },
      { pattern: /rm\s+-rf/i, message: 'Dangerous command detected' },
    ];

    const blockedFlags = ['-e', '--eval', '-c', '--command', '--call'];

    for (const arg of args) {
      if (blockedFlags.includes(arg.toLowerCase())) {
        return {
          valid: false,
          error: `Blocked flag detected: ${arg}`,
        };
      }

      for (const { pattern, message } of dangerousPatterns) {
        if (pattern.test(arg)) {
          return {
            valid: false,
            error: `${message} in argument: ${arg}`,
          };
        }
      }
    }

    return { valid: true };
  }

  private validateHeaders(
    headers: Record<string, string>
  ): { valid: boolean; error?: string } {
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value !== 'string') {
        return {
          valid: false,
          error: `Invalid header value type for ${key}`,
        };
      }
      if (value.includes('<script>')) {
        return {
          valid: false,
          error: 'Script tag detected in headers',
        };
      }
      if (value.includes('javascript:')) {
        return {
          valid: false,
          error: 'JavaScript protocol detected in headers',
        };
      }
    }
    return { valid: true };
  }

  private validateUrl(url: string): { valid: boolean; error?: string } {
    if (url.length > 2048) {
      return {
        valid: false,
        error: `URL too long: ${url.length} characters`,
      };
    }

    if (!url.startsWith('levante://mcp/add?')) {
      return {
        valid: false,
        error: 'Invalid protocol',
      };
    }

    return { valid: true };
  }

  getCommandPreview(entry: MCPServerExtended): string {
    const template = entry.configuration?.template;
    if (!template) return 'N/A';

    const inferredType = template.type || (template.command ? entry.transport : undefined);

    if (inferredType === 'stdio') {
      const cmd = template.command || '';
      const args = template.args?.join(' ') || '';
      return `${cmd} ${args}`.trim();
    }
    return template.url || 'N/A';
  }

  requiresConfiguration(entry: MCPServerExtended): boolean {
    const fields = entry.configuration?.fields || [];
    return fields.some((f) => f.required);
  }

  getRequiredFields(entry: MCPServerExtended) {
    return entry.configuration?.fields?.filter((f) => f.required) || [];
  }
}

export const deepLinkBuilder = new DeepLinkBuilder();
