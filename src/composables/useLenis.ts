import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

// The fixed-nav clearance lives in main.css as scroll-padding-top.
function navOffset(): number {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) {
    // Lenis clamps to a scroll limit it refreshes on a 250ms debounce, so right
    // after a route change from a short /work page it would stop short.
    lenis.resize();
    lenis.scrollTo(el, { offset: -navOffset() });
    return;
  }

  // No instance means reduced motion (App.vue never creates one), or a direct hit
  // before mount. Both should jump, not animate.
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navOffset(), behavior: 'instant' });
}
