import type { Experience } from '../types';

// Titles, companies and periods must agree with cv/cv.yaml — if the CV and the
// site disagree about a role or a date, that is a defect, not a difference of
// emphasis (see CLAUDE.md). The site carries the longer version of each entry.
//
// Fixed 2026-08: this file described ABC Sales AI as "custom web applications
// for clients worldwide", which is an agency framing for what is a multi-tenant
// SaaS product, and it never mentioned the MCP server — the single strongest
// fact available. Boostomatic was missing entirely.
export const experiences: Experience[] = [
  {
    id: 1,
    company: 'ABC Sales AI',
    role: 'Full Stack Developer',
    period: 'Sept 2025 - Present',
    location: 'Remote',
    description:
      'Building a multi-tenant SaaS product — and the internal AI tooling the company uses to build and run it. Part-time and contract here from Apr 2024 to Aug 2025 before going full-time.',
    responsibilities: [
      'Wrote an internal MCP server in Go, now hosted and adopted beyond engineering — by the product and non-technical business teams — to connect their AI agents to the company task tracker',
      'Build and ship product features on a multi-tenant SaaS frontend in Vue 3, Pinia, PrimeVue and Tailwind, carrying work from requirement through to production',
      'Own billing and subscriptions across the frontend and the Go API behind it, including a silent MYR to TWD migration that moved live subscriptions across plans with no customer-facing disruption',
    ],
    current: true,
  },
  {
    id: 2,
    company: 'Boostomatic',
    role: 'Contract Engineer',
    period: 'Mar 2026 - Present',
    location: 'Remote',
    description:
      'Marketing agency, in production. Replacing hand-maintained automation with services a non-developer can operate. Run alongside full-time engineering work.',
    responsibilities: [
      'Built a Go service replacing 30+ hand-maintained Notion automation rules with a single YAML config, routing task digests to 14 Slack channels across 8 client accounts on a cron schedule',
      'Added a Gemini-backed Slack assistant for reading and writing Notion tasks, designed so a non-developer operates it without touching code',
    ],
    current: true,
  },
  {
    id: 3,
    company: 'Kloudius Services',
    role: 'Software Developer',
    period: 'Mar 2024 - Jun 2025',
    location: 'Kuala Lumpur, MY',
    description: 'Cross-platform React Native TV streaming app for a company serving global clients.',
    responsibilities: [
      'Maintained and extended a cross-platform React Native TV streaming app with modular TypeScript components',
      'Worked across Redux and Zustand state, with Jest coverage on the parts that carried risk',
      'Fixed accessibility and input handling for constrained TV hardware, where a remote is the only pointer',
    ],
    current: false,
  },
  {
    id: 4,
    company: 'FAR Capital',
    role: 'Automation Specialist → Lead',
    period: '2021 - Feb 2024',
    location: 'Kuala Lumpur, MY',
    description:
      'Where the engineering started: business automation for a property firm, growing from building automations to leading the work.',
    responsibilities: [
      'Designed and implemented business automation across the property operation, from listings to portfolio and buyer management',
      'Built a rental booking system, a custom CRM, and an MVP screening application over a MySQL database',
      'Turned business requirements into working systems with non-technical stakeholders, which is where the interest in software came from',
    ],
    current: false,
  },
  // Kept here although the CV cuts it — cv/README.md drops non-engineering
  // history to hold one page, but the site has room and this is the honest
  // start of the timeline. Do not add it back to the CV.
  {
    id: 5,
    company: 'Architecture Firm',
    role: 'Assistant Architect',
    period: '2020 - 2021',
    location: 'Kuala Lumpur, MY',
    description: 'Two months in the profession the degree was for, which was enough to know it was not the one.',
    responsibilities: [
      'Provided architectural assistance in developing construction plans',
      'Produced 2D drawings and 3D renderings against tight project schedules',
    ],
    current: false,
  },
];
