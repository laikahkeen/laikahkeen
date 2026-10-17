import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import ipaddr from 'ipaddr.js';
import { RateLimiter } from './ratelimit.ts';
import { buildServer } from './server.ts';

/**
 * Public and unauthenticated by design: "paste this URL into your client" only
 * works without a credential. That makes the rate limiter the only thing between
 * this endpoint and abuse, which is why it is the piece to review hardest.
 */

export const RATE_LIMIT = { limit: 30, windowMs: 60_000 } as const;

/** Module scope: one Node process on Railway, so this is the whole count. */
const defaultLimiter = new RateLimiter(RATE_LIMIT);

/** 1 MiB. A tool call on this server is a few hundred bytes; nothing legitimate is near this. */
const MAX_BODY_BYTES = 1_048_576;

function clientKey(request: Request): string {
  // Railway's edge sets X-Real-IP and, per Railway staff (2026-10), overwrites a
  // caller-supplied one; its docs say only that it carries the client IP. Every
  // other forwarding header is caller-controlled here — trusting one lets any
  // client mint a fresh allowance per request. Re-verify with a spoofed header
  // after any change of host or proxy (orange-clouding the DNS breaks this).
  const raw = request.headers.get('x-real-ip');
  if (!raw || !ipaddr.isValid(raw)) return 'unknown';
  const addr = ipaddr.process(raw); // ::ffff:a.b.c.d comes back as IPv4
  if (addr.kind() === 'ipv4') return addr.toString();
  // One IPv6 subscriber is routinely handed a whole /64; per-address keying gives it 2^64 allowances.
  return `${(addr as ipaddr.IPv6).parts.slice(0, 4).map((p) => p.toString(16)).join(':')}::/64`;
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
  const { allowed, resetAt } = limiter.check(clientKey(request));
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
