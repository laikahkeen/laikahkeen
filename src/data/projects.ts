import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'batch.video',
    description: 'A video processing platform featuring batch processing of videos.',
    image: '/images/batchvideo.png',
    tags: ['React', 'Vite', 'TypeScript', 'FFmpeg'],
    liveUrl: 'https://batchvideo.laikahkeen.com',
    githubUrl: 'https://github.com/laikahkeen/batchvideo',
    featured: true,
  },
  {
    id: 2,
    title: 'ideahook',
    description:
      'A SaaS tool that transforms Reddit conversations into validated content hook ideas using LLM analysis.',
    image: '/images/ideahook.png',
    tags: ['React', 'TypeScript', 'Go', 'Redis', 'Stripe'],
    liveUrl: 'https://ideahook.laikahkeen.com',
    featured: true,
  },
];
