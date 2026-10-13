import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import { scrollToSection } from '../composables/useLenis';
import { scrollBehavior } from './index';

vi.mock('../composables/useLenis', () => ({ scrollToSection: vi.fn() }));

const at = (path: string, hash = '') => ({ path, hash }) as RouteLocationNormalized;

describe('scrollBehavior', () => {
  beforeEach(() => vi.mocked(scrollToSection).mockClear());

  it('hands hash targets to the shared scroller and suppresses the native scroll', () => {
    expect(scrollBehavior(at('/', '#contact'), at('/work/keen-ops'), null)).toBe(false);
    expect(scrollToSection).toHaveBeenCalledWith('contact');
  });

  it('restores the saved position on back and forward', () => {
    const saved = { left: 0, top: 1234 };
    expect(scrollBehavior(at('/', '#contact'), at('/work/keen-ops'), saved)).toBe(saved);
    expect(scrollToSection).not.toHaveBeenCalled();
  });

  it('starts a new page at the top', () => {
    expect(scrollBehavior(at('/work/keen-ops'), at('/'), null)).toEqual({ top: 0 });
    expect(scrollToSection).not.toHaveBeenCalled();
  });
});
