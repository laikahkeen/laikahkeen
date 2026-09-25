import { describe, expect, it } from 'vitest';
import { projects } from './projects';

// These guard decisions that are currently only recorded in comments. A comment
// is not greppable by anyone in a hurry; a failing test is.
describe('projects data', () => {
  it('gives every project a URL-safe slug', () => {
    for (const p of projects) {
      expect(p.slug, `${p.title} has no slug`).toBeTruthy();
      expect(p.slug, `${p.title} slug is not URL-safe`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('keeps slugs unique', () => {
    // A duplicate silently shadows a prerendered page rather than erroring.
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('populates the narrative fields CLAUDE.md requires', () => {
    for (const p of projects) {
      for (const field of ['problem', 'solution', 'impact', 'role'] as const) {
        expect(p[field]?.trim(), `${p.title}.${field} is empty`).toBeTruthy();
      }
    }
  });

  it('does not restore ideahook’s dead liveUrl', () => {
    // The deployment was shut down Jan 2026 and the host serves a 404. The card
    // stays as evidence of the build; the link must not come back.
    const ideahook = projects.find((p) => p.slug === 'ideahook');
    expect(ideahook).toBeDefined();
    expect(ideahook?.liveUrl).toBeUndefined();
  });

  it('marks exactly the live projects as active', () => {
    const active = projects.filter((p) => p.status === 'active').map((p) => p.slug);
    expect(active.sort()).toEqual(['keen-ops', 'propbook']);
  });
});
