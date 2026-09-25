import { describe, expect, it } from 'vitest';
import { getExperience, getProject, listProjects } from './tools.js';

describe('tool payloads', () => {
  it('lists every project with a case-study URL', () => {
    const all = listProjects();
    expect(all.length).toBeGreaterThan(0);
    for (const p of all) {
      expect(p.slug).toBeTruthy();
      expect(p.caseStudy).toBe(`https://laikahkeen.com/work/${p.slug}`);
    }
  });

  it('filters by status', () => {
    expect(listProjects('active').every((p) => p.status === 'active')).toBe(true);
    expect(listProjects('archived').every((p) => p.status === 'archived')).toBe(true);
    expect(listProjects('active').length + listProjects('archived').length).toBe(listProjects().length);
  });

  it('returns the narrative fields for a known slug', () => {
    const p = getProject('keen-ops');
    expect(p).toBeDefined();
    expect(p?.problem).toBeTruthy();
    expect(p?.approach).toBeTruthy();
    expect(p?.outcome).toBeTruthy();
    expect(p?.role).toBeTruthy();
  });

  it('returns undefined for an unknown slug rather than throwing', () => {
    expect(getProject('nope')).toBeUndefined();
  });

  it('never leaks a dead link through the tool surface', () => {
    // ideahook's host serves a 404; the site data omits liveUrl and so must this.
    expect(getProject('ideahook')?.liveUrl).toBeUndefined();
  });

  it('marks exactly one current role', () => {
    const current = getExperience().filter((e) => e.current);
    expect(current.length).toBeGreaterThanOrEqual(1);
    for (const e of getExperience()) {
      expect(e.company).toBeTruthy();
      expect(e.highlights.length).toBeGreaterThan(0);
    }
  });
});
