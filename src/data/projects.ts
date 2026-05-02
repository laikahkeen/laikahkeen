import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
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
    id: 2,
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
  {
    id: 3,
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
    liveUrl: 'https://ideahook.laikahkeen.com',
    featured: false,
    status: 'archived',
  },
];
