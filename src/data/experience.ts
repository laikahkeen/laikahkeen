import type { Experience } from '../types'

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'Freelance',
    role: 'Full Stack Developer',
    period: '2024 - Present',
    location: 'Remote',
    description: 'Building custom web applications for clients worldwide, specializing in Vue.js and Node.js solutions.',
    responsibilities: [
      'Developing full-stack web applications using Vue 3, Node.js, and PostgreSQL',
      'Implementing responsive designs with Tailwind CSS and modern animation libraries',
      'Collaborating with designers and stakeholders to deliver high-quality products',
      'Optimizing application performance and ensuring best practices'
    ],
    current: true
  },
  {
    id: 2,
    company: 'Tech Startup Inc.',
    role: 'Senior Full Stack Developer',
    period: '2023 - 2024',
    location: 'San Francisco, CA',
    description: 'Led development team in building scalable SaaS platform serving 50,000+ users.',
    responsibilities: [
      'Architected and developed new features for SaaS platform',
      'Mentored junior developers and conducted code reviews',
      'Implemented CI/CD pipelines and automated testing',
      'Collaborated with product team on technical requirements'
    ],
    current: false
  },
  {
    id: 3,
    company: 'Digital Agency Co.',
    role: 'Full Stack Developer',
    period: '2021 - 2023',
    location: 'New York, NY',
    description: 'Developed client websites and web applications for various industries.',
    responsibilities: [
      'Built responsive websites and web applications using Vue.js and React',
      'Developed RESTful APIs with Node.js and Express',
      'Integrated third-party services and payment gateways',
      'Maintained and optimized existing client projects'
    ],
    current: false
  },
  {
    id: 4,
    company: 'Web Solutions Ltd.',
    role: 'Junior Frontend Developer',
    period: '2020 - 2021',
    location: 'Remote',
    description: 'Started professional career building modern web interfaces.',
    responsibilities: [
      'Developed user interfaces using HTML, CSS, and JavaScript',
      'Collaborated with designers to implement pixel-perfect designs',
      'Learned modern frameworks and best practices',
      'Assisted in debugging and fixing production issues'
    ],
    current: false
  }
]
