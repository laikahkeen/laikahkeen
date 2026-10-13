import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { createMcpHandler } from './index.js';
import { RateLimiter } from './ratelimit.js';

/**
 * End-to-end against the SDK's OWN client over real HTTP.
 *
 * The other tests drive the handler with hand-written JSON-RPC, which proves the
 * handler behaves but not that a real MCP client can hold a session with it —
 * a distinction worth keeping, because "paste this URL into your client" is the
 * entire product claim. This closes that gap without needing a deploy.
 */

type FetchHandler = (request: Request) => Promise<Response>;

/** Minimal node:http -> fetch bridge. Safe to buffer because the transport is
 *  configured for JSON responses, not SSE streams. */
function bridge(handler: FetchHandler) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v === undefined) continue;
      headers.set(k, Array.isArray(v) ? v.join(', ') : v);
    }

    const request = new Request(`http://127.0.0.1${req.url ?? '/'}`, {
      method: req.method,
      headers,
      body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
    });

    const response = await handler(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  };
}

let server: Server;
let url: URL;

beforeAll(async () => {
  const handler = createMcpHandler(new RateLimiter({ limit: 500, windowMs: 60_000 }));
  server = createServer(bridge(handler));
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  url = new URL(`http://127.0.0.1:${(server.address() as AddressInfo).port}/mcp`);
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

async function connected(): Promise<Client> {
  const client = new Client({ name: 'e2e', version: '0' });
  await client.connect(new StreamableHTTPClientTransport(url));
  return client;
}

describe('a real MCP client over real HTTP', () => {
  it('connects and reports the server it reached', async () => {
    const client = await connected();
    expect(client.getServerVersion()?.name).toBe('laikahkeen');
    await client.close();
  });

  it('discovers the three tools with usable schemas', async () => {
    const client = await connected();
    const { tools } = await client.listTools();

    expect(tools.map((t) => t.name).sort()).toEqual(['get_experience', 'get_project', 'list_projects']);
    const getProject = tools.find((t) => t.name === 'get_project');
    // An agent picks a tool from its description and fills it from the schema.
    expect(getProject?.inputSchema?.properties).toHaveProperty('slug');
    await client.close();
  });

  it('calls a tool and gets the site’s own data back', async () => {
    const client = await connected();
    const result = await client.callTool({ name: 'get_project', arguments: { slug: 'keen-ops' } });
    const content = result.content as Array<{ type: string; text: string }>;
    const payload = JSON.parse(content[0]!.text);

    expect(payload.slug).toBe('keen-ops');
    expect(payload.caseStudy).toBe('https://laikahkeen.com/work/keen-ops');
    expect(payload.problem).toBeTruthy();
    await client.close();
  });

  it('surfaces a bad slug as a recoverable tool error', async () => {
    const client = await connected();
    const result = await client.callTool({ name: 'get_project', arguments: { slug: 'nope' } });
    expect(result.isError).toBe(true);
    const content = result.content as Array<{ text: string }>;
    expect(content[0]!.text).toContain('keen-ops');
    await client.close();
  });

  it('returns a schema violation as a recoverable tool error, not a transport failure', async () => {
    // Worth pinning: the SDK validates against the zod schema and hands the model
    // an isError result it can read and retry from, rather than throwing and
    // killing the turn. A client that treated this as fatal would be wrong.
    const client = await connected();
    const result = await client.callTool({
      name: 'list_projects',
      arguments: { status: 'not-a-status' },
    });

    expect(result.isError).toBe(true);
    const content = result.content as Array<{ text: string }>;
    expect(content[0]!.text.length).toBeGreaterThan(0);
    await client.close();
  });
});
