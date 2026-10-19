import { afterEach, describe, expect, it, vi } from 'vitest';
import { callMcpTool } from './mcp';

const respond = (result: object) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ jsonrpc: '2.0', id: 3, result }), { status: 200 }))
  );

describe('callMcpTool', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the JSON the server put in its text block', async () => {
    respond({ content: [{ type: 'text', text: '[{"slug":"keen-ops"}]' }] });
    const data = await callMcpTool('https://x/mcp', '2025-06-18', 'list_projects', {}, new AbortController().signal);
    expect(data).toEqual([{ slug: 'keen-ops' }]);
  });

  it('throws on a tool error rather than returning its message as data', async () => {
    respond({ isError: true, content: [{ type: 'text', text: 'No project with slug "x"' }] });
    await expect(
      callMcpTool('https://x/mcp', '2025-06-18', 'get_project', { slug: 'x' }, new AbortController().signal)
    ).rejects.toThrow('No project with slug "x"');
  });
});
