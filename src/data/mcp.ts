import type { McpPanelCopy } from '../types/index.ts';

// The public MCP server in mcp/. No tool names here on purpose: a list kept in
// this file could go stale and still read as live.
export const mcpPanel: McpPanelCopy = {
  endpoint: 'https://mcp.laikahkeen.com/mcp',
  eyebrow: 'MCP server',
  heading: 'Point an agent at this site',
  intro:
    'The projects and experience on this page are also served over the Model Context Protocol, from the same data files. Paste the endpoint into any MCP client. It is public, read-only and rate limited.',
  endpointLabel: 'Endpoint',
  toolsLabel: 'Tools it serves',
  status: {
    checking: 'Checking the endpoint…',
    live: 'Live. Tool list fetched from the endpoint just now.',
    unreachable: 'Not reachable from your browser right now. The tool list appears here when it is.',
  },
  sourceLabel: 'Server source',
  sourceUrl: 'https://github.com/laikahkeen/laikahkeen/tree/master/mcp',
};
