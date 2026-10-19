import type { McpPanelCopy, ServerGameCopy } from '../types/index.ts';

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

// The room behind the hero, entered after the reel. Each terminal is one real tool call.
export const serverGame: ServerGameCopy = {
  enter: 'Enter the server',
  connecting: 'Connecting…',
  hint: 'Each terminal is a tool on the MCP server. Pick one.',
  live: 'Live: answered by the endpoint just now',
  replay: 'Replay: endpoint unreachable, same data from this site',
  exit: 'Exit',
  done: 'Back to the site',
  caseStudy: 'Read the case study',
  tools: {
    list_projects: 'Projects',
    get_project: 'One project, in depth',
    get_experience: 'Experience',
  },
};
