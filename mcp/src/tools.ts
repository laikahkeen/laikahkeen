import { z } from 'zod';

/**
 * Three tools, and it stays three. The descriptions are the craft here — an agent
 * decides whether to call a tool from its description alone, so each one says what
 * it returns and when to reach for it. Payloads are in payloads.ts.
 */

export const getProjectInput = {
  slug: z.string().describe("Project slug, as returned by list_projects — e.g. 'keen-ops'. Not the display title."),
};

export const listProjectsInput = {
  status: z
    .enum(['active', 'archived'])
    .optional()
    .describe('Omit for everything. "active" is work in current use; "archived" is shipped but no longer maintained.'),
};

export const TOOL_DESCRIPTIONS = {
  list_projects:
    "List Lai Kah Keen's engineering projects with a one-line summary, tech stack, status, and a link to the full case study. Start here — it returns the slugs the other tools take.",
  get_project:
    'Full detail on one project: the problem it addressed, the approach taken, the outcome, and his specific role. Use this when asked what someone actually built or how a system works, rather than what they list on a CV.',
  get_experience:
    'Employment history: companies, titles, dates, and the concrete work at each. Use this for questions about seniority, dates, or where a particular piece of work was done.',
} as const;
