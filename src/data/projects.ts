import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A modern e-commerce platform built with Vue 3 and Node.js, featuring real-time inventory management, payment integration, and advanced analytics.',
    image: '/images/project1.jpg', // Replace with actual image path
    tags: ['Vue 3', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/laikahkeen/project1',
    featured: true,
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'Collaborative task management application with real-time updates, team workspaces, and intelligent task prioritization.',
    image: '/images/project2.jpg',
    tags: ['React', 'Express', 'MongoDB', 'Socket.io', 'Material UI'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/laikahkeen/project2',
    featured: true,
  },
  {
    id: 3,
    title: 'Portfolio CMS',
    description:
      'Content management system designed specifically for creative portfolios, with drag-and-drop interface and custom theming.',
    image: '/images/project3.jpg',
    tags: ['Vue 3', 'TypeScript', 'GraphQL', 'Headless CMS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/laikahkeen/project3',
    featured: false,
  },
  {
    id: 4,
    title: 'Analytics Dashboard',
    description:
      'Real-time analytics dashboard with interactive charts, data visualization, and comprehensive reporting features.',
    image: '/images/project4.jpg',
    tags: ['React', 'D3.js', 'Node.js', 'Redis', 'Chart.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/laikahkeen/project4',
    featured: false,
  },
];
