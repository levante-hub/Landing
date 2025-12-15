export type MCPTransport = 'stdio' | 'sse' | 'streamable-http' | 'http';

export interface MCPConfigurationTemplate {
  type: MCPTransport;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
}

export interface MCPConfigurationField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'password';
  required: boolean;
  description?: string;
  default?: string | number | boolean;
}

export interface MCPConfiguration {
  template?: MCPConfigurationTemplate;
  fields?: MCPConfigurationField[];
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  logoUrl?: string;
  source: 'official' | 'community';
  transport: 'stdio' | 'sse' | 'streamable-http';
  status?: 'active' | 'deprecated' | 'experimental';
  version?: string;
  maintainer?: {
    name: string;
    url?: string;
    github?: string;
  };
  metadata?: {
    homepage?: string;
    repository?: string;
    author?: string;
  };
  configuration?: MCPConfiguration;
}
