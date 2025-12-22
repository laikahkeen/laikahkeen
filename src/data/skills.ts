import type { SkillCategory } from '../types'

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'Vue.js', level: 'expert' },
      { name: 'React', level: 'advanced' },
      { name: 'JavaScript/TypeScript', level: 'expert' },
      { name: 'Tailwind CSS', level: 'expert' },
      { name: 'HTML/CSS', level: 'expert' },
      { name: 'GSAP', level: 'advanced' },
    ]
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 'advanced' },
      { name: 'Express', level: 'advanced' },
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'MongoDB', level: 'intermediate' },
      { name: 'REST APIs', level: 'expert' },
      { name: 'GraphQL', level: 'intermediate' },
    ]
  },
  {
    title: 'Tools & DevOps',
    skills: [
      { name: 'Git', level: 'expert' },
      { name: 'Docker', level: 'advanced' },
      { name: 'CI/CD', level: 'advanced' },
      { name: 'AWS', level: 'intermediate' },
      { name: 'Vite', level: 'advanced' },
      { name: 'Webpack', level: 'intermediate' },
    ]
  },
  {
    title: 'Other',
    skills: [
      { name: 'UI/UX Design', level: 'intermediate' },
      { name: 'Figma', level: 'intermediate' },
      { name: 'Agile/Scrum', level: 'advanced' },
      { name: 'Testing (Jest, Vitest)', level: 'advanced' },
    ]
  }
]
