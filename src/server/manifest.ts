// What each tool call turns into in the room. Builders only place meshes at their
// resting pose; ServerGame.vue animates them in.
import { Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, Vector3, type Texture } from 'three';
import type { getExperience, getProject, listProjects } from '../../mcp/src/payloads.ts';
import type { McpToolName } from '../types/index.ts';
import { canvasPanel, MONO, SANS, wrap, type CanvasPanel } from './panels';
import type { Frame } from './scene';

export type Projects = ReturnType<typeof listProjects>;
export type Project = NonNullable<ReturnType<typeof getProject>>;
export type Experience = ReturnType<typeof getExperience>;

export interface View {
  pos: Vector3;
  look: Vector3;
}

const GREY = '#8a8a8a';
const RULE = '#3a3a3a';

export interface ScreenState {
  tool: McpToolName;
  call: string;
  caption: string;
  phase: 'idle' | 'calling' | 'answered';
  hover: boolean;
  visited: boolean;
  live: boolean;
  status: string;
  json: string;
  // Characters of `json` typed so far.
  shown: number;
  gold: string;
}

export function drawScreen(panel: CanvasPanel, s: ScreenState) {
  panel.draw((g, w, h) => {
    const pad = w * 0.06;
    g.fillStyle = s.hover ? '#16161a' : '#0b0b0d';
    g.fillRect(0, 0, w, h);
    g.textBaseline = 'top';

    g.font = `500 ${w * 0.024}px ${MONO}`;
    g.fillStyle = GREY;
    g.fillText(`MCP  ·  tools/call`, pad, pad);
    if (s.visited) {
      g.textAlign = 'right';
      g.fillText('✓ called', w - pad, pad);
      g.textAlign = 'left';
    }

    if (s.phase !== 'answered') {
      g.font = `600 ${w * 0.062}px ${MONO}`;
      g.fillStyle = '#fff';
      g.fillText(s.call, pad, h * 0.36);
      g.font = `400 ${w * 0.03}px ${SANS}`;
      g.fillStyle = GREY;
      g.fillText(s.caption, pad, h * 0.36 + w * 0.09);
      g.font = `500 ${w * 0.026}px ${MONO}`;
      g.fillStyle = s.hover ? '#fff' : GREY;
      g.fillText(
        s.phase === 'calling' ? '→ calling…' : s.hover ? '▶ click to call' : '▷ call',
        pad,
        h - pad - w * 0.03
      );
      return;
    }

    // The status line is the one place the accent appears on a screen, and only when live.
    g.font = `500 ${w * 0.026}px ${MONO}`;
    g.fillStyle = s.live ? s.gold : GREY;
    g.fillText(`${s.live ? '●' : '○'} ${s.status}`, pad, pad + w * 0.045);
    g.font = `400 ${w * 0.022}px ${MONO}`;
    g.fillStyle = '#d6d6d6';
    const lineH = w * 0.032;
    const lines = s.json.slice(0, s.shown).split('\n');
    const fit = Math.floor((h - pad * 2 - w * 0.11) / lineH);
    lines.slice(Math.max(0, lines.length - fit)).forEach((line, i) => {
      g.fillText(line.length > 70 ? `${line.slice(0, 69)}…` : line, pad, pad + w * 0.11 + i * lineH);
    });
  });
}

const place = (f: Frame, out: number, right: number, up: number) =>
  f.centre.clone().addScaledVector(f.normal, out).addScaledVector(f.right, right).addScaledVector(f.up, up);

const face = (mesh: Mesh, f: Frame) => {
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), f.normal);
};

// Live data gets an accent rule along the top; a replay gets a neutral one.
const rule = (g: CanvasRenderingContext2D, w: number, live: boolean, gold: string) => {
  g.fillStyle = live ? gold : RULE;
  g.fillRect(0, 0, w, Math.max(3, w * 0.006));
};

export function projectCards(list: Projects, f: Frame, o: { live: boolean; gold: string; portrait: boolean }) {
  const cols = o.portrait ? 2 : list.length;
  const cw = 1.0;
  const ch = 0.62;
  const meshes = list.map((p, i) => {
    const panel = canvasPanel(cw, ch, 640);
    panel.draw((g, w, h) => {
      const pad = w * 0.07;
      g.fillStyle = '#0c0c0e';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = RULE;
      g.strokeRect(1, 1, w - 2, h - 2);
      rule(g, w, o.live, o.gold);
      g.textBaseline = 'top';
      g.font = `500 ${w * 0.034}px ${MONO}`;
      g.fillStyle = GREY;
      g.fillText(`${p.status}${p.featured ? '  ·  featured' : ''}`.toUpperCase(), pad, pad);
      g.font = `600 ${w * 0.085}px ${SANS}`;
      g.fillStyle = '#fff';
      g.fillText(p.title, pad, pad + w * 0.07);
      g.font = `400 ${w * 0.04}px ${SANS}`;
      g.fillStyle = '#cfcfcf';
      wrap(g, p.summary, pad, pad + w * 0.2, w - pad * 2, w * 0.055, 3);
      g.font = `400 ${w * 0.03}px ${MONO}`;
      g.fillStyle = GREY;
      wrap(g, p.tech.join(' · '), pad, h - pad - w * 0.08, w - pad * 2, w * 0.042, 2);
    });
    const r = Math.floor(i / cols);
    const c = i % cols;
    const rows = Math.ceil(list.length / cols);
    const rowLen = Math.min(cols, list.length - r * cols);
    panel.mesh.position.copy(
      place(f, 1.15, (c - (rowLen - 1) / 2) * (cw + 0.1), 0.15 + ((rows - 1) / 2 - r) * (ch + 0.1))
    );
    face(panel.mesh, f);
    return panel.mesh;
  });
  const back = o.portrait ? 4.1 : 4.4;
  return { meshes, view: { pos: place(f, back, 0, 0.35), look: place(f, 1.15, 0, 0.15) } };
}

// The product screenshot, cut into tiles that fly together, with a caption under it.
export function projectBuild(
  image: string,
  p: Project,
  f: Frame,
  o: { live: boolean; gold: string; portrait: boolean }
) {
  const pw = 2.4;
  const ph = (pw * 9) / 16;
  const cols = 12;
  const rows = 7;
  const texture: Texture = new TextureLoader().load(image, (t) => {
    const img = t.image as HTMLImageElement;
    const ratio = img.width / img.height / (pw / ph);
    if (ratio > 1) {
      t.repeat.set(1 / ratio, 1);
      t.offset.set((1 - 1 / ratio) / 2, 0);
    } else {
      t.repeat.set(1, ratio);
      t.offset.set(0, 1 - ratio);
    }
  });
  texture.colorSpace = SRGBColorSpace;
  const material = new MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false });

  const tw = pw / cols;
  const th = ph / rows;
  const tiles: Mesh[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const geo = new PlaneGeometry(tw, th);
      const uv = geo.attributes.uv;
      for (let k = 0; k < uv.count; k++) {
        uv.setXY(k, (c + uv.getX(k)) / cols, 1 - (r + 1 - uv.getY(k)) / rows);
      }
      const tile = new Mesh(geo, material);
      tile.position.copy(place(f, 1.0, -pw / 2 + tw * (c + 0.5), 0.45 + ph / 2 - th * (r + 0.5)));
      face(tile, f);
      tiles.push(tile);
    }
  }

  const caption = canvasPanel(pw, 0.5, 1024);
  caption.draw((g, w, h) => {
    const pad = w * 0.03;
    g.fillStyle = '#0c0c0e';
    g.fillRect(0, 0, w, h);
    rule(g, w, o.live, o.gold);
    g.textBaseline = 'top';
    g.font = `600 ${w * 0.034}px ${SANS}`;
    g.fillStyle = '#fff';
    g.fillText(p.title, pad, pad * 1.2);
    g.font = `400 ${w * 0.02}px ${SANS}`;
    g.fillStyle = '#cfcfcf';
    wrap(g, p.outcome ?? p.summary, pad, pad * 1.2 + w * 0.055, w - pad * 2, w * 0.028, 3);
    g.font = `400 ${w * 0.016}px ${MONO}`;
    g.fillStyle = GREY;
    g.fillText(p.tech.join(' · '), pad, h - pad - w * 0.016);
  });
  caption.mesh.position.copy(place(f, 1.05, 0, 0.45 - ph / 2 - 0.33));
  face(caption.mesh, f);

  // Aimed below the build's centre, so it sits clear of the HUD along the bottom.
  const back = o.portrait ? 4.5 : 4.7;
  return { tiles, caption: caption.mesh, view: { pos: place(f, back, 0, 0.2), look: place(f, 1.0, 0, -0.05) } };
}

// One panel per role down the aisle, newest nearest the terminals. The camera walks it
// from the entry end, oldest first, and stops at the current role.
export function experienceCorridor(roles: Experience, entry: View, o: { live: boolean; gold: string }) {
  const along = entry.pos.clone().sub(entry.look).setY(0).normalize();
  const side = new Vector3(along.z, 0, -along.x);
  // Far enough down the aisle to stay out of the terminal shots.
  const start = entry.look.clone().setY(1.75).addScaledVector(along, 4.5);
  const step = 2.4;
  const panels = roles.map((e, i) => {
    const panel = canvasPanel(1.6, 1.0, 900);
    panel.draw((g, w, h) => {
      const pad = w * 0.06;
      g.fillStyle = '#0c0c0e';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = RULE;
      g.strokeRect(1, 1, w - 2, h - 2);
      rule(g, w, o.live, o.gold);
      g.textBaseline = 'top';
      g.font = `500 ${w * 0.032}px ${MONO}`;
      g.fillStyle = GREY;
      g.fillText(`${e.period}${e.current ? '  ·  NOW' : ''}`, pad, pad);
      g.font = `600 ${w * 0.06}px ${SANS}`;
      g.fillStyle = '#fff';
      const y = wrap(g, e.role, pad, pad + w * 0.06, w - pad * 2, w * 0.07, 2);
      g.font = `500 ${w * 0.04}px ${SANS}`;
      g.fillStyle = '#cfcfcf';
      g.fillText(e.company, pad, y);
      g.font = `400 ${w * 0.032}px ${SANS}`;
      g.fillStyle = '#a8a8a8';
      wrap(g, e.summary, pad, y + w * 0.075, w - pad * 2, w * 0.046, 5);
    });
    const s = i % 2 ? 1 : -1;
    panel.mesh.position
      .copy(start)
      .addScaledVector(along, i * step)
      .addScaledVector(side, s * 1.25);
    // Face the entry, toward the camera walking up the aisle, turned in a little.
    panel.mesh.lookAt(
      panel.mesh.position
        .clone()
        .add(along)
        .addScaledVector(side, -s * 0.45)
    );
    return panel.mesh;
  });
  const end = start.clone().addScaledVector(along, (roles.length - 1) * step);
  return {
    panels,
    path: {
      from: { pos: end.clone().addScaledVector(along, 3.4), look: end.clone().addScaledVector(along, -4) },
      to: { pos: start.clone().addScaledVector(along, 1.5), look: start.clone().addScaledVector(along, -3) },
    },
  };
}
