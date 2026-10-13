import type { Project } from '../types/index.ts';

export const projects: Project[] = [
  {
    id: 1,
    slug: 'propbook',
    title: 'propbook',
    description:
      'A full-stack property investment tracker for Malaysian investors, built around an event-sourced Go financial engine and a Next.js AI chat web app.',
    problem:
      'Property investors often mix up whether a property is a good deal with what their own money is actually earning after cashback, paydowns, rent, expenses, and opportunity cost.',
    solution:
      'Built a Go MCP server with SQLite event sourcing, per-user isolation, financial replay, dual Deal IRR and Money IRR views, scenario comparison, timeline tools, and a Next.js frontend for AI chat, auth, usage gating, billing, and rich tool visualizations.',
    impact:
      'Turns sparse property events into dashboards, cashflow timelines, break-even dates, IRR analysis, and what-if comparisons for a live multi-user web product.',
    role: 'Full-stack product engineering, Go financial engine, MCP tools, AI chat UX, billing',
    image: '/images/propbook.png',
    tags: ['Go', 'MCP', 'SQLite', 'Next.js', 'TypeScript', 'Stripe'],
    liveUrl: 'https://propbook.laikahkeen.com',
    featured: true,
    status: 'active',
  },
  {
    id: 4,
    slug: 'keen-ops',
    title: 'keen-ops',
    description:
      'A personal life OS I use every day — one event store for health, reading, and finance, captured through a Telegram bot and reviewed in a Next.js dashboard.',
    problem:
      'The things worth tracking across a life were scattered across ten mediocre apps, none of which talked to each other, and none of which could answer a question that spanned two of them.',
    // No tool count here on purpose. The number was "41"; the registry actually
    // declares 45 (21 read, 24 write) and keen-ops' own comment says 38. A figure
    // with nothing keeping it fresh goes stale silently, and an indefensible
    // number is worse than none.
    solution:
      'Built three Go binaries and a Next.js PWA around a single events table: a Telegram bot with a Gemini-backed planner for capture, a read-only API, and a finance MCP server. Every operation computes its own inverse before it runs and both directions are stored, so a write can be replayed backwards. The single store is what would make a question spanning two domains answerable; the tooling built on it so far is finance.',
    // Softened 2026-09-25 (issue #17). This previously claimed "no correction is
    // ever destructive" and that cross-domain questions were answerable. The repo
    // contradicts the first (finance.go:2441-2455 records data lost on 2026-04-22
    // when an untracked mutation made /undo reverse an older batch) and does not
    // yet support the second. The honest version is also the more interesting one.
    impact:
      'In daily use and still growing. Reversibility holds for writes that go through the ops executor — one that bypassed it made the next undo reverse an older batch and lose data, which is why every path outside the executor now records an inverse of its own.',
    role: 'Solo build — Go services, event-sourced data model, MCP tooling, Next.js dashboard, deploys',
    tags: ['Go', 'MCP', 'SQLite', 'Next.js', 'TypeScript', 'Gemini'],
    featured: true,
    status: 'active',
  },
  {
    id: 2,
    slug: 'batch-video',
    title: 'batch.video',
    description:
      'A video processing experiment focused on batch workflows, FFmpeg integration, and 360-degree video handling.',
    problem:
      'Video editing and processing tasks can become repetitive when clips need the same transformations, exports, or workflow steps applied consistently.',
    solution: 'Built a Vite and React workflow that wraps FFmpeg-style processing into a direct batch interface.',
    impact:
      'Explored how a React, TypeScript, Tailwind, Electron, Zustand, and FFmpeg-based interface could make media processing more repeatable.',
    role: 'Frontend product build, FFmpeg workflow integration',
    image: '/images/batchvideo.png',
    tags: ['React', 'Vite', 'TypeScript', 'FFmpeg', 'Electron'],
    liveUrl: 'https://batchvideo.laikahkeen.com',
    githubUrl: 'https://github.com/laikahkeen/batchvideo',
    featured: false,
    status: 'archived',
  },
  // No liveUrl: the deployment was shut down Jan 2026 and the host now serves a
  // 404. The card stays as evidence of the build; do not restore the dead link.
  {
    id: 3,
    slug: 'ideahook',
    title: 'ideahook',
    description:
      'A SaaS tool for turning real Reddit conversations into validated hook ideas for solopreneurs and content creators.',
    problem:
      'Solopreneurs need content ideas that come from real audience language instead of generic brainstorming or unsupported guesses.',
    solution:
      'Built a React, TypeScript, Vite, Tailwind, Go, Chi, Redis, Stripe, and multi-provider LLM workflow that scrapes Reddit JSON endpoints and processes results in background jobs.',
    impact:
      'Packages Reddit posts and comments into hook ideas with a paid download path, Redis caching, rate limits, and Stripe checkout support.',
    role: 'Full-stack SaaS build, Reddit scraping, LLM workflow, payments integration',
    image: '/images/ideahook.png',
    tags: ['React', 'TypeScript', 'Go', 'Redis', 'Stripe', 'LLM'],
    featured: false,
    status: 'archived',
  },
];
