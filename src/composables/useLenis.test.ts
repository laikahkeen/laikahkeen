import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type Lenis from 'lenis';
import { scrollToSection, setLenis } from './useLenis';

// main.css sets this on <html>; jsdom loads no CSS, so the test sets it inline.
const NAV_OFFSET = 80;

function fakeLenis() {
  const calls: string[] = [];
  const lenis = {
    resize: vi.fn(() => calls.push('resize')),
    scrollTo: vi.fn(() => calls.push('scrollTo')),
  };
  return { lenis, calls };
}

describe('scrollToSection', () => {
  let section: HTMLElement;

  beforeEach(() => {
    section = document.createElement('section');
    section.id = 'contact';
    document.body.appendChild(section);
    document.documentElement.style.scrollPaddingTop = `${NAV_OFFSET}px`;
  });

  afterEach(() => {
    section.remove();
    document.documentElement.style.scrollPaddingTop = '';
    setLenis(null);
    vi.restoreAllMocks();
  });

  it('scrolls through Lenis, clear of the fixed nav, when an instance exists', () => {
    const { lenis, calls } = fakeLenis();
    setLenis(lenis as unknown as Lenis);

    scrollToSection('contact');

    expect(lenis.scrollTo).toHaveBeenCalledWith(section, { offset: -NAV_OFFSET });
    // Resize first, or Lenis clamps to the previous page's height.
    expect(calls).toEqual(['resize', 'scrollTo']);
  });

  it('jumps natively, without smoothing, when there is no instance', () => {
    // No instance is the reduced-motion case: App.vue returns before creating one.
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({ top: 500 } as DOMRect);

    scrollToSection('contact');

    expect(scrollTo).toHaveBeenCalledWith({ top: 500 + window.scrollY - NAV_OFFSET, behavior: 'instant' });
  });

  it('does nothing for an id that is not on the page', () => {
    const { lenis } = fakeLenis();
    setLenis(lenis as unknown as Lenis);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    scrollToSection('nope');

    expect(lenis.scrollTo).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
