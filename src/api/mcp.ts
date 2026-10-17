export interface McpTool {
  name: string;
  description: string;
}

// The server echoes back the version it settled on; later requests send that.
const PROTOCOL_VERSION = '2025-06-18';

async function rpc(endpoint: string, body: object, signal: AbortSignal, protocolVersion?: string) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
  };
  if (protocolVersion) headers['mcp-protocol-version'] = protocolVersion;

  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal });
  if (!res.ok) throw new Error(`MCP endpoint returned ${res.status}`);
  const json = await res.json();
  if (!json?.result) throw new Error(json?.error?.message ?? 'MCP response had no result');
  return json.result;
}

/**
 * initialize, then tools/list. The server is stateless, so notifications/initialized
 * is skipped: there is no session to confirm, and it would cost a rate-limit unit.
 */
export async function fetchMcpTools(endpoint: string, signal: AbortSignal): Promise<McpTool[]> {
  const init = await rpc(
    endpoint,
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: 'laikahkeen.com', version: '1' },
      },
    },
    signal
  );
  const listed = await rpc(endpoint, { jsonrpc: '2.0', id: 2, method: 'tools/list' }, signal, init.protocolVersion);
  if (!Array.isArray(listed.tools)) throw new Error('tools/list returned no tools array');

  return listed.tools
    .filter((t: { name?: unknown }) => typeof t?.name === 'string')
    .map((t: { name: string; description?: unknown }) => ({
      name: t.name,
      description: typeof t.description === 'string' ? t.description : '',
    }));
}
