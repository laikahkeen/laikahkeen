import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createHead } from '@unhead/vue/client';
import { routes } from '../router';
import WritingIndexView from './WritingIndexView.vue';
import WritingPostView from './WritingPostView.vue';
import Navigation from '../components/layout/Navigation.vue';

// Under Vitest the writing plugin serves src/test/fixtures/writing (see vite.config.ts).
async function mountAt(path: string, component: Parameters<typeof mount>[0]) {
  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push(path);
  await router.isReady();
  return mount(component, { global: { plugins: [router, createHead()] } });
}

describe('writing', () => {
  it('lists published posts newest first, and not drafts', async () => {
    const text = (await mountAt('/writing', WritingIndexView)).text();
    expect(text.indexOf('Fixture newer post')).toBeLessThan(text.indexOf('Fixture older post'));
    expect(text).toContain('Fixture summary for the newer post.');
    expect(text).toContain('1 February 2026');
    expect(text).not.toContain('Fixture draft post');
  });

  it('renders a post body from markdown', async () => {
    const wrapper = await mountAt('/writing/fixture-newer', WritingPostView);
    expect(wrapper.find('h1').text()).toBe('Fixture newer post & <escaping>');
    expect(wrapper.find('.post-body h2').text()).toBe('Fixture heading');
    expect(wrapper.findAll('.post-body li')).toHaveLength(2);
    expect(wrapper.find('.post-body script').exists()).toBe(false);
  });

  it('does not serve a draft at its slug', async () => {
    const text = (await mountAt('/writing/fixture-draft', WritingPostView)).text();
    expect(text).toContain('No such post');
  });

  it('links to writing from the nav once a post is published', async () => {
    const wrapper = await mountAt('/', Navigation);
    expect(wrapper.find('a[href="/writing"]').exists()).toBe(true);
  });
});
