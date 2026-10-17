import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../../router';
import { scrollToSection } from '../../composables/useLenis';
import Navigation from './Navigation.vue';

vi.mock('../../composables/useLenis', () => ({ scrollToSection: vi.fn() }));
// The production state today: nothing published.
vi.mock('virtual:writing', () => ({ posts: [] }));

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push(path);
  await router.isReady();
  const wrapper = mount(Navigation, { global: { plugins: [router] } });
  return { wrapper, router };
}

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

describe('Navigation with no published posts', () => {
  it('has no link to /writing', async () => {
    const { wrapper } = await mountAt('/');
    expect(wrapper.text()).not.toContain('Writing');
    expect(wrapper.find('a[href="/writing"]').exists()).toBe(false);
  });
});
