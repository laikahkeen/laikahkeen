import { describe, expect, it } from 'vitest';
import { FIXTURE_DIR, WRITING_DIR, loadPosts, parsePost, writingDir, writingRoutes } from './content';

const post = (frontmatter: string, body = 'Fixture body.') => `---\n${frontmatter}\n---\n\n${body}\n`;
const valid = 'title: T\ndate: 2026-01-01\nsummary: S\nslug: fixture-x';

describe('parsePost', () => {
  it('reads the frontmatter contract and renders the body', () => {
    const p = parsePost(post(valid, '## H\n\nText'), 'x.md');
    expect(p).toMatchObject({ slug: 'fixture-x', title: 'T', date: '2026-01-01', summary: 'S', draft: false });
    expect(p.html).toContain('<h2>H</h2>');
  });

  it.each([
    ['a missing title', 'date: 2026-01-01\nsummary: S\nslug: s', /"title"/],
    ['a missing summary', 'title: T\ndate: 2026-01-01\nslug: s', /"summary"/],
    ['a missing slug', 'title: T\ndate: 2026-01-01\nsummary: S', /"slug"/],
    ['a URL-unsafe slug', 'title: T\ndate: 2026-01-01\nsummary: S\nslug: Not Safe', /not URL-safe/],
    ['a non-ISO date', 'title: T\ndate: 1 Jan 2026\nsummary: S\nslug: s', /YYYY-MM-DD/],
    ['a string draft flag', `${valid}\ndraft: "yes"`, /"draft"/],
    ['a misspelt key', `${valid}\ndrafts: true`, /unknown frontmatter key "drafts"/],
  ])('rejects %s', (_case, frontmatter, error) => {
    expect(() => parsePost(post(frontmatter), 'x.md')).toThrow(error);
  });

  it('rejects a file with no frontmatter or no body', () => {
    expect(() => parsePost('Just text', 'x.md')).toThrow(/frontmatter/);
    expect(() => parsePost(post(valid, ''), 'x.md')).toThrow(/no body/);
  });

  it('escapes raw HTML rather than rendering it', () => {
    const p = parsePost(post(valid, '<script>alert(1)</script>'), 'x.md');
    expect(p.html).not.toContain('<script>');
  });
});

describe('loadPosts', () => {
  it('returns published posts newest first, without drafts', () => {
    expect(loadPosts(FIXTURE_DIR).map((p) => p.slug)).toEqual(['fixture-newer', 'fixture-older']);
  });

  it('treats a missing directory as no posts', () => {
    expect(loadPosts(`${FIXTURE_DIR}/does-not-exist`)).toEqual([]);
  });
});

describe('production route list', () => {
  // vite.config.ts feeds writingRoutes(loadPosts(writingDir(mode))) to includedRoutes.
  const dir = writingDir('production');
  const routes = writingRoutes(loadPosts(dir));

  it('reads the content directory, not the fixtures', () => {
    expect(dir).toBe(WRITING_DIR);
    expect(dir.startsWith(FIXTURE_DIR)).toBe(false);
    expect(writingDir('test')).toBe(FIXTURE_DIR);
  });

  it('never includes fixtures or drafts', () => {
    for (const slug of ['fixture-newer', 'fixture-older', 'fixture-draft']) {
      expect(routes).not.toContain(`/writing/${slug}`);
    }
    expect(writingRoutes(loadPosts(FIXTURE_DIR))).not.toContain('/writing/fixture-draft');
  });

  it('prerenders /writing only when something is published', () => {
    expect(routes.includes('/writing')).toBe(routes.length > 0);
    expect(writingRoutes([])).toEqual([]);
  });
});
