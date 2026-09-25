import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../router';
import { projects } from '../data/projects';
import { caseStudyFor } from '../data/caseStudies';
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
  it('renders the long form for a project that has a case study', async () => {
    const study = caseStudyFor('keen-ops')!;
    const wrapper = await mountAt('/work/keen-ops');
    const text = wrapper.text();

    expect(text).toContain('keen-ops');
    expect(text).toContain(study.standfirst);
    for (const section of study.sections) expect(text).toContain(section.heading);
    // The diagram carries an argument, so it must be labelled for screen readers.
    expect(wrapper.find('svg[role="img"]').attributes('aria-label')).toBeTruthy();
  });

  it('does not also repeat the card summary when a case study exists', async () => {
    // The long form replaces those fields rather than duplicating them.
    const keenOps = projects.find((p) => p.slug === 'keen-ops')!;
    const text = (await mountAt('/work/keen-ops')).text();
    expect(text).not.toContain(keenOps.problem);
  });

  it('falls back to the card summary for a project with no case study', async () => {
    const propbook = projects.find((p) => p.slug === 'propbook')!;
    expect(caseStudyFor('propbook')).toBeUndefined();

    const text = (await mountAt('/work/propbook')).text();
    expect(text).toContain(propbook.problem);
    expect(text).toContain(propbook.solution);
    expect(text).toContain(propbook.role);
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
