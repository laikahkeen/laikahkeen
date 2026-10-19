import { projects } from '../../src/data/projects.ts';
import { experiences } from '../../src/data/experience.ts';

/**
 * Tool payloads. Shaped from the site's own data files, so a visiting agent and
 * a visiting human are told the same thing.
 *
 * No zod here: the site imports this file to replay the tools when the endpoint
 * is unreachable, and the schemas would ride along into its bundle.
 */

export const SITE_URL = 'https://laikahkeen.com';

export function listProjects(status?: 'active' | 'archived') {
  return projects
    .filter((p) => (status ? p.status === status : true))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.description,
      tech: p.tags,
      status: p.status,
      featured: p.featured,
      caseStudy: `${SITE_URL}/work/${p.slug}`,
      liveUrl: p.liveUrl,
      sourceUrl: p.githubUrl,
    }));
}

export function getProject(slug: string) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return undefined;
  return {
    slug: p.slug,
    title: p.title,
    summary: p.description,
    problem: p.problem,
    approach: p.solution,
    outcome: p.impact,
    role: p.role,
    tech: p.tags,
    status: p.status,
    caseStudy: `${SITE_URL}/work/${p.slug}`,
    liveUrl: p.liveUrl,
    sourceUrl: p.githubUrl,
  };
}

export function getExperience() {
  return experiences.map((e) => ({
    company: e.company,
    role: e.role,
    period: e.period,
    location: e.location,
    current: e.current,
    summary: e.description,
    highlights: e.responsibilities,
  }));
}
