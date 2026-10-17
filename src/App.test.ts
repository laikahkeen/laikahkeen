import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from './router';
import App from './App.vue';

// Lenis needs ResizeObserver, which jsdom lacks; these tests are about structure.
vi.mock('lenis', () => ({
  default: class {
    on() {}
    raf() {}
    destroy() {}
  },
}));

let wrapper: VueWrapper | undefined;
afterEach(() => wrapper?.unmount());

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push(path);
  await router.isReady();
  wrapper = mount(App, { global: { plugins: [router] }, attachTo: document.body });
  return wrapper;
}

const FOCUSABLE = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

describe.each(['/', '/work/keen-ops'])('App shell at %s', (path) => {
  it('starts with a skip link to a focusable main', async () => {
    const app = await mountAt(path);
    const first = (app.element as HTMLElement).querySelector<HTMLAnchorElement>(FOCUSABLE)!;

    expect(first.textContent?.trim()).toBe('Skip to content');
    const target = document.getElementById(first.getAttribute('href')!.slice(1));
    expect(target?.tagName).toBe('MAIN');
    // -1 so it can take focus from the skip link without becoming a Tab stop.
    expect(target?.getAttribute('tabindex')).toBe('-1');
  });

  it('nests no control inside another', async () => {
    // One action, one Tab stop. The resume link used to wrap a <button>.
    const app = await mountAt(path);
    expect(app.findAll('a button, button a, a a, button button')).toHaveLength(0);
  });
});

describe('App shell on the home page', () => {
  it('lets every nav target take focus, so Tab continues from the section', async () => {
    const app = await mountAt('/');
    const ids = app.findAll('nav a[href^="/#"]').map((a) => a.attributes('href')!.replace('/#', ''));

    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(document.getElementById(id)?.getAttribute('tabindex'), id).toBe('-1');
  });

  it('has the contact status region in place before anything is submitted', async () => {
    // A live region inserted together with its text is not reliably announced.
    const app = await mountAt('/');
    expect(app.find('#contact [role="status"]').exists()).toBe(true);
  });
});
