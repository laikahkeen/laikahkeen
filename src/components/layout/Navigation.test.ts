import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../../router';
import { scrollToSection } from '../../composables/useLenis';
import Navigation from './Navigation.vue';

vi.mock('../../composables/useLenis', () => ({ scrollToSection: vi.fn() }));

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push(path);
  await router.isReady();
  // Attached, so focus() and document.activeElement behave as in a page.
  const wrapper = mount(Navigation, { global: { plugins: [router] }, attachTo: document.body });
  mounted.push(wrapper);
  return { wrapper, router };
}

const mounted: VueWrapper[] = [];
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()));

const desktopLink = (wrapper: Awaited<ReturnType<typeof mountAt>>['wrapper'], label: string) =>
  wrapper.findAll('a').find((a) => a.text() === label)!;

describe('Navigation', () => {
  beforeEach(() => vi.mocked(scrollToSection).mockClear());

  it('scrolls through the shared scroller on the home page', async () => {
    const { wrapper } = await mountAt('/');
    await desktopLink(wrapper, 'Contact').trigger('click');
    expect(scrollToSection).toHaveBeenCalledWith('contact');
  });

  it('navigates home to the section from a case study page', async () => {
    // The sections are not in the DOM here; the router's scrollBehavior takes it
    // from the hash once home renders.
    const { wrapper, router } = await mountAt('/work/keen-ops');
    await desktopLink(wrapper, 'Contact').trigger('click');
    await vi.waitFor(() => expect(router.currentRoute.value.fullPath).toBe('/#contact'));
    expect(scrollToSection).not.toHaveBeenCalled();
  });

  it('points every section link at home, so it works before hydration and in a new tab', async () => {
    const { wrapper } = await mountAt('/work/keen-ops');
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href).toMatch(/^\/#[a-z]+$/);
  });
});

describe('Navigation mobile menu', () => {
  let wrapper: Awaited<ReturnType<typeof mountAt>>['wrapper'];
  const toggle = () => wrapper.get('button[aria-controls]');
  const menu = () => wrapper.get('#mobile-menu');
  const isOpen = () => (menu().element as HTMLElement).style.display !== 'none';

  beforeEach(async () => {
    ({ wrapper } = await mountAt('/'));
  });

  it('points aria-controls at the menu whether it is open or closed', async () => {
    expect(document.getElementById(toggle().attributes('aria-controls')!)).not.toBeNull();
    await toggle().trigger('click');
    expect(document.getElementById(toggle().attributes('aria-controls')!)).not.toBeNull();
  });

  it('flips aria-expanded with the menu', async () => {
    expect(toggle().attributes('aria-expanded')).toBe('false');
    await toggle().trigger('click');
    expect(toggle().attributes('aria-expanded')).toBe('true');
    expect(isOpen()).toBe(true);
    await toggle().trigger('click');
    expect(toggle().attributes('aria-expanded')).toBe('false');
  });

  it('moves focus to the first link when it opens', async () => {
    await toggle().trigger('click');
    await vi.waitFor(() => expect(document.activeElement).toBe(menu().find('a').element));
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    await toggle().trigger('click');
    await menu().find('a').trigger('keydown', { key: 'Escape' });
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(toggle().element);
  });

  it('closes when Tab carries focus out of the nav, and does not trap it', async () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    await toggle().trigger('click');

    const links = menu().findAll('a');
    await links[links.length - 1]!.trigger('focusout', { relatedTarget: outside });
    expect(isOpen()).toBe(false);
    outside.remove();
  });

  it('stays open when focus moves to nothing, so a Safari click on the toggle cannot race it', async () => {
    await toggle().trigger('click');
    await menu().find('a').trigger('focusout', { relatedTarget: null });
    expect(isOpen()).toBe(true);
  });
});
