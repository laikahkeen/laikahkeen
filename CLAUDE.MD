# CLAUDE.MD

This file provides context for Claude Code and other AI assistants working on this portfolio website project.

## Project Overview

A modern, single-page developer portfolio for Lai Kah Keen built with Vue 3, Tailwind CSS, and GSAP animations. The project features a strict black and white monochrome theme with advanced scroll animations and smooth interactions.

**Live Site**: https://laikahkeen.com

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **Animations**: GSAP 3.x with ScrollTrigger plugin
- **Smooth Scroll**: Lenis
- **Language**: TypeScript (with Vue TSC for type checking)

## Project Structure

```
laikahkeen/
├── public/              # Static assets (images, CNAME)
├── src/
│   ├── assets/          # Styles (main.css with Tailwind directives)
│   ├── components/
│   │   ├── layout/      # Navigation.vue, Footer.vue
│   │   ├── sections/    # HeroSection, AboutSection, etc.
│   │   └── ui/          # Reusable components (Button, ProjectCard, etc.)
│   ├── composables/     # Vue composables for scroll animations
│   ├── data/            # Content data (projects, skills, journey, experience)
│   ├── utils/           # Utility functions
│   ├── App.vue          # Root component
│   ├── main.ts          # Application entry point
│   └── api.ts           # API integration (Web3Forms)
├── index.html           # HTML entry with meta tags and SEO
├── package.json
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Coding Conventions

### Vue Components

- Use `<script setup>` syntax for all components
- Use Composition API with reactive state management
- Component naming: PascalCase for files (e.g., `HeroSection.vue`)
- Prefer `ref()` and `reactive()` over Options API
- Keep components focused and single-responsibility

### Styling

- **Tailwind-first**: Use Tailwind utility classes for all styling
- **Monochrome theme**: Strict black (#000000), white (#FFFFFF), and gray scale
- Color palette defined in `tailwind.config.js`:
  - `gray-50` through `gray-950` for grayscale variations
  - No colors outside the monochrome palette
- Responsive: Mobile-first approach using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Custom animations defined in `tailwind.config.js` under `extend.animation`

### Animations

- **GSAP**: Used for complex scroll-triggered animations
- **ScrollTrigger**: Attached to section components via composables
- **Lenis**: Smooth scroll initialized in `main.ts`
- Common patterns:
  - Fade-in on scroll: `gsap.from()` with `opacity: 0, y: 50`
  - Stagger animations: Use `stagger: 0.1` for sequential reveals
  - Parallax effects: Use different scroll speeds via `yPercent`

### Data Management

Content is separated into data files in `src/data/`:

- `projects.ts`: Portfolio projects with title, description, tech, image, links
- `skills.ts`: Technical skills grouped by category
- `journey.ts`: Timeline of education and career milestones
- `experience.ts`: Work experience entries

When updating content, modify these data files rather than hardcoding in components.

## Key Features

### Sections

1. **Hero**: Parallax background shapes, animated title with typewriter effect
2. **About**: Profile photo with bio and core competencies
3. **Journey**: Vertical timeline with milestone markers
4. **Skills**: Categorized skill tags (Frontend, Backend, Tools, etc.)
5. **Experience**: Work history with expandable details and resume download link
6. **Contact**: Fully functional form integrated with Web3Forms

### SEO & Meta Tags

- Open Graph tags for social sharing (`index.html`)
- Twitter card meta tags
- Semantic HTML structure
- Meta description and keywords
- Complete favicon suite (16x16, 32x32, Apple touch icon, Android icons)
- OG image for social preview (`/public/og-image.png`)
- Web manifest for PWA support

## Development Workflow

### Running the Project

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding New Features

1. **New Section**: Create component in `src/components/sections/`
2. **New UI Component**: Add to `src/components/ui/`
3. **New Data**: Add file to `src/data/` and import in relevant component
4. **New Animation**: Create composable in `src/composables/` or add inline with GSAP

### Common Tasks

**Update Projects**: Edit `src/data/projects.ts`
**Update Skills**: Edit `src/data/skills.ts`
**Update Journey**: Edit `src/data/journey.ts`
**Update Experience**: Edit `src/data/experience.ts`
**Update Resume**: Replace `/public/resume.pdf`
**Change Colors**: Modify `tailwind.config.js` (stick to monochrome)
**Add Meta Tags**: Update `index.html`
**Modify Navigation**: Edit `src/components/layout/Navigation.vue`

## Deployment

The site is deployed on GitHub Pages with a custom domain (laikahkeen.com).

- **Build command**: `npm run build`
- **Output directory**: `dist/`
- **CNAME**: Configured in `public/CNAME`

## Important Notes

### Design System

- Maintain strict monochrome theme - no colors outside black/white/gray
- All hover states use grayscale transitions
- Consistent spacing using Tailwind's spacing scale
- Typography: System fonts with fallbacks defined in Tailwind config

### Performance

- Lazy load images where possible
- Optimize GSAP imports (only import needed plugins)
- Keep bundle size minimal
- Use Vite's code splitting

### Contact Form

The contact form is fully integrated with **Web3Forms** for email delivery:

1. Form submissions handled via `src/api.ts`
2. Uses Web3Forms API with access token from environment variable
3. Access token configured via `VITE_WEB3FORMS_ACCESS_TOKEN` in `.env`
4. Includes form validation, loading states, and success/error messaging
5. Automatic form reset on successful submission

### Browser Support

Target modern browsers with ES6+ support:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## AI Assistant Guidelines

When working on this project:

1. **Respect the monochrome theme** - Never suggest adding colors
2. **Use Tailwind utilities** - Avoid custom CSS unless absolutely necessary
3. **Keep animations smooth** - Test scroll performance with GSAP changes
4. **Maintain Vue 3 patterns** - Use Composition API and `<script setup>`
5. **Update data files** - Don't hardcode content in components
6. **Check responsiveness** - Always consider mobile, tablet, and desktop views
7. **Preserve TypeScript** - Keep type checking working with `npm run type-check`
8. **Follow component structure** - Sections vs UI components vs Layout

## Contact

**Developer**: Lai Kah Keen
**Email**: laikahkeen@gmail.com
**Repository**: https://github.com/laikahkeen/laikahkeen

---

Last updated: 2025-12-25
