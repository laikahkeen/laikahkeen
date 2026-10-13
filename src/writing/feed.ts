import type { PostMeta } from '../types/index.ts';
import { SITE_URL } from '../data/site.ts';
import { writingIndex } from '../data/writingPages.ts';

export const FEED_PATH = '/rss.xml';
export const FEED_TITLE = 'Lai Kah Keen - Writing';

// Hex references, not &amp;/&lt;: the RSS Best Practices Profile (rssboard.org/rss-profile §3.1)
// found these decode as plain text in the most aggregators. For element content only.
const escapeXml = (s: string) => s.replace(/&/g, '&#x26;').replace(/</g, '&#x3C;').replace(/>/g, '&#x3E;');

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
      // Readers render an item description as HTML (profile §4.1.1.20.4), so the plain-text
      // summary is HTML-escaped first; escaped once, `<script>` would reach the reader as markup.
      `      <description>${escapeXml(escapeHtml(p.summary))}</description>`,
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
    `    <description>${escapeXml(writingIndex.description)}</description>`,
    '    <language>en</language>',
    // Newest post date rather than build time, so an unchanged feed stays byte-identical.
    `    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
