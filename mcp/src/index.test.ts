import { describe, expect, it } from 'vitest';
import { RateLimiter } from './ratelimit.js';
import { createMcpHandler } from './index.js';

const ACCEPT = 'application/json, text/event-stream';

function rpc(handler: (r: Request) => Promise<Response>, body: unknown, ip = '203.0.113.1') {
  return handler(
    new Request('https://mcp.example/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: ACCEPT, 'cf-connecting-ip': ip },
      body: JSON.stringify(body),
    }),
  );
}

const INITIALIZE = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '0' },
  },
};

describe('MCP endpoint', () => {
  it('completes an initialize handshake', async () => {
    const res = await rpc(createMcpHandler(new RateLimiter(RATE)), INITIALIZE);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result?.serverInfo?.name).toBe('laikahkeen');
    expect(body.error).toBeUndefined();
  });

  it('advertises exactly the three tools, with descriptions', async () => {
    // Three tools is a decision, not an accident (PLAN.md). If a fourth appears,
    // that should be a deliberate change and this test should be what stops it.
    const handler = createMcpHandler(new RateLimiter(RATE));
    await rpc(handler, INITIALIZE);
    const res = await rpc(handler, { jsonrpc: '2.0', id: 2, method: 'tools/list' });
    const body = await res.json();
    const names = (body.result?.tools ?? []).map((t: { name: string }) => t.name).sort();

    expect(names).toEqual(['get_experience', 'get_project', 'list_projects']);
    for (const tool of body.result.tools) {
      expect(tool.description?.length, `${tool.name} needs a real description`).toBeGreaterThan(40);
    }
  });

  it('returns project data through a tool call', async () => {
    const handler = createMcpHandler(new RateLimiter(RATE));
    await rpc(handler, INITIALIZE);
    const res = await rpc(handler, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'get_project', arguments: { slug: 'keen-ops' } },
    });
    const body = await res.json();
    const text = body.result?.content?.[0]?.text ?? '';
    expect(JSON.parse(text).slug).toBe('keen-ops');
  });

  it('reports an unknown slug as a tool error, not a transport failure', async () => {
    const handler = createMcpHandler(new RateLimiter(RATE));
    await rpc(handler, INITIALIZE);
    const res = await rpc(handler, {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: { name: 'get_project', arguments: { slug: 'nope' } },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result?.isError).toBe(true);
    // The model should be able to recover, so the error names the valid slugs.
    expect(body.result.content[0].text).toContain('keen-ops');
  });

  it('rate limits per IP and sets Retry-After', async () => {
    const handler = createMcpHandler(new RateLimiter({ limit: 2, windowMs: 60_000 }));
    expect((await rpc(handler, INITIALIZE, '198.51.100.7')).status).toBe(200);
    expect((await rpc(handler, INITIALIZE, '198.51.100.7')).status).toBe(200);

    const blocked = await rpc(handler, INITIALIZE, '198.51.100.7');
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);

    // A different caller is unaffected.
    expect((await rpc(handler, INITIALIZE, '198.51.100.8')).status).toBe(200);
  });
});

const RATE = { limit: 100, windowMs: 60_000 };
