// Skill types
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

// Project types
export interface Project {
  id: number;
  // URL segment for /work/<slug>. Permanent once shared — rename only with a
  // redirect, never in place.
  slug: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  role: string;
  // Optional: not every project is publicly visitable or screenshottable.
  // keen-ops is a private personal system — no public URL, no screenshot.
  // ProjectCard degrades gracefully when either is absent.
  image?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'active' | 'archived';
}

// Case study types — the long form behind a project card, at /work/<slug>.
export interface CaseStudySection {
  heading: string;
  // One string per paragraph. Prose only; no markup.
  body: string[];
}

export interface CaseStudy {
  // Must match a Project.slug — enforced by src/data/caseStudies.test.ts.
  slug: string;
  standfirst: string;
  sections: CaseStudySection[];
  // Named rather than inlined as SVG: a diagram is presentation, so it lives in a
  // component and the data only says which one.
  diagram?: 'event-flow';
  diagramCaption?: string;
}

// Journey types
export type MilestoneType = 'career' | 'education' | 'learning' | 'achievement';

export interface JourneyMilestone {
  id: number;
  year: string;
  title: string;
  description: string;
  type: MilestoneType;
}

// Experience types
export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  current: boolean;
}

// GSAP Animation options
export interface ScrollTriggerOptions {
  trigger?: any;
  start?: string;
  end?: string;
  scrub?: boolean;
  toggleActions?: string;
  [key: string]: any;
}

export interface AnimationOptions {
  scrollTrigger?: ScrollTriggerOptions;
  animation?: Record<string, any>;
  stagger?: number;
  [key: string]: any;
}

export interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  trigger?: any;
  scrollTrigger?: ScrollTriggerOptions;
  animation?: Record<string, any>;
  strength?: number;
}
