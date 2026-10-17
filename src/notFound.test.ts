import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import config from '../tailwind.config';

// public/404.html is copied to dist/404.html, which GitHub Pages serves for any
// path that misses. It is hand-written HTML outside Tailwind, so these pin what
// would otherwise drift silently.
const source = readFileSync(join(import.meta.dirname, '../public/404.html'), 'utf8');
const doc = new DOMParser().parseFromString(source, 'text/html');

describe('404 page', () => {
  it('is kept out of search indexes', () => {
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');
  });

  it('uses only absolute URLs, since it is served at arbitrary depths', () => {
    const urls = [...doc.querySelectorAll('[href], [src]')].map(
      (el) => el.getAttribute('href') ?? el.getAttribute('src') ?? '',
    );
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(url, `${url} is relative`).toMatch(/^(\/(?!\/)|https:\/\/)/);
  });

  it('links back to home and to the work', () => {
    const hrefs = [...doc.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/#projects');
  });

  it('uses only neutral palette colours, never the accent', () => {
    const { black, white, gray } = (
      config as { theme: { colors: { black: string; white: string; gray: Record<string, string> } } }
    ).theme.colors;
    const neutrals = [black, white, ...Object.values(gray)].map((c) => c.toLowerCase());

    const used = source.match(/#[0-9a-f]{3,8}\b/gi) ?? [];
    expect(used.length).toBeGreaterThan(0);
    for (const hex of used) expect(neutrals, `${hex} is not a neutral palette value`).toContain(hex.toLowerCase());
  });
});
