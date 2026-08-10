import type { JourneyMilestone } from '../types';

// Reverse-chronological. Keep this in step with cv/cv.yaml and experience.ts —
// the site tells the longer version of the same story, never a different one.
//
// Added 2026 entries (2026-08): the timeline previously stopped at 2025 and so
// contained none of the work the CV now leads with.
export const journeyMilestones: JourneyMilestone[] = [
  {
    id: 0,
    year: '2026',
    title: 'Agent tooling as the main line of work',
    description:
      'The MCP server I wrote for my engineering team spread past it — product and the non-technical business team run their AI agents through it too, which changed what I think my job is. Shipped two more since: the finance engine inside propbook, and a 41-tool server behind keen-ops, the life OS I run my own days on. Started contracting for Boostomatic in March, replacing 30+ hand-maintained Notion rules with one Go service a non-developer can operate.',
    type: 'career',
  },
  {
    id: 1,
    year: '2025',
    title: 'Full Stack Developer, full-time',
    description:
      'Went full-time at ABC Sales AI in September after eighteen months part-time and on contract. Building product features on a multi-tenant SaaS frontend in Vue 3, and taking ownership of billing and subscriptions across the frontend and the Go API behind it — including a live currency migration that moved paying customers across plans without them noticing.',
    type: 'career',
  },
  {
    id: 2,
    year: '2024',
    title: 'Two jobs at once',
    description:
      'Began contributing to a cross-platform React Native TV app at Kloudius Services, a Malaysian company doing front-end work for global clients — modular TypeScript, Redux and Zustand, and accessibility on hardware where a remote is the only pointer. Ran ABC Sales AI alongside it part-time, in Vue.',
    type: 'career',
  },
  {
    id: 3,
    year: '2023',
    title: 'Self-taught web development',
    description:
      'Started learning web development on my own through Codecademy and freeCodeCamp, while building end-to-end no-code MVPs for FAR Capital against real business requirements — a property rental booking system and a financial screening application. Learning against real constraints turned out to matter more than the courses.',
    type: 'learning',
  },
  {
    id: 4,
    year: '2022',
    title: 'Automation Specialist → Lead',
    description:
      'Designing and implementing automation across a property operation, and eventually leading that work. Most of the job was understanding the business well enough to know which parts were worth automating, then building a custom CRM to manage the portfolio and buyers.',
    type: 'career',
  },
  {
    id: 5,
    year: '2021',
    title: 'Apprenticeship at FAR Capital',
    description:
      'Joined FAR Capital to learn the property industry, which turned out not to be what I expected. I quickly worked out I was more interested in the technology behind running a business than in the business itself.',
    type: 'career',
  },
  {
    id: 6,
    // NOT a conflict with the CV, which records the degree as 2018-2020.
    // Confirmed by the owner: study finished in 2020, conferral was 2021. The
    // CV shows the study period; this milestone marks graduating. Both are
    // correct — do not "reconcile" them.
    year: '2021',
    title: 'Architecture degree',
    description:
      "Graduated from Taylor's University with a Bachelor's in Architecture, worked as an assistant architect for two months, and realised I did not want to be an architect. The training in drawing a thing precisely before building it has been more useful than expected.",
    type: 'education',
  },
];
