import { describe, expect, it } from 'vitest';
import { FIXTURE_DIR, loadPosts } from './content';
import { renderFeed, SITE_URL } from './feed';

const parse = (xml: string) => new DOMParser().parseFromString(xml, 'application/xml');
const text = (el: Element, tag: string) => el.getElementsByTagName(tag)[0]?.textContent;

describe('renderFeed', () => {
  const posts = loadPosts(FIXTURE_DIR);
  const doc = parse(renderFeed(posts));

  it('is well-formed RSS 2.0', () => {
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);
    expect(doc.documentElement.tagName).toBe('rss');
    expect(doc.documentElement.getAttribute('version')).toBe('2.0');
    const channel = doc.getElementsByTagName('channel')[0];
    for (const tag of ['title', 'link', 'description']) expect(text(channel, tag)?.trim()).toBeTruthy();
  });

  it('declares its own absolute URL', () => {
    const self = doc.getElementsByTagNameNS('http://www.w3.org/2005/Atom', 'link')[0];
    expect(self.getAttribute('href')).toBe(`${SITE_URL}/rss.xml`);
    expect(self.getAttribute('rel')).toBe('self');
  });

  it('carries the published posts, newest first, and no drafts', () => {
    const items = [...doc.getElementsByTagName('item')];
    expect(items.map((i) => text(i, 'link'))).toEqual([
      `${SITE_URL}/writing/fixture-newer/`,
      `${SITE_URL}/writing/fixture-older/`,
    ]);
    expect(renderFeed(posts)).not.toContain('fixture-draft');
  });

  it('escapes markup in titles rather than breaking the document', () => {
    const first = doc.getElementsByTagName('item')[0];
    expect(text(first, 'title')).toBe('Fixture newer post & <escaping>');
  });

  it('dates items in RFC 822, as RSS 2.0 requires', () => {
    const first = doc.getElementsByTagName('item')[0];
    expect(text(first, 'pubDate')).toBe('Sun, 01 Feb 2026 00:00:00 GMT');
    expect(text(first, 'guid')).toBe(text(first, 'link'));
  });
});
