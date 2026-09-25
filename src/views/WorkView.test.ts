import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../router';
import { projects } from '../data/projects';
import WorkView from './WorkView.vue';

async function mountAt(path: string) {
  // A real router rather than a stubbed useRoute, so the route table itself is
  // under test alongside the view.
  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push(path);
  await router.isReady();
  return mount(WorkView, { global: { plugins: [router] } });
}

describe('WorkView', () => {
  it('renders the project matching the slug', async () => {
    const keenOps = projects.find((p) => p.slug === 'keen-ops')!;
    const wrapper = await mountAt('/work/keen-ops');
    const text = wrapper.text();

    expect(text).toContain(keenOps.title);
    expect(text).toContain(keenOps.problem);
    expect(text).toContain(keenOps.solution);
    expect(text).toContain(keenOps.role);
  });

  it('renders every project without throwing', async () => {
    for (const p of projects) {
      const wrapper = await mountAt(`/work/${p.slug}`);
      expect(wrapper.text(), `${p.slug} rendered the not-found state`).not.toContain('No such project');
    }
  });

  it('shows a not-found state for an unknown slug', async () => {
    const wrapper = await mountAt('/work/does-not-exist');
    expect(wrapper.text()).toContain('No such project');
  });

  it('omits the source link when a project has no repo', async () => {
    const wrapper = await mountAt('/work/keen-ops');
    expect(wrapper.text()).not.toContain('Source');
  });
});
