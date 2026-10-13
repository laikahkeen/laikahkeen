import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { RateLimiter } from './ratelimit.js';
import { buildServer } from './server.js';

/**
 * Fetch-standard MCP endpoint. Runs anywhere `Request -> Response` runs —
 * Workers, Vercel Edge, Deno, Node 18+.
 *
 * Public and unauthenticated by design: "paste this URL into your client" only
 * works without a credential. That makes the rate limiter the only thing between
 * this endpoint and abuse, which is why it is the piece to review hardest.
 */

export const RATE_LIMIT = { limit: 30, windowMs: 60_000 } as const;

/** Module scope, so it survives across requests within one isolate. */
const defaultLimiter = new RateLimiter(RATE_LIMIT);

/** 1 MiB. A tool call on this server is a few hundred bytes; nothing legitimate is near this. */
const MAX_BODY_BYTES = 1_048_576;

function clientIp(request: Request): string {
  // Workers set CF-Connecting-IP. X-Forwarded-For is comma-separated with the
  // client first, and is only trustworthy behind a proxy that overwrites it.
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf;
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]?.trim() || 'unknown';
  return 'unknown';
}

function tooMany(resetAt: number): Response {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32029, message: `Rate limit exceeded. Retry in ${retryAfter}s.` },
      id: null,
    }),
    {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after': String(retryAfter),
        'x-ratelimit-limit': String(RATE_LIMIT.limit),
        'x-ratelimit-remaining': '0',
      },
    },
  );
}

/**
 * Takes its limiter so a test can supply a fresh one. Sharing the module-scope
 * limiter across tests would make them order-dependent.
 */
export function createMcpHandler(limiter: RateLimiter = defaultLimiter) {
  return async function handle(request: Request): Promise<Response> {
    return handleWith(limiter, request);
  };
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  return handleWith(defaultLimiter, request);
}

async function handleWith(limiter: RateLimiter, request: Request): Promise<Response> {
  const { allowed, resetAt } = limiter.check(clientIp(request));
  if (!allowed) return tooMany(resetAt);

  // Transport and server are per-request because a transport carries the state of
  // one exchange. keen-ops shares one server across requests and measured 5.05ms /
  // 4.07MB / 111k allocs for per-request construction — but that was 30 tools with
  // reflected schemas. At three tools the cost is noise; revisit if the count grows.
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless: every call is self-contained
    enableJsonResponse: true,
    maxRequestBodySize: MAX_BODY_BYTES,
  });

  const server = buildServer();
  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close();
  }
}

export default { fetch: handleMcpRequest };
