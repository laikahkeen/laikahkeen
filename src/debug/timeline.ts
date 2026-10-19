// Dev-only review aid: a frame counter, Space to pause, ←/→ to step a frame while paused.
// Loaded under `npm run dev` with ?reel-debug, by HeroReel.vue and ServerGame.vue.
import gsap from 'gsap';

export function debugTimeline(tl: gsap.core.Timeline, fps: number): () => void {
  // The global timeline has no end and drops finished tweens, so it counts from now
  // and steps forward only.
  const global = tl === gsap.globalTimeline;
  const origin = global ? tl.time() : 0;
  const total = global ? '' : `/${Math.round(tl.duration() * fps)}`;
  const hud = document.createElement('div');
  hud.className =
    'pointer-events-none fixed right-4 top-4 z-[70] bg-black/80 px-2 py-1 font-mono text-xs tabular-nums text-white';
  document.body.append(hud);

  const frame = () => Math.round((tl.time() - origin) * fps);
  const draw = () => {
    const t = tl.time() - origin;
    hud.textContent = `f ${String(frame()).padStart(3, '0')}${total} · ${t.toFixed(2)}s${tl.paused() ? ' · paused' : ''}`;
  };

  // Capture phase on window runs before the page's own keydown handlers.
  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowLeft: global ? 0 : -1, ArrowRight: 1 }[e.key];
    if (e.key !== ' ' && !(step && tl.paused())) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!step) tl.paused(!tl.paused());
    else if (global) tl.time(tl.time() + 1 / fps);
    else tl.time(Math.min(Math.max((frame() + step) / fps, 0), tl.duration() - 1 / fps));
  };

  window.addEventListener('keydown', onKey, true);
  gsap.ticker.add(draw);
  return () => {
    window.removeEventListener('keydown', onKey, true);
    gsap.ticker.remove(draw);
    hud.remove();
    if (global) tl.paused(false);
  };
}
