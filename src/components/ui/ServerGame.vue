<template>
  <div>
    <button
      v-if="!failed"
      ref="entry"
      type="button"
      class="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-black"
      @click="enter"
    >
      <span class="h-px w-8 bg-current transition-all group-hover:w-12"></span>{{ serverGame.enter }} ↵
    </button>
    <!-- Read by the canvas, so the room's accent cannot drift from the stylesheet's. -->
    <span ref="probe" class="hidden text-accent"></span>

    <Teleport to="body">
      <div
        v-if="open"
        role="dialog"
        aria-modal="true"
        :aria-label="serverGame.enter"
        tabindex="-1"
        ref="overlay"
        class="fixed inset-0 z-[60] select-none bg-black text-white outline-none"
      >
        <canvas
          ref="canvas"
          class="absolute inset-0 h-full w-full touch-none"
          :class="{ 'cursor-pointer': hovered }"
          @pointermove="onMove"
          @pointerdown="onDown"
          @pointerleave="onLeave"
        ></canvas>
        <!-- Keeps the HUD legible over the ceiling lamps. -->
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent"
        ></div>
        <div ref="cover" class="pointer-events-none absolute inset-0 bg-black"></div>

        <div class="pointer-events-none absolute left-6 top-6 font-mono text-[11px] leading-5 md:left-10 md:top-10">
          <p class="text-gray-400">{{ host }}</p>
          <p v-if="!ready" class="text-gray-400">{{ serverGame.connecting }}</p>
          <!-- The accent only while the endpoint is answering: it means "live system". -->
          <p v-else :class="live ? 'text-accent' : 'text-gray-400'">
            {{ live ? '●' : '○' }} {{ live ? serverGame.live : serverGame.replay }}
          </p>
        </div>

        <button
          type="button"
          class="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-white md:right-10 md:top-10"
          @click="exit"
        >
          {{ serverGame.exit }} · esc
        </button>

        <div
          v-if="ready"
          class="absolute inset-x-6 bottom-6 flex flex-col items-center gap-3 text-center md:inset-x-10 md:bottom-10"
        >
          <p class="font-mono text-[11px] text-gray-400">{{ serverGame.hint }}</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="(tool, i) in tools"
              :key="tool"
              type="button"
              :disabled="busy"
              class="border px-3 py-2 font-mono text-[11px] transition-colors disabled:opacity-40"
              :class="
                current === tool ? 'border-white text-white' : 'border-gray-700 text-gray-300 hover:border-gray-400'
              "
              @click="go(tool)"
            >
              <span class="text-gray-500">{{ i + 1 }}</span> {{ tool }}<span v-if="visited.includes(tool)"> ✓</span>
            </button>
          </div>
          <div class="flex min-h-5 gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
            <RouterLink
              v-if="caseStudy && current === 'get_project'"
              :to="caseStudy"
              class="text-gray-300 hover:text-white"
            >
              {{ serverGame.caseStudy }} →
            </RouterLink>
            <button v-if="visited.length === tools.length" type="button" class="text-white" @click="exit">
              {{ serverGame.done }} ↵
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { callMcpTool, connectMcp } from '../../api/mcp';
import { holdScroll } from '../../composables/useLenis';
import { mcpPanel, serverGame } from '../../data/mcp';
import { projects } from '../../data/projects';
import type { McpToolName } from '../../types/index.ts';
import type { Object3D, Vector3 } from 'three';
import type { ScreenState, ServerScene, View } from '../../server';

type Server = typeof import('../../server');

const MODEL = '/models/server-room.glb';
// Long enough for a cold Railway start, short enough that a dead endpoint does not stall the door.
const CONNECT_TIMEOUT = 4000;

const tools = Object.keys(serverGame.tools) as McpToolName[];
const product = projects.find((p) => p.featured && p.image)!;
const host = new URL(mcpPanel.endpoint).host;
const calls: Record<McpToolName, { label: string; args: Record<string, unknown> }> = {
  list_projects: { label: 'list_projects()', args: {} },
  get_project: { label: `get_project("${product.slug}")`, args: { slug: product.slug } },
  get_experience: { label: 'get_experience()', args: {} },
};

const open = ref(false);
const ready = ref(false);
const live = ref(false);
const busy = ref(false);
const failed = ref(false);
const current = ref<McpToolName | null>(null);
const visited = ref<McpToolName[]>([]);
const hovered = ref<McpToolName | null>(null);
const caseStudy = ref<string | null>(null);

const entry = ref<HTMLElement | null>(null);
const probe = ref<HTMLElement | null>(null);
const overlay = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const cover = ref<HTMLElement | null>(null);

let lib: Server | null = null;
let s: ServerScene | null = null;
let version: string | null = null;
let controller: AbortController | null = null;
let screens = {} as Record<McpToolName, ScreenState>;
let views = {} as Partial<Record<McpToolName, View>>;
// What each terminal conjured, at its resting pose, so it can fold into its screen and back.
let outputs = {} as Partial<Record<McpToolName, { m: Object3D; pos: Vector3; scale: Vector3 }[]>>;
const unfolded = new Set<McpToolName>();
let closing = false;
// Bumped on every close, so a call still in flight from a closed visit stops where it is.
let visit = 0;
let undebug: (() => void) | undefined;

// The camera rig, tweened by GSAP and copied into three every frame. Sway is the pointer.
const pos = { x: 0, y: 0, z: 0 };
const look = { x: 0, y: 0, z: 0 };
const sway = { x: 0, y: 0 };
const swayX = gsap.quickTo(sway, 'x', { duration: 1.2, ease: 'power3.out' });
const swayY = gsap.quickTo(sway, 'y', { duration: 1.2, ease: 'power3.out' });

const tick = () => {
  if (!s) return;
  s.camera.position.set(pos.x + sway.x, pos.y + sway.y, pos.z);
  s.target.set(look.x, look.y, look.z);
  s.render();
};

const fly = (view: View, duration: number, ease = 'power3.inOut') =>
  gsap
    .timeline()
    .to(pos, { x: view.pos.x, y: view.pos.y, z: view.pos.z, duration, ease }, 0)
    .to(look, { x: view.look.x, y: view.look.y, z: view.look.z, duration, ease }, 0);

const redraw = (tool: McpToolName) => s && lib?.drawScreen(s.screens[tool], screens[tool]);
const wait = (seconds: number) => new Promise((r) => gsap.delayedCall(seconds, r));
const done = (tl: gsap.core.Timeline) => new Promise<void>((r) => tl.eventCallback('onComplete', () => r()));

const fetchTool = async (tool: McpToolName): Promise<unknown> => {
  if (version) {
    try {
      return await callMcpTool(mcpPanel.endpoint, version, tool, calls[tool].args, controller!.signal);
    } catch {
      // Dropped mid-visit: say so, and carry on from the same data.
      version = null;
      live.value = false;
    }
  }
  if (tool === 'list_projects') return lib!.listProjects();
  if (tool === 'get_project') return lib!.getProject(product.slug);
  return lib!.getExperience();
};

const keep = (tool: McpToolName, meshes: Object3D[]) => {
  outputs[tool] = meshes.map((m) => ({ m, pos: m.position.clone(), scale: m.scale.clone() }));
  unfolded.add(tool);
};

// The corridor is never kept: it lines the aisle, out of every terminal's shot.
const fold = (tool: McpToolName) => {
  if (!s || !unfolded.delete(tool)) return;
  const c = s.screens[tool].frame.centre;
  for (const { m } of outputs[tool]!) {
    gsap.to(m.position, { x: c.x, y: c.y, z: c.z, duration: 0.6, ease: 'power3.in', overwrite: true });
    gsap.to(m.scale, {
      x: 0.02,
      y: 0.02,
      z: 0.02,
      duration: 0.6,
      ease: 'power3.in',
      overwrite: true,
      onComplete: () => void (m.visible = false),
    });
  }
};

const unfold = (tool: McpToolName) => {
  if (unfolded.has(tool) || !outputs[tool]) return;
  unfolded.add(tool);
  outputs[tool]!.forEach(({ m, pos, scale }, i) => {
    m.visible = true;
    const at = { duration: 1, ease: 'expo.out', delay: 0.4 + i * 0.004, overwrite: true };
    gsap.to(m.position, { x: pos.x, y: pos.y, z: pos.z, ...at });
    gsap.to(m.scale, { x: scale.x, y: scale.y, z: scale.z, ...at });
  });
};

const manifest = async (tool: McpToolName, data: unknown) => {
  const scene = s!;
  const L = lib!;
  const portrait = window.innerWidth < window.innerHeight;
  const o = { live: live.value, gold: getComputedStyle(probe.value!).color, portrait };
  const frame = scene.screens[tool].frame;
  const tl = gsap.timeline();

  if (tool === 'list_projects') {
    const { meshes, view } = L.projectCards(data as Parameters<Server['projectCards']>[0], frame, o);
    scene.world.add(...meshes);
    views[tool] = view;
    tl.add(fly(view, 1.6), 0);
    meshes.forEach((m, i) => {
      const to = m.position.clone();
      m.position.copy(frame.centre);
      m.scale.setScalar(0.05);
      tl.to(m.position, { x: to.x, y: to.y, z: to.z, duration: 1.1, ease: 'expo.out' }, 0.2 + i * 0.09);
      tl.to(m.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: 'expo.out' }, 0.2 + i * 0.09);
    });
    await done(tl);
    keep(tool, meshes);
    return;
  } else if (tool === 'get_project') {
    const p = data as Parameters<Server['projectBuild']>[1];
    const { tiles, caption, view } = L.projectBuild(product.image!, p, frame, o);
    scene.world.add(...tiles, caption);
    views[tool] = view;
    caseStudy.value = `/work/${p.slug}`;
    tl.add(fly(view, 1.8), 0);
    // Seeded scatter, so the build is the same take for everyone.
    let seed = 7;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    const centre = frame.centre;
    tiles.forEach((t) => {
      const to = t.position.clone();
      const rot = t.rotation.clone();
      const d = to.distanceTo(centre);
      t.position.set(to.x + r() * 3, to.y + r() * 2, to.z + r() * 3);
      t.rotation.set(rot.x + r() * 3, rot.y + r() * 3, rot.z + r() * 3);
      t.scale.setScalar(0.2);
      const at = 0.3 + d * 0.35 + Math.abs(r()) * 0.25;
      tl.to(t.position, { x: to.x, y: to.y, z: to.z, duration: 1.2, ease: 'power3.out' }, at);
      tl.to(t.rotation, { x: rot.x, y: rot.y, z: rot.z, duration: 1.2, ease: 'power3.out' }, at);
      tl.to(t.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power3.out' }, at);
    });
    caption.scale.set(1, 0.001, 1);
    tl.to(caption.scale, { y: 1, duration: 0.6, ease: 'expo.out' }, '>-0.3');
    await done(tl);
    keep(tool, [...tiles, caption]);
    return;
  } else {
    const roles = data as Parameters<Server['experienceCorridor']>[0];
    const { panels, path } = L.experienceCorridor(roles, scene.stops.entry, o);
    scene.world.add(...panels);
    views[tool] = path.to;
    const walk = roles.length * 1.1;
    panels.forEach((m) => m.scale.set(0.001, 0.001, 1));
    tl.add(fly(path.from, 1.6), 0);
    tl.add(fly(path.to, walk, 'sine.inOut'), 1.6);
    panels.forEach((m, i) => {
      tl.to(
        m.scale,
        { x: 1, y: 1, duration: 0.7, ease: 'back.out(1.6)' },
        1.0 + ((roles.length - 1 - i) / roles.length) * walk
      );
    });
  }
  await done(tl);
};

const go = async (tool: McpToolName) => {
  if (!s || busy.value || closing) return;
  current.value = tool;
  for (const t of tools) if (t !== tool) fold(t);
  if (visited.value.includes(tool)) {
    busy.value = true;
    unfold(tool);
    await done(fly(views[tool]!, 1.4));
    busy.value = false;
    return;
  }
  busy.value = true;
  const mine = visit;
  const st = screens[tool];
  st.phase = 'calling';
  redraw(tool);
  const [data] = await Promise.all([fetchTool(tool), done(fly(s.stops[tool], 1.4))]);
  if (mine !== visit) return;
  st.phase = 'answered';
  st.live = live.value;
  st.status = live.value ? `200 OK · ${host}` : 'replay · src/data';
  st.json = JSON.stringify(data, null, 2);
  gsap.to(st, { shown: st.json.length, duration: 1.4, ease: 'none', onUpdate: () => redraw(tool) });
  await wait(0.35);
  if (mine !== visit) return;
  await manifest(tool, data);
  if (mine !== visit) return;
  visited.value = [...visited.value, tool];
  busy.value = false;
};

const ndc = (e: PointerEvent) => [(e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1];

const setHover = (tool: McpToolName | null) => {
  if (hovered.value === tool) return;
  const prev = hovered.value;
  hovered.value = tool;
  for (const t of [prev, tool]) {
    if (!t) continue;
    screens[t].hover = t === tool;
    redraw(t);
  }
};

const onMove = (e: PointerEvent) => {
  if (!s || !ready.value) return;
  const [x, y] = ndc(e);
  swayX(x * 0.18);
  swayY(y * 0.1);
  setHover(busy.value ? null : s.pick(x, y));
};
const onDown = (e: PointerEvent) => {
  if (!s || !ready.value) return;
  const [x, y] = ndc(e);
  const tool = s.pick(x, y);
  if (tool) go(tool);
};
const onLeave = () => setHover(null);

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') exit();
  const tool = tools[Number(e.key) - 1];
  if (tool && ready.value) go(tool);
};
const onResize = () => s?.resize(window.innerWidth, window.innerHeight);
const listen = (on: boolean) => {
  const method = on ? 'addEventListener' : 'removeEventListener';
  window[method]('keydown', onKey as EventListener);
  window[method]('resize', onResize);
};

const connect = async () => {
  const timer = setTimeout(() => controller?.abort(), CONNECT_TIMEOUT);
  try {
    version = await connectMcp(mcpPanel.endpoint, controller!.signal);
  } catch {
    version = null;
    // The abort was only for the handshake; tool calls get a fresh signal.
    controller = new AbortController();
  } finally {
    clearTimeout(timer);
  }
};

const enter = async () => {
  if (open.value) return;
  open.value = true;
  closing = false;
  holdScroll(true);
  listen(true);
  controller = new AbortController();
  await nextTick();
  overlay.value?.focus({ preventScroll: true });

  try {
    const [loaded] = await Promise.all([import('../../server'), connect()]);
    lib = loaded;
    if (!open.value || !canvas.value) return;
    s = await lib.createServerScene(canvas.value, {
      width: window.innerWidth,
      height: window.innerHeight,
      model: MODEL,
    });
  } catch {
    // No WebGL, or the model did not load: the door closes and stays closed.
    failed.value = true;
    close();
    return;
  }
  if (!open.value) return close();

  live.value = version !== null;
  for (const tool of tools) {
    screens[tool] = {
      tool,
      call: calls[tool].label,
      caption: serverGame.tools[tool],
      phase: 'idle',
      hover: false,
      visited: false,
      live: false,
      status: '',
      json: '',
      shown: 0,
      gold: getComputedStyle(probe.value!).color,
    };
    redraw(tool);
  }

  // In from behind the entry, through the dark.
  const { pos: at, look: to } = s.stops.entry;
  Object.assign(look, { x: to.x, y: to.y, z: to.z });
  Object.assign(pos, { x: at.x + (at.x - to.x) * 0.5, y: at.y + 1.2, z: at.z + (at.z - to.z) * 0.5 });
  gsap.ticker.add(tick);
  ready.value = true;
  fly(s.stops.entry, 2.8, 'expo.out');
  gsap.to(cover.value, { opacity: 0, duration: 1.4, ease: 'power2.out' });

  if (import.meta.env.DEV && new URLSearchParams(location.search).has('reel-debug')) {
    import('../../debug/timeline').then(({ debugTimeline }) => {
      if (open.value) undebug = debugTimeline(gsap.globalTimeline, 24);
    });
  }
};

const close = () => {
  visit++;
  gsap.ticker.remove(tick);
  undebug?.();
  undebug = undefined;
  controller?.abort();
  s?.dispose();
  s = null;
  listen(false);
  holdScroll(false);
  screens = {} as typeof screens;
  views = {};
  outputs = {};
  unfolded.clear();
  ready.value = false;
  busy.value = false;
  current.value = null;
  visited.value = [];
  hovered.value = null;
  caseStudy.value = null;
  if (open.value) {
    open.value = false;
    nextTick(() => entry.value?.focus({ preventScroll: true }));
  }
};

// Out to the white page through white, so the cut back to the light hero is not a flash.
const exit = () => {
  if (!open.value || closing) return;
  closing = true;
  if (!s) return close();
  gsap.set(cover.value, { backgroundColor: '#fff' });
  gsap.to(cover.value, { opacity: 1, duration: 0.5, ease: 'power2.in', onComplete: close });
};

onMounted(() => {
  if (entry.value) gsap.from(entry.value, { autoAlpha: 0, y: 8, duration: 0.6, ease: 'expo.out', delay: 0.4 });
});

onBeforeUnmount(close);
</script>
