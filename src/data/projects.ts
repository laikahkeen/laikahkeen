import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'propbook',
    description: 'A property-focused product concept and booking workflow built around real-world rental operations.',
    image: '/images/propbook.png',
    tags: ['Next.js', 'Golang', 'Typescript'],
    liveUrl: 'https://propbook.laikahkeen.com',
    featured: true,
    status: 'active',
  },
  {
    id: 2,
    title: 'batch.video',
    description: 'A video processing platform featuring batch processing of videos.',
    image: '/images/batchvideo.png',
    tags: ['React', 'Vite', 'TypeScript', 'FFmpeg'],
    liveUrl: 'https://batchvideo.laikahkeen.com',
    githubUrl: 'https://github.com/laikahkeen/batchvideo',
    featured: false,
    status: 'archived',
  },
  {
    id: 3,
    title: 'ideahook',
    description:
      'A SaaS tool that transforms Reddit conversations into validated content hook ideas using LLM analysis.',
    image: '/images/ideahook.png',
    tags: ['React', 'TypeScript', 'Go', 'Redis', 'Stripe'],
    liveUrl: 'https://ideahook.laikahkeen.com',
    featured: false,
    status: 'archived',
  },
];
