// Particle formations for the hero reel. Each is `count` xyz triples in world
// space, where one unit is one CSS pixel and the origin is the viewport centre.

export type Shape = Float32Array;
type Rand = () => number;

// Seeded, so every viewer sees the same take.
export function seeded(seed = 0x5eed): Rand {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function cloud(count: number, width: number, height: number, depth: number, rand: Rand): Shape {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * width;
    out[i * 3 + 1] = (rand() - 0.5) * height;
    out[i * 3 + 2] = (rand() - 0.5) * depth;
  }
  return out;
}

export function point(count: number, spread: number, rand: Rand): Shape {
  return cloud(count, spread, spread, spread, rand);
}

// An evenly filled rectangle in the XY plane, then moved by `transform` (e.g. a mesh's pose).
export function plane(
  count: number,
  width: number,
  height: number,
  transform: (xyz: [number, number, number]) => [number, number, number]
): Shape {
  const out = new Float32Array(count * 3);
  const cols = Math.max(1, Math.round(Math.sqrt((count * width) / height)));
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const x = ((i % cols) / Math.max(1, cols - 1) - 0.5) * width;
    const y = (0.5 - Math.floor(i / cols) / Math.max(1, rows - 1)) * height;
    out.set(transform([x, y, 0]), i * 3);
  }
  return out;
}

// Points on the opaque pixels of an RGBA mask the size of the viewport.
// Fewer pixels than particles is fine: particles double up and the shape reads denser.
export function fromMask(mask: Uint8ClampedArray, width: number, height: number, count: number, rand: Rand): Shape {
  const hits: number[] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (mask[(y * width + x) * 4 + 3] > 127) hits.push(x, y);
    }
  }
  if (!hits.length) throw new Error('reel: mask has no opaque pixels');
  const out = new Float32Array(count * 3);
  const n = hits.length / 2;
  for (let i = 0; i < count; i++) {
    const j = Math.floor((i * n) / count);
    out[i * 3] = hits[j * 2] + (rand() - 0.5) * 1.5 - width / 2;
    out[i * 3 + 1] = height / 2 - hits[j * 2 + 1] + (rand() - 0.5) * 1.5;
    out[i * 3 + 2] = 0;
  }
  return out;
}
