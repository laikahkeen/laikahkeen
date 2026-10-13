import type { PostMeta } from '../types/index.ts';

export const SITE_URL = 'https://laikahkeen.com';
export const FEED_PATH = '/rss.xml';
export const FEED_TITLE = 'Lai Kah Keen - Writing';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

// RFC 822, which RSS 2.0 requires; toUTCString emits exactly that shape.
const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

// RSS 2.0, summaries only. Expects published posts, newest first, at least one —
// with none there is no feed (see the writing plugin).
export function renderFeed(posts: PostMeta[]): string {
  const items = posts.map((p) => {
    const url = `${SITE_URL}/writing/${p.slug}/`;
    return [
      '    <item>',
      `      <title>${escapeXml(p.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(p.date)}</pubDate>`,
      `      <description>${escapeXml(p.summary)}</description>`,
      '    </item>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${FEED_TITLE}</title>`,
    `    <link>${SITE_URL}/writing/</link>`,
    `    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml"/>`,
    '    <description>Writing by Lai Kah Keen.</description>',
    '    <language>en</language>',
    // Newest post date rather than build time, so an unchanged feed stays byte-identical.
    `    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
