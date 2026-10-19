import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three';

// A plane carrying a 2D canvas, redrawn on demand. `px` is the long side in pixels.
export interface CanvasPanel {
  mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  g: CanvasRenderingContext2D;
  width: number;
  height: number;
  draw(paint: (g: CanvasRenderingContext2D, w: number, h: number) => void): void;
}

export function canvasPanel(width: number, height: number, px = 768): CanvasPanel {
  const canvas = document.createElement('canvas');
  const scale = px / Math.max(width, height);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const g = canvas.getContext('2d');
  if (!g) throw new Error('server: no 2d canvas');
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  const mesh = new Mesh(
    new PlaneGeometry(width, height),
    new MeshBasicMaterial({ map: texture, transparent: true, side: DoubleSide, toneMapped: false })
  );
  return {
    mesh,
    g,
    width: canvas.width,
    height: canvas.height,
    draw(paint) {
      g.clearRect(0, 0, canvas.width, canvas.height);
      paint(g, canvas.width, canvas.height);
      texture.needsUpdate = true;
    },
  };
}

export const MONO = '"JetBrains Mono", monospace';
export const SANS = 'Inter, system-ui, sans-serif';

// Word-wraps into maxWidth and returns the y after the last line.
export function wrap(
  g: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 99
) {
  const words = text.split(/\s+/);
  let line = '';
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (g.measureText(next).width > maxWidth && line) {
      if (++lines === maxLines) {
        g.fillText(`${line}…`, x, y);
        return y + lineHeight;
      }
      g.fillText(line, x, y);
      y += lineHeight;
      line = words[i];
    } else line = next;
  }
  if (line) g.fillText(line, x, y);
  return y + lineHeight;
}
