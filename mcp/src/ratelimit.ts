/**
 * Per-IP sliding-window limiter for a public, unauthenticated endpoint.
 *
 * keen-ops has no rate limiting to copy — a private bearer made it unnecessary
 * there — so this is written from scratch and is the piece most worth reviewing.
 *
 * In-memory on purpose: v1 has no inference spend to protect, so the job here is
 * abuse resistance, not accounting. A counter that resets on redeploy is fine for
 * that and would NOT be fine for a spend ledger.
 *
 * KNOWN LIMIT: bounded memory and exact accounting are mutually exclusive. Once
 * maxTrackedIps bites, some live counter is dropped — so an IP spray can evict a
 * specific victim and hand it a fresh allowance. Raising the cap raises the cost
 * of that, never removes it. Edge rate limiting in front of this process is the
 * actual defence; this is the second layer, not the only one. Covered by a test
 * named KNOWN LIMIT so it cannot quietly become a claim of safety.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Unix ms when the oldest hit in the window expires. */
  resetAt: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /**
   * Hard cap on tracked IPs. Without one, a spray across many source addresses
   * grows the map without bound — its own denial of service, delivered by the
   * thing meant to prevent one.
   *
   * Aged-out entries go first. If everything is still live the least-recently-seen
   * entries are dropped anyway, which forgives those IPs' usage. That is the
   * deliberate trade: bounded memory over perfect accounting, and shedding state
   * under a spray is exactly when the trade is worth making.
   */
  maxTrackedIps?: number;
}

export class RateLimiter {
  private readonly hits = new Map<string, number[]>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly maxTrackedIps: number;

  constructor({ limit, windowMs, maxTrackedIps = 10_000 }: RateLimiterOptions) {
    if (limit < 1) throw new Error('limit must be >= 1');
    if (windowMs < 1) throw new Error('windowMs must be >= 1');
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxTrackedIps = maxTrackedIps;
  }

  check(ip: string, now: number = Date.now()): RateLimitResult {
    const cutoff = now - this.windowMs;
    const recent = (this.hits.get(ip) ?? []).filter((t) => t > cutoff);

    if (recent.length >= this.limit) {
      // Oldest surviving hit decides when a slot frees up. Non-null: length >= limit >= 1.
      const oldest = recent[0] as number;
      return { allowed: false, remaining: 0, resetAt: oldest + this.windowMs };
    }

    recent.push(now);
    this.hits.set(ip, recent);
    if (this.hits.size > this.maxTrackedIps) this.enforceCap(cutoff, ip);

    return {
      allowed: true,
      remaining: this.limit - recent.length,
      resetAt: (recent[0] as number) + this.windowMs,
    };
  }

  /**
   * Bring the map back to the cap. Aged-out entries first; if that is not enough,
   * drop least-recently-seen live entries too. `keep` is the caller being served
   * right now, which is never evicted — losing its hit would let a repeat caller
   * reset itself by cycling the map.
   */
  private enforceCap(cutoff: number, keep: string): void {
    for (const [ip, times] of this.hits) {
      const live = times.filter((t) => t > cutoff);
      if (live.length === 0) this.hits.delete(ip);
      else this.hits.set(ip, live);
    }

    if (this.hits.size <= this.maxTrackedIps) return;

    const byLastSeen = [...this.hits.entries()]
      .filter(([ip]) => ip !== keep)
      .sort((a, b) => (a[1].at(-1) ?? 0) - (b[1].at(-1) ?? 0));

    let over = this.hits.size - this.maxTrackedIps;
    for (const [ip] of byLastSeen) {
      if (over <= 0) break;
      this.hits.delete(ip);
      over--;
    }
  }

  get trackedIps(): number {
    return this.hits.size;
  }
}
