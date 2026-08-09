import { onMounted, onBeforeUnmount, type Ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { ParallaxOptions } from '../types';

gsap.registerPlugin(ScrollTrigger);

export function useParallax(target: Ref<HTMLElement | null>, options: ParallaxOptions = {}) {
  let ctx: gsap.Context | undefined;

  onMounted(() => {
    if (!target.value) return;

    const speed = options.speed || 0.5;
    const direction = options.direction || 'down';
    const multiplier = direction === 'up' ? -1 : 1;

    ctx = gsap.context(() => {
      gsap.to(target.value!, {
        scrollTrigger: {
          trigger: options.trigger || target.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          ...options.scrollTrigger,
        },
        y: `${multiplier * speed * 100}%`,
        ease: 'none',
        ...options.animation,
      });
    });
  });

  onBeforeUnmount(() => {
    if (ctx) ctx.revert();
  });

  return { ctx };
}

export function useMouseParallax(target: Ref<HTMLElement | null>, options: ParallaxOptions = {}) {
  // gsap.quickTo reuses ONE tween per property. The previous version called
  // gsap.to() inside a rAF on every mousemove, which allocated a fresh tween
  // per event per element — with three shapes on the hero that is hundreds of
  // throwaway tweens a second. quickTo just retargets the existing one.
  let xTo: gsap.QuickToFunc | null = null;
  let yTo: gsap.QuickToFunc | null = null;

  const handleMouseMove = (e: MouseEvent) => {
    if (!xTo || !yTo) return;

    const strength = options.strength || 20;
    const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
    const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

    xTo(xPercent * strength);
    yTo(yPercent * strength);
  };

  onMounted(() => {
    // Pointer-driven decoration is noise for anyone who asked for less motion,
    // and the listener is pure cost on touch devices with no pointer at all.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!target.value) return;

    xTo = gsap.quickTo(target.value, 'x', { duration: 0.6, ease: 'power2.out' });
    yTo = gsap.quickTo(target.value, 'y', { duration: 0.6, ease: 'power2.out' });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    xTo = null;
    yTo = null;
  });

  return { handleMouseMove };
}
