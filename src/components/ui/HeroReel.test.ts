import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { mcpPanel } from '../../data/mcp';
import { projects } from '../../data/projects';

// Shaped like the hero's resting state: the reel animates these [data-reel] parts.
const resting = () => [
  h('p', { 'data-reel': 'tagline' }, 'resting hero'),
  h('p', { 'data-reel': 'description' }),
  h('div', { 'data-reel': 'metrics' }, [h('p', { 'data-reel': 'value' }, '03')]),
  h('div', { 'data-reel': 'cta' }, [h('a', 'cta')]),
];

// Fresh module per test: the reel's once-per-load flag is module state.
const load = async () => (await import('./HeroReel.vue')).default;
const name = () => document.createElement('h1');
const overlay = () => document.body.querySelector('.fixed');

const setReducedMotion = (reduce: boolean) => {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    ...original(query),
    matches: reduce && query.includes('prefers-reduced-motion'),
  })) as typeof window.matchMedia;
  return () => (window.matchMedia = original);
};

enableAutoUnmount(afterEach);

describe('HeroReel', () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.restoreAllMocks());

  it('prerenders the resting hero and none of the reel', async () => {
    const HeroReel = await load();
    const html = await renderToString(
      createSSRApp({ render: () => h(HeroReel, { name: null }, { default: resting }) })
    );

    expect(html).toContain('resting hero');
    expect(html).not.toContain('Skip');
  });

  it('plays from the data files, not copy of its own', async () => {
    const HeroReel = await load();
    const wrapper = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });
    await wrapper.vm.$nextTick();

    const text = overlay()!.textContent!;
    expect(text).toContain(mcpPanel.endpoint);
    for (const project of projects.filter((p) => p.featured)) {
      expect(text).toContain(`{"slug":"${project.slug}","tags":["${project.tags[0]}"`);
      expect(text).toContain(project.tags.join(' · '));
    }
    wrapper.unmount();
  });

  // jsdom has no WebGL and no 2D canvas, which is exactly the fallback path.
  it('lands on the resting hero when the scene cannot start', async () => {
    const HeroReel = await load();
    const wrapper = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });

    await vi.waitFor(() => expect(overlay()).toBeNull());
    expect(wrapper.text()).toBe('resting hero03cta');
  });

  it('plays once per page load', async () => {
    const HeroReel = await load();
    mount(HeroReel, { props: { name: name() }, slots: { default: resting } }).unmount();

    const again = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });
    await again.vm.$nextTick();
    expect(overlay()).toBeNull();
  });

  it('never plays under reduced motion', async () => {
    const restore = setReducedMotion(true);
    const HeroReel = await load();
    const wrapper = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });
    await wrapper.vm.$nextTick();

    expect(overlay()).toBeNull();
    expect(wrapper.text()).toBe('resting hero03cta');
    restore();
  });

  it('announces its end when skipped, and again on a later visit to the page', async () => {
    const HeroReel = await load();
    const wrapper = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });
    await wrapper.vm.$nextTick();
    (overlay()!.querySelector('button') as HTMLButtonElement).click();
    expect(wrapper.emitted('end')).toHaveLength(1);
    wrapper.unmount();

    const again = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });
    expect(again.emitted('end')).toHaveLength(1);
  });

  it('does not announce an end it never reached', async () => {
    const restore = setReducedMotion(true);
    const HeroReel = await load();
    const wrapper = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('end')).toBeUndefined();
    restore();
  });

  it('skip lands on the resting hero', async () => {
    const HeroReel = await load();
    const wrapper = mount(HeroReel, { props: { name: name() }, slots: { default: resting } });
    await wrapper.vm.$nextTick();

    (overlay()!.querySelector('button') as HTMLButtonElement).click();
    await wrapper.vm.$nextTick();
    expect(overlay()).toBeNull();
    expect(wrapper.text()).toBe('resting hero03cta');
  });
});
