import { describe, expect, it } from 'vitest';
import { RateLimiter } from './ratelimit.js';

describe('RateLimiter', () => {
  it('allows up to the limit then blocks', () => {
    const rl = new RateLimiter({ limit: 3, windowMs: 1000 });
    const t = 1_000_000;
    expect(rl.check('a', t).allowed).toBe(true);
    expect(rl.check('a', t).allowed).toBe(true);
    const third = rl.check('a', t);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);
    expect(rl.check('a', t).allowed).toBe(false);
  });

  it('counts each IP separately', () => {
    const rl = new RateLimiter({ limit: 1, windowMs: 1000 });
    expect(rl.check('a', 0).allowed).toBe(true);
    expect(rl.check('a', 0).allowed).toBe(false);
    expect(rl.check('b', 0).allowed).toBe(true);
  });

  it('slides the window rather than resetting on a fixed boundary', () => {
    const rl = new RateLimiter({ limit: 2, windowMs: 1000 });
    rl.check('a', 0);
    rl.check('a', 500);
    expect(rl.check('a', 900).allowed).toBe(false);
    // The hit at t=0 has aged out by t=1001; the one at t=500 has not.
    expect(rl.check('a', 1001).allowed).toBe(true);
    expect(rl.check('a', 1001).allowed).toBe(false);
  });

  it('reports when a slot frees up', () => {
    const rl = new RateLimiter({ limit: 1, windowMs: 1000 });
    rl.check('a', 5000);
    expect(rl.check('a', 5000).resetAt).toBe(6000);
  });

  it('holds a hard cap even when every tracked IP is still live', () => {
    // The case that matters: a spray from many addresses inside one window. Every
    // entry is live, so aging alone evicts nothing — the cap has to bite anyway or
    // the limiter becomes the denial of service.
    const rl = new RateLimiter({ limit: 1, windowMs: 100, maxTrackedIps: 5 });
    for (let i = 0; i < 20; i++) rl.check(`ip-${i}`, i);
    expect(rl.trackedIps).toBeLessThanOrEqual(5);
  });

  it('does not evict the caller being served in that same call', () => {
    // A caller must not be able to reset its own count by overflowing the map on
    // the very request being counted.
    const rl = new RateLimiter({ limit: 1, windowMs: 10_000, maxTrackedIps: 2 });
    rl.check('a', 0);
    rl.check('b', 1);
    expect(rl.check('a', 2).allowed).toBe(false);
  });

  it('KNOWN LIMIT: an IP spray evicts a victim and forgives its usage', () => {
    // Documented, not desired. A hard memory cap and perfect accounting cannot
    // both hold: once the cap bites, some live counter is dropped. Raising
    // maxTrackedIps raises the cost of doing this but never removes it — the real
    // answer is edge rate limiting in front of this process, which is a deploy
    // concern rather than an application one. Asserting it so the trade-off is
    // visible and cannot regress silently into a false sense of safety.
    const rl = new RateLimiter({ limit: 1, windowMs: 10_000, maxTrackedIps: 2 });
    expect(rl.check('victim', 0).allowed).toBe(true);
    for (let i = 1; i < 10; i++) rl.check(`spray-${i}`, i);
    expect(rl.check('victim', 20).allowed).toBe(true);
  });

  it('rejects nonsense configuration', () => {
    expect(() => new RateLimiter({ limit: 0, windowMs: 1000 })).toThrow();
    expect(() => new RateLimiter({ limit: 1, windowMs: 0 })).toThrow();
  });
});
