import { describe, expect, it } from 'vitest';
import { RateLimiter } from './ratelimit.ts';
import { createMcpHandler } from './index.ts';

const ACCEPT = 'application/json, text/event-stream';

function rpc(handler: (r: Request) => Promise<Response>, body: unknown, ip = '203.0.113.1') {
  return handler(
    new Request('https://mcp.example/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: ACCEPT, 'x-real-ip': ip },
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

  it('ignores caller-supplied forwarding headers when keying the limit', async () => {
    const handler = createMcpHandler(new RateLimiter({ limit: 1, windowMs: 60_000 }));
    const spoofed = (n: number) =>
      handler(
        new Request('https://mcp.example/mcp', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: ACCEPT,
            'x-real-ip': '198.51.100.9',
            'cf-connecting-ip': `203.0.113.${n}`,
            'x-forwarded-for': `203.0.113.${n}`,
          },
          body: JSON.stringify(INITIALIZE),
        }),
      );
    expect((await spoofed(1)).status).toBe(200);
    expect((await spoofed(2)).status).toBe(429);
  });

  it('keys IPv6 on its /64, so one subscriber cannot rotate addresses for fresh allowances', async () => {
    const handler = createMcpHandler(new RateLimiter({ limit: 1, windowMs: 60_000 }));
    expect((await rpc(handler, INITIALIZE, '2001:db8:1:2::1')).status).toBe(200);
    expect((await rpc(handler, INITIALIZE, '2001:0db8:0001:0002:ffff:0:0:9')).status).toBe(429);
    expect((await rpc(handler, INITIALIZE, '2001:db8:1:3::1')).status).toBe(200);
  });

  it('keys an IPv4-mapped IPv6 address as the IPv4 address it carries', async () => {
    const handler = createMcpHandler(new RateLimiter({ limit: 1, windowMs: 60_000 }));
    expect((await rpc(handler, INITIALIZE, '::ffff:198.51.100.20')).status).toBe(200);
    expect((await rpc(handler, INITIALIZE, '198.51.100.20')).status).toBe(429);
    expect((await rpc(handler, INITIALIZE, '198.51.100.21')).status).toBe(200);
  });
});

const RATE = { limit: 100, windowMs: 60_000 };

const SITE = 'https://laikahkeen.com';

function preflight(handler: (r: Request) => Promise<Response>, origin: string) {
  return handler(
    new Request('https://mcp.example/mcp', {
      method: 'OPTIONS',
      headers: {
        origin,
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type, mcp-protocol-version',
        'x-real-ip': '203.0.113.50',
      },
    }),
  );
}

function post(handler: (r: Request) => Promise<Response>, origin: string, ip = '203.0.113.51') {
  return handler(
    new Request('https://mcp.example/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: ACCEPT, 'x-real-ip': ip, origin },
      body: JSON.stringify(INITIALIZE),
    }),
  );
}

describe('CORS', () => {
  it('answers a preflight from the site with what the panel sends', async () => {
    const res = await preflight(createMcpHandler(new RateLimiter(RATE)), SITE);
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe(SITE);
    expect(res.headers.get('access-control-allow-methods')).toContain('POST');
    const allowed = res.headers.get('access-control-allow-headers') ?? '';
    for (const h of ['content-type', 'accept', 'mcp-protocol-version']) expect(allowed).toContain(h);
    expect(res.headers.get('vary')).toContain('Origin');
  });

  it('allows the Vite dev server', async () => {
    const res = await preflight(createMcpHandler(new RateLimiter(RATE)), 'http://localhost:5173');
    expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
  });

  it('grants nothing to another origin', async () => {
    const handler = createMcpHandler(new RateLimiter(RATE));
    const pre = await preflight(handler, 'https://elsewhere.example');
    expect(pre.headers.get('access-control-allow-origin')).toBeNull();
    expect(pre.headers.get('access-control-allow-methods')).toBeNull();
    // CORS is enforced by the browser, so the server still answers — it just
    // does not let a foreign page read the response.
    const res = await post(handler, 'https://elsewhere.example');
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('lets the site read the actual response', async () => {
    const res = await post(createMcpHandler(new RateLimiter(RATE)), SITE);
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe(SITE);
    expect((await res.json()).result?.serverInfo?.name).toBe('laikahkeen');
  });

  it('does not count preflights against the limit', async () => {
    const handler = createMcpHandler(new RateLimiter({ limit: 1, windowMs: 60_000 }));
    for (let i = 0; i < 5; i++) expect((await preflight(handler, SITE)).status).toBe(204);
    expect((await post(handler, SITE, '203.0.113.50')).status).toBe(200);
  });

  it('lets the site read a 429, so the panel sees a status rather than a network error', async () => {
    const handler = createMcpHandler(new RateLimiter({ limit: 1, windowMs: 60_000 }));
    await post(handler, SITE, '198.51.100.20');
    const blocked = await post(handler, SITE, '198.51.100.20');
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('access-control-allow-origin')).toBe(SITE);
  });
});
