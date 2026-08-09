import type { SkillCategory } from '../types';

// Categories and their ORDER mirror the CV (cv/cv.yaml): AI first, then
// Frontend, Backend, Infra. The site carries more depth than the CV can fit on
// one page, but it must not lead with something different — see the positioning
// section in CLAUDE.md. Previously this file had no AI category at all, while
// the CV led with it.
export const skillCategories: SkillCategory[] = [
  {
    title: 'AI & Agent Tooling',
    skills: [
      { name: 'MCP servers', level: 'advanced' },
      { name: 'Tool/function calling', level: 'advanced' },
      { name: 'Agent workflows', level: 'advanced' },
      { name: 'LLM integration', level: 'advanced' },
      { name: 'Gemini', level: 'intermediate' },
      { name: 'Multi-provider LLM', level: 'intermediate' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'TypeScript', level: 'advanced' },
      { name: 'Vue 3', level: 'advanced' },
      { name: 'Pinia', level: 'advanced' },
      { name: 'React', level: 'intermediate' },
      { name: 'React Native', level: 'intermediate' },
      { name: 'Next.js', level: 'intermediate' },
      { name: 'Tailwind CSS', level: 'advanced' },
      { name: 'Vite/Vitest', level: 'advanced' },
      { name: 'Jest', level: 'intermediate' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Go', level: 'advanced' },
      { name: 'Gin/Chi', level: 'intermediate' },
      { name: 'Node.js', level: 'intermediate' },
      { name: 'PostgreSQL', level: 'intermediate' },
      { name: 'SQLite', level: 'advanced' },
      { name: 'Redis', level: 'intermediate' },
      { name: 'REST/OpenAPI', level: 'advanced' },
      { name: 'Event sourcing', level: 'intermediate' },
      { name: 'Stripe billing', level: 'intermediate' },
    ],
  },
  {
    title: 'Infra',
    skills: [
      { name: 'Docker', level: 'intermediate' },
      { name: 'Terraform', level: 'beginner' },
      { name: 'AWS Lambda', level: 'intermediate' },
      { name: 'Railway', level: 'intermediate' },
      { name: 'GitHub Actions', level: 'intermediate' },
      { name: 'Git', level: 'advanced' },
    ],
  },
];
