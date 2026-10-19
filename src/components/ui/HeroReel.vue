<template>
  <div>
    <!-- The slot is the hero's resting state and is what prerenders, so crawlers,
         no-JS and reduced-motion visitors get it untouched. The reel only covers it.
         It animates the slot's [data-reel] parts: tagline, description, metrics, value, cta. -->
    <div ref="final">
      <slot />
    </div>

    <Teleport to="body">
      <div
        v-if="playing"
        ref="overlay"
        class="fixed inset-0 z-[60] cursor-pointer overflow-hidden bg-black text-white"
        @pointerdown="skip"
      >
        <canvas ref="canvas" class="absolute inset-0 h-full w-full"></canvas>

        <div aria-hidden="true" class="pointer-events-none absolute inset-0 font-mono">
          <p
            ref="headline"
            class="absolute inset-x-6 top-1/2 -translate-y-1/2 break-all text-center text-2xl md:text-5xl"
          >
            {{ requestTyped }}<span ref="caret">▍</span>
          </p>

          <div ref="hudTop" class="absolute left-6 top-6 text-[11px] leading-5 text-gray-400 md:left-10 md:top-10">
            <p ref="hudRequest" class="opacity-0">{{ request }}</p>
            <p ref="hudStatus" class="text-white opacity-0">← 200 OK</p>
          </div>

          <div
            ref="hudBottom"
            class="absolute bottom-16 left-6 right-6 text-[10px] leading-5 text-gray-400 md:left-10 md:right-auto md:text-[11px]"
          >
            <p v-for="line in responseLines" :key="line" class="reel-json break-all opacity-0 md:whitespace-nowrap md:break-normal">{{ line }}</p>
            <p class="mt-2 text-white">{{ urlTyped }}</p>
          </div>

          <p
            v-for="(project, i) in featured"
            :key="project.slug"
            class="reel-tags absolute w-[85vw] -translate-x-1/2 text-center text-[10px] uppercase leading-5 tracking-[0.25em] text-gray-400 opacity-0 md:w-auto md:whitespace-nowrap md:text-xs"
            :style="tagStyles[i]"
          >
            {{ project.tags.join(' · ') }}
          </p>

          <div ref="flash" class="absolute inset-0 bg-white opacity-0"></div>
        </div>

        <div
          ref="hudChrome"
          class="absolute inset-x-6 bottom-6 flex items-center gap-4 font-mono text-[11px] text-gray-400 md:inset-x-10"
        >
          <span ref="timecode" class="tabular-nums">00:00</span>
          <div class="h-px flex-1 bg-white/20">
            <div ref="progress" class="h-px origin-left scale-x-0 bg-white"></div>
          </div>
          <button type="button" class="uppercase tracking-[0.2em] hover:text-white" @click="skip">Skip</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
// Module scope, not setup scope: once per page load, so returning to / from a
// case study does not replay 15s.
let played = false;
// Set when the reel reached its last frame, watched or skipped. The server room opens from there.
let ended = false;
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { mcpPanel } from '../../data/mcp';
import { projects } from '../../data/projects';
import { cloud, fromMask, point, seeded } from '../../reel/shapes';
import type { ReelScene } from '../../reel/scene';

gsap.registerPlugin(SplitText);

// The h1 the swarm lands on. It stays outside the reel so it paints first (LCP).
const props = defineProps<{ name: HTMLElement | null }>();
const emit = defineEmits<{ end: [] }>();

// Cuts land on a 120bpm grid.
const B = 0.5;
const FPS = 24;

const featured = projects.filter((p) => p.featured);
const product = featured.find((p) => p.image)!;

// No tool name on purpose, same reason mcp.ts carries none: it could go stale.
const request = `POST ${mcpPanel.endpoint}`;
const responseLines = featured.map((p) => JSON.stringify({ slug: p.slug, tags: p.tags.slice(0, 3) }));
const url = product.liveUrl?.replace(/^https?:\/\//, '') ?? product.slug;

const playing = ref(false);
const requestTyped = ref('');
const urlTyped = ref('');
const tagStyles = ref<Record<string, string>[]>([]);

const final = ref<HTMLElement | null>(null);
const overlay = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const headline = ref<HTMLElement | null>(null);
const caret = ref<HTMLElement | null>(null);
const hudTop = ref<HTMLElement | null>(null);
const hudRequest = ref<HTMLElement | null>(null);
const hudStatus = ref<HTMLElement | null>(null);
const hudBottom = ref<HTMLElement | null>(null);
const hudChrome = ref<HTMLElement | null>(null);
const flash = ref<HTMLElement | null>(null);
const timecode = ref<HTMLElement | null>(null);
const progress = ref<HTMLElement | null>(null);

let scene: ReelScene | null = null;
let tl: gsap.core.Timeline | null = null;
let ctx: gsap.Context | null = null;
let splits: SplitText[] = [];
let done = false;
let undebug: (() => void) | undefined;

const tick = () => {
  if (!scene || !tl) return;
  const t = tl.time();
  scene.render(t);
  if (timecode.value) {
    const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
    timecode.value.textContent = `${pad(t)}:${pad((t % 1) * FPS)}`;
  }
};

const finish = () => {
  if (done) return;
  done = true;
  gsap.ticker.remove(tick);
  undebug?.();
  listen(false);
  splits.forEach((s) => s.revert());
  scene?.dispose();
  scene = null;
  playing.value = false;
};

const end = () => {
  ended = true;
  emit('end');
  finish();
};
// Skipped before the scene loaded still counts as watched: the visitor chose to move on.
const skip = () => (tl ? tl.progress(1) : end());
const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Tab' && e.key !== 'Shift') skip();
};
const listen = (on: boolean) => {
  const method = on ? 'addEventListener' : 'removeEventListener';
  window[method]('wheel', skip, { passive: true });
  window[method]('touchstart', skip, { passive: true });
  // Formations are measured once; a resize invalidates them.
  window[method]('resize', skip);
  window[method]('keydown', onKey as EventListener);
};

// Human cadence: hesitates on separators, deterministic so every viewer sees the same take.
const typeOn = (t: gsap.core.Timeline, target: Ref<string>, text: string, at: number, total: number) => {
  const weights = [...text].map((c, i) => (/[/.: ]/.test(c) ? 3.5 : 1) + ((i * 37) % 5) / 8);
  const sum = weights.reduce((a, w) => a + w, 0);
  let time = at;
  weights.forEach((w, i) => {
    time += (w / sum) * total;
    t.call(
      () => {
        target.value = text.slice(0, i + 1);
      },
      undefined,
      time
    );
  });
};

// Rasterise something viewport-sized, so its pixels are already in world units.
const mask = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) throw new Error('reel: no 2d canvas');
  g.fillStyle = '#fff';
  draw(g);
  return g.getImageData(0, 0, w, h).data;
};

// Each glyph drawn at its own DOM rect, so wrapping and tracking match the real h1.
const drawName = (g: CanvasRenderingContext2D, el: HTMLElement) => {
  const style = getComputedStyle(el);
  g.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  g.textBaseline = 'alphabetic';
  const ascent = g.measureText('M').fontBoundingBoxAscent;
  const text = el.firstChild as Text;
  const range = document.createRange();
  for (let i = 0; i < text.length; i++) {
    range.setStart(text, i);
    range.setEnd(text, i + 1);
    const r = range.getBoundingClientRect();
    if (r.width) g.fillText(text.data[i], r.left, r.top + ascent);
  }
};

const build = (createReelScene: typeof import('../../reel/scene').createReelScene) => {
  // Read here, not at mount: the parent's template ref is set after this component mounts.
  const nameEl = props.name;
  if (!nameEl) throw new Error('reel: no h1 to land on');
  const w = window.innerWidth;
  const h = window.innerHeight;
  const count = w < 768 ? 7000 : 16000;
  const rand = seeded();

  const side = w >= 900;
  // Stacked words need margin: the group's sway swings them toward the edges in 3D.
  const size = side ? Math.min(w / (featured.length * 6.5), 140) : Math.min(w / 7.5, 96);
  const spots = featured.map((_, i) =>
    side
      ? { x: w * (0.5 + (i - (featured.length - 1) / 2) * 0.5), y: h / 2 }
      : { x: w / 2, y: h / 2 + (i - (featured.length - 1) / 2) * (size * 1.7 + 44) }
  );
  tagStyles.value = spots.map((s) => ({ left: `${s.x}px`, top: `${s.y + size * 0.62}px` }));

  const words = fromMask(
    mask(w, h, (g) => {
      g.font = `600 ${size}px "JetBrains Mono", monospace`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      featured.forEach((p, i) => g.fillText(p.slug, spots[i].x, spots[i].y));
    }),
    w,
    h,
    count,
    rand
  );
  const name = fromMask(
    mask(w, h, (g) => drawName(g, nameEl)),
    w,
    h,
    count,
    rand
  );
  const start = cloud(count, w * 1.8, h * 1.8, 1200, rand);
  const singularity = point(count, 6, rand);
  const burst = cloud(count, w * 2.4, h * 2.4, 2400, rand);

  scene = createReelScene(canvas.value!, { width: w, height: h, count, image: product.image!, start });
  const s = scene;
  const U = s.uniforms;
  // Opens as dim dust behind the typing; full strength from Enter.
  U.uOpacity.value = 0.45;
  U.uSize.value = 1.6;
  s.product.position.set(0, 0, -150);
  s.product.rotation.set(-0.55, 0.5, 0.08);

  ctx = gsap.context(() => {
    const part = (n: string) => final.value!.querySelector(`[data-reel="${n}"]`)!;
    const tagline = new SplitText(part('tagline'), { type: 'lines', mask: 'lines' });
    const description = new SplitText(part('description'), { type: 'lines', mask: 'lines' });
    const values = new SplitText(final.value!.querySelectorAll('[data-reel="value"]'), {
      type: 'chars',
      mask: 'chars',
    });
    splits = [tagline, description, values];

    gsap.set(final.value, { autoAlpha: 0 });
    gsap.to(caret.value, { autoAlpha: 0, duration: B / 2, repeat: -1, yoyo: true, ease: 'steps(1)' });

    tl = gsap.timeline({ onComplete: end });

    // 0–2s: noise, and a person typing into it.
    typeOn(tl, requestTyped, request, 0.3, 3.2 * B);
    tl.to(s.group.rotation, { x: 0.12, y: 0.4, duration: 4 * B, ease: 'sine.inOut' }, 0)

      // 2s: Enter. Everything spirals into one point: the server.
      .to(headline.value, { autoAlpha: 0, scale: 0.9, filter: 'blur(10px)', duration: 0.35, ease: 'power2.in' }, 4 * B)
      .to(hudRequest.value, { opacity: 1, duration: 0.2 }, 4 * B)
      .call(() => s.morph(singularity), undefined, 4 * B)
      .fromTo(U.uMix, { value: 0 }, { value: 1, duration: 2 * B, ease: 'power2.in' }, 4 * B)
      .to(U.uSwirl, { value: 9, duration: 2 * B, ease: 'power2.in' }, 4 * B)
      .to(U.uDrift, { value: 0, duration: 2 * B }, 4 * B)
      .to(U.uOpacity, { value: 1, duration: 2 * B }, 4 * B)
      .to(U.uSize, { value: 2, duration: 2 * B }, 4 * B)

      // 3s: the response detonates into the work.
      .fromTo(
        flash.value,
        { opacity: 0.9 },
        { opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false },
        6 * B
      )
      .to(hudStatus.value, { opacity: 1, duration: 0.1 }, 6 * B)
      .to('.reel-json', { opacity: 1, duration: 0.1, stagger: 0.12 }, 6.2 * B)
      .call(() => s.morph(words), undefined, 6 * B)
      .fromTo(U.uMix, { value: 0 }, { value: 1, duration: 3 * B, ease: 'none' }, 6 * B)
      .to(U.uSwirl, { value: 0, duration: 3 * B, ease: 'expo.out' }, 6 * B)
      .fromTo(U.uSize, { value: 8 }, { value: 2, duration: 2 * B, ease: 'expo.out', immediateRender: false }, 6 * B)
      .to(s.group.rotation, { x: 0, y: -0.14, duration: 3 * B, ease: 'expo.out' }, 6 * B)
      .to(s.group.rotation, { y: 0.14, duration: 4 * B, ease: 'sine.inOut' }, 9 * B)
      .to(U.uDrift, { value: 0.12, duration: 2 * B }, 7 * B)
      .to('.reel-tags', { opacity: 1, duration: 0.4, stagger: 0.12 }, 8.6 * B)

      // 6.5s: the work tiles itself into the product, and the camera sweeps it.
      .to('.reel-tags', { opacity: 0, duration: 0.3 }, 13 * B)
      .call(() => s.morph(s.productShape()), undefined, 13 * B)
      .fromTo(U.uMix, { value: 0 }, { value: 1, duration: 2.4 * B, ease: 'none' }, 13 * B)
      .to(s.group.rotation, { x: 0, y: 0, duration: 2.4 * B, ease: 'power2.inOut' }, 13 * B)
      .to(s.product.material, { opacity: 1, duration: 0.5 }, 15.2 * B)
      .to(U.uOpacity, { value: 0, duration: 0.5 }, 15.4 * B);
    typeOn(tl, urlTyped, url, 15.2 * B, 1.6 * B);
    tl.to(s.product.rotation, { x: -0.08, y: -0.34, z: 0, duration: 6 * B, ease: 'sine.inOut' }, 15.6 * B)
      .to(s.product.position, { x: -40, z: 140, duration: 6 * B, ease: 'sine.inOut' }, 15.6 * B)

      // 10.8s: the product dissolves, blows out, and comes back as the name.
      .call(() => s.snap(s.productShape()), undefined, 21.6 * B)
      .to(U.uOpacity, { value: 1, duration: 0.15 }, 21.6 * B)
      .to(s.product.material, { opacity: 0, duration: 0.25 }, 21.7 * B)
      .to([hudTop.value, hudBottom.value], { autoAlpha: 0, duration: 0.3 }, 21.6 * B)
      .call(() => s.morph(burst), undefined, 22 * B)
      .fromTo(U.uMix, { value: 0 }, { value: 1, duration: 1.6 * B, ease: 'power3.out' }, 22 * B)
      .to(U.uDrift, { value: 0.6, duration: B }, 22 * B)
      .call(() => s.morph(name), undefined, 23.6 * B)
      .fromTo(U.uMix, { value: 0 }, { value: 1, duration: 2.6 * B, ease: 'none' }, 23.6 * B)
      .to(U.uDrift, { value: 0, duration: 2.2 * B, ease: 'power2.out' }, 23.6 * B)

      // 13.1s: hard invert, and the swarm is the real h1.
      .call(() => s.setInk(true), undefined, 26.2 * B)
      .set(hudChrome.value, { autoAlpha: 0 }, 26.2 * B)
      .set(final.value, { autoAlpha: 1 }, 26.2 * B)
      .to(overlay.value, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 26.4 * B)
      .from(tagline.lines, { yPercent: 100, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, 26.6 * B)
      .from(description.lines, { yPercent: 100, duration: 0.7, stagger: 0.04, ease: 'expo.out' }, 27.3 * B)
      .from(
        part('metrics').children,
        { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.6, stagger: 0.08, ease: 'expo.out' },
        27.9 * B
      )
      .from(values.chars, { yPercent: 100, duration: 0.5, stagger: 0.02, ease: 'expo.out' }, 28.1 * B)
      .from(
        part('cta').children,
        { clipPath: 'inset(0% 50% 0% 50%)', duration: 0.5, stagger: 0.08, ease: 'expo.out' },
        28.5 * B
      )
      .fromTo(progress.value, { scaleX: 0 }, { scaleX: 1, duration: 26.2 * B, ease: 'none' }, 0)
      .set({}, {}, 30 * B);
  });

  gsap.ticker.add(tick);

  if (import.meta.env.DEV && new URLSearchParams(location.search).has('reel-debug')) {
    import('../../debug/timeline').then(({ debugTimeline }) => {
      if (!done && tl) undebug = debugTimeline(tl, FPS);
    });
  }
};

onMounted(async () => {
  if (ended) emit('end');
  if (played) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // The finale lands on the h1, so only play when the page opens at the top.
  if (window.scrollY > 0) return;
  played = true;
  playing.value = true;
  listen(true);
  await nextTick();

  try {
    const [{ createReelScene }] = await Promise.all([import('../../reel/scene'), document.fonts?.ready]);
    if (done || !canvas.value) return;
    build(createReelScene);
  } catch {
    // No WebGL or no 2D canvas: the resting hero is the whole experience.
    finish();
  }
});

onBeforeUnmount(() => {
  finish();
  ctx?.revert();
});
</script>
