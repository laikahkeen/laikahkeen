import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import Navigation from './Navigation.vue';

// The production state today: nothing published.
vi.mock('virtual:writing', () => ({ posts: [] }));

describe('Navigation with no published posts', () => {
  it('has no link to /writing', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: {} }] });
    await router.push('/');
    await router.isReady();
    const wrapper = mount(Navigation, { global: { plugins: [router] } });
    expect(wrapper.text()).not.toContain('Writing');
    expect(wrapper.find('a[href="/writing"]').exists()).toBe(false);
  });
});
