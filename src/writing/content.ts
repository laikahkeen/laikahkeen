// Build-time only: runs in Node from vite.config.ts and the writing plugin. Never
// import this from a component — it would pull markdown-it into the client bundle.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import MarkdownIt from 'markdown-it';
import { parse as parseYaml } from 'yaml';
import type { Post } from '../types/index.ts';

export const WRITING_DIR = resolve(import.meta.dirname, '../data/writing');
export const FIXTURE_DIR = resolve(import.meta.dirname, '../test/fixtures/writing');

// Vitest runs in mode "test"; every other mode, including the build, reads the real content.
export function writingDir(mode: string): string {
  return mode === 'test' ? FIXTURE_DIR : WRITING_DIR;
}

export interface ParsedPost extends Post {
  draft: boolean;
}

const KEYS = new Set(['title', 'date', 'summary', 'slug', 'draft']);
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// html: false — raw HTML in a post is escaped, not rendered.
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${file}: "${key}" must be a non-empty string`);
  return value.trim();
}

function isCalendarDate(date: string): boolean {
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function parsePost(source: string, file: string): ParsedPost {
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`${file}: missing --- frontmatter block`);

  const data: unknown = parseYaml(match[1]);
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error(`${file}: frontmatter is not a mapping`);
  const fm = data as Record<string, unknown>;

  // An unknown key is almost always a typo, and `drafts: true` would publish a draft.
  for (const key of Object.keys(fm)) {
    if (!KEYS.has(key)) throw new Error(`${file}: unknown frontmatter key "${key}"`);
  }

  const slug = requireString(fm, 'slug', file);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`${file}: slug "${slug}" is not URL-safe`);

  const date = requireString(fm, 'date', file);
  // Round-tripped because Date.parse rolls 2026-02-30 over to March rather than rejecting it.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isCalendarDate(date)) {
    throw new Error(`${file}: date "${date}" must be a real YYYY-MM-DD date`);
  }

  // Not `?? false`: a bare `draft:` parses as null and would publish the draft.
  const draft = 'draft' in fm ? fm.draft : false;
  if (typeof draft !== 'boolean') throw new Error(`${file}: "draft" must be true or false`);

  const body = match[2].trim();
  if (!body) throw new Error(`${file}: post has no body`);

  return {
    slug,
    title: requireString(fm, 'title', file),
    date,
    summary: requireString(fm, 'summary', file),
    html: md.render(body),
    draft,
  };
}

// Published posts only, newest first. Drafts never leave this function.
export function loadPosts(dir: string): Post[] {
  if (!existsSync(dir)) return [];

  const parsed = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(readFileSync(join(dir, f), 'utf8'), join(dir, f)));

  // Checked across drafts too: a draft sharing a slug would collide the day it is published.
  const seen = new Set<string>();
  for (const p of parsed) {
    if (seen.has(p.slug)) throw new Error(`${dir}: duplicate slug "${p.slug}"`);
    seen.add(p.slug);
  }

  return parsed
    .filter((p) => !p.draft)
    .map(({ draft, ...post }) => post)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

// The index only exists once there is something to list.
export function writingRoutes(posts: Post[]): string[] {
  return posts.length ? ['/writing', ...posts.map((p) => `/writing/${p.slug}`)] : [];
}
