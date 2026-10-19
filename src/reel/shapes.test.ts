import { describe, expect, it } from 'vitest';
import { cloud, fromMask, plane, seeded } from './shapes';

const xs = (s: Float32Array) => s.filter((_, i) => i % 3 === 0);
const ys = (s: Float32Array) => s.filter((_, i) => i % 3 === 1);

describe('reel shapes', () => {
  it('is the same take every time', () => {
    expect(cloud(50, 100, 100, 100, seeded())).toEqual(cloud(50, 100, 100, 100, seeded()));
  });

  it('maps mask pixels to viewport-centred world units, y up', () => {
    const w = 10;
    const h = 10;
    const mask = new Uint8ClampedArray(w * h * 4);
    mask[(0 * w + 0) * 4 + 3] = 255; // top-left pixel only
    const s = fromMask(mask, w, h, 4, seeded());

    for (const x of xs(s)) expect(Math.abs(x - -5)).toBeLessThan(1);
    for (const y of ys(s)) expect(Math.abs(y - 5)).toBeLessThan(1);
  });

  // Regression: taking hits in scan order filled only the top of the glyphs.
  it('spreads particles over the whole mask when it has more pixels than particles', () => {
    const w = 100;
    const h = 100;
    const mask = new Uint8ClampedArray(w * h * 4).fill(255);
    const s = fromMask(mask, w, h, 50, seeded());

    expect(Math.max(...ys(s))).toBeGreaterThan(40);
    expect(Math.min(...ys(s))).toBeLessThan(-40);
  });

  it('refuses an empty mask rather than collapsing every particle to one spot', () => {
    expect(() => fromMask(new Uint8ClampedArray(16), 2, 2, 10, seeded())).toThrow();
  });

  it('fills the plane edge to edge before the pose moves it', () => {
    const s = plane(400, 200, 100, (p) => p);
    expect(Math.min(...xs(s))).toBe(-100);
    expect(Math.max(...xs(s))).toBe(100);
    expect(Math.max(...ys(s))).toBe(50);
    expect(Math.min(...ys(s))).toBeCloseTo(-50, 0);
  });
});
