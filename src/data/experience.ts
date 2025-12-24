import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'ABC Sales AI',
    role: 'Full Stack Developer',
    period: '2024 - Present',
    location: 'Remote',
    description: 'Building custom web applications for clients worldwide, specializing in Vue.js and Golang solutions.',
    responsibilities: [
      'Developing full-stack web applications using Vue 3, Golang, and PostgreSQL',
      'Implementing responsive designs with Tailwind CSS and modern animation libraries',
      'Collaborating with designers and stakeholders to deliver high-quality products',
      'Optimizing application performance and ensuring best practices',
    ],
    current: true,
  },
  {
    id: 2,
    company: 'Kloudius Services',
    role: 'React Native Developer',
    period: '2024 - 2025',
    location: 'Kuala Lumpur, MY',
    description: 'Building scalable React Native applications for global clients.',
    responsibilities: [
      'Developing scalable React Native applications for global clients',
      'Testing and debugging applications to ensure quality and performance',
      'Optimizing application performance and ensuring best practices',
    ],
    current: false,
  },
  {
    id: 3,
    company: 'FAR Capital',
    role: 'Automation Specialist',
    period: '2021 - 2024',
    location: 'Kuala Lumpur, MY',
    description: 'Design and implement automation solutions for the property industry.',
    responsibilities: [
      'Design and implement automation solutions for the property industry',
      'Automated the process of creating and updating property listings, and managing the property portfolio and buyers',
      'Contributed to the development of a custom CRM system for FAR Capital to manage the property portfolio and buyers',
    ],
    current: false,
  },
  {
    id: 4,
    company: 'Architecture Firm',
    role: 'Assistant Architect',
    period: '2020 - 2021',
    location: 'Kuala Lumpur, MY',
    description: 'Started professional career as an assistant architect.',
    responsibilities: [
      'Provide architectural assistance to architects in developing construction plans',
      'Processed 2D drawings & 3D renderings with a focus on meeting tight project schedules',
    ],
    current: false,
  },
];
