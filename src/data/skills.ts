import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'TypeScript', level: 'advanced' },
      { name: 'Vue.js', level: 'advanced' },
      { name: 'React Native', level: 'intermediate' },
      { name: 'Vite/Vitest', level: 'advanced' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Go', level: 'intermediate' },
      { name: 'REST APIs', level: 'intermediate' },
      { name: 'PostgreSQL', level: 'intermediate' },
    ],
  },
  {
    title: 'Tools & DevOps',
    skills: [
      { name: 'Git', level: 'advanced' },
      { name: 'CI/CD', level: 'intermediate' },
      { name: 'AWS', level: 'intermediate' },
      { name: 'Docker', level: 'beginner' },
    ],
  },
  {
    title: 'Product',
    skills: [
      { name: 'Agile/Scrum', level: 'advanced' },
      { name: 'UI/UX Design', level: 'intermediate' },
    ],
  },
];
