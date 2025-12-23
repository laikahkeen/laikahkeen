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
  let rafId: number | null = null;

  const handleMouseMove = (e: MouseEvent) => {
    if (!target.value) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;

    const strength = options.strength || 20;

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      gsap.to(target.value!, {
        x: xPercent * strength,
        y: yPercent * strength,
        duration: 1,
        ease: 'power2.out',
      });
    });
  };

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (rafId) cancelAnimationFrame(rafId);
  });

  return { handleMouseMove };
}
