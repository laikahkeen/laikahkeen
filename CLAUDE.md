<!-- GLOBAL:START - managed by sync.sh, don't edit between markers -->
# Global Rules

## Verification

After making code changes, always run the build, lint, and tests before reporting completion. Fix any failures before presenting results.

## Bug Fixing

When fixing bugs, trace the full code path from entry point to the bug location before proposing a fix. Do not apply band-aid fixes — find and fix the root cause.

## Code Style

When implementing changes, prefer the existing codebase patterns over introducing new abstractions. Check how similar things are already done before proposing a new approach.

## Important Rules

Never fabricate or hallucinate UI features, CLI flags, or API capabilities. If unsure whether something exists, say so explicitly rather than guessing.

## Task Routing

When facing multiple independent tasks, use parallel subagents. When tasks have dependencies, process sequentially.

### Use Parallel Subagents When:
- Implementing changes across independent packages or files
- Running tests in one area while implementing in another
- Any combination of research + implementation + testing where targets don't overlap

### Use Sequential Processing When:
- Task B depends on Task A's output (e.g., implement API then write tests against it)
- Changes to shared types that cascade across packages
- Database migrations that must happen before code changes

### Subagent Scoping:
- Each subagent should have a clear, scoped task within a single package boundary
- Pass specific file paths and context to subagents, not vague descriptions
- After parallel subagents complete, verify combined changes compile and pass tests
<!-- GLOBAL:END -->

# CLAUDE.MD

This file provides context for Claude Code and other AI assistants working on this portfolio website project.

## Project Overview

A modern, single-page developer portfolio for Lai Kah Keen built with Vue 3, Tailwind CSS, and GSAP animations. The project features a strict black and white monochrome theme with advanced scroll animations and smooth interactions.

**Live Site**: https://laikahkeen.com

## What this site is for

**The site is the depth layer behind the CV.** The CV is one page and makes a single
sharp claim; the site is where the evidence for that claim lives and can breathe. That
division is deliberate and load-bearing — it is *why* the CV is allowed to stay short.
See `cv/README.md`.

- **Audience:** someone who has just read the CV, or found the site by search, and is
  deciding whether this person is worth a conversation. Assume they arrived with a
  specific question, not to browse.
- **Job:** substantiate. Projects, journey, and experience detail exist so a claim the
  CV asserts in six words can be checked here at length.
- **Never duplicate the CV, and never contradict it.** If the two disagree about a date,
  a title, or what the work was, that is a defect — fix it, do not pick a side silently.

### The claim both surfaces serve

> Builds the AI agent tooling other engineers adopt, and ships the product frontend on
> top of it.

**Known gap (2026-08): the site does not yet lead with this.** `index.html`'s title and
meta description say "Full Stack Developer" / "specializing in modern web technologies";
the hero says "Full-stack product engineer"; `AboutSection.vue` says "full stack
developer". None of the first-read surfaces mention AI, MCP, or agent tooling, so a
visitor arriving from the CV lands on a generic portfolio and the differentiator
disappears. The *evidence* is present (`src/data/projects.ts` mentions MCP and LLM work)
— it is the framing that has not caught up. Also `keen-ops` is a headline CV item and is
absent from `src/data/projects.ts` entirely.

Closing that gap means rewriting positioning copy, which is the owner's decision, not a
tidy-up. Raise it; do not quietly reword the hero.

### Voice — the two surfaces differ on purpose

- **The site is first person** ("I turn messy product ideas into…"). Keep it that way.
- **The CV uses no first-person pronouns at all.** Also deliberate.
- Do not "fix" either one to match the other; they are addressing different readers.
- Tone on both: understated, evidence over adjectives. No hype, no "passionate about",
  no invented metrics.

### What to keep as-is

These are settled and should survive any refactor. Changing one is a decision to raise,
not a judgement call to make mid-task:

- **Strict monochrome.** Black, white, grays. No accent colour, ever.
- **Single page, scroll-driven.** Not a multi-route site.
- **Vue 3 Composition API with `<script setup>`**, Tailwind-first, GSAP + Lenis for motion.
- **Content lives in `src/data/`**, never hardcoded in components.
- **Minimal dependencies.** The bundle is small on purpose; adding a library needs a reason.

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
├── cv/                  # CV source — see "The CV" below. NOT part of the Vite build
│   ├── cv.yaml          # the only file with CV content in it
│   ├── README.md        # constraints, positioning, and why-nots — READ BEFORE EDITING
│   ├── research.md      # primary sources behind the constraints
│   ├── build/           # generated resume.html + resume.pdf
│   └── archive/         # retired sources and previous live CVs
├── scripts/
│   ├── build-cv.sh      # cv.yaml -> html -> pdf, then verifies the output
│   └── cv-render.py     # CV presentation + content validation
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
**Update CV**: Edit `cv/cv.yaml`, run `./scripts/build-cv.sh`, then promote deliberately (see "The CV")
**Change Colors**: Modify `tailwind.config.js` (stick to monochrome)
**Add Meta Tags**: Update `index.html`
**Modify Navigation**: Edit `src/components/layout/Navigation.vue`

## The CV

`cv/` builds the downloadable CV. It is **not** part of the Vite build — `vite.config.js`
uses the root `index.html` as its only entry, so nothing in `cv/` is bundled or deployed.

```bash
./scripts/build-cv.sh          # cv/cv.yaml -> cv/build/resume.html -> cv/build/resume.pdf
```

**Read `cv/README.md` before touching any of this.** Its constraints are evidence from
primary sources (cited in `cv/research.md`), not house style, and it records decisions
that look like defects from the outside. The four that get "fixed" by mistake:

- **Edit `cv/cv.yaml` only.** The HTML and PDF in `cv/build/` are generated. There is no
  hand-written HTML source any more; the retired one is in `cv/archive/`.
- **Single column, body ≥10pt, margins ≥0.5in.** Greenhouse documents columned layouts as
  a parse-failure cause; the type and margin floors are CMU SCS. One page is the budget —
  when it overflows, **cut content, never shrink type or margins**.
- **`design.hyphenate` stays `false`.** Chrome's auto-hyphenation breaks words in the PDF
  *text layer* using U+2010, so `migration` extracts as `mi‐gration` and a keyword search
  misses it. Invisible in the rendered page.
- **`design.font` must stay a `*-local` option.** A webfont embeds as Type 3; and never
  lead a font stack with `-apple-system`, which embeds as Type 3 *and* inflates the file.

`build-cv.sh` verifies page count, font embedding, and broken words on every run, and
`cv-render.py` validates the content rules (two-line bullets, action-verb openings, no
year counts). Warnings go to stderr — read them.

### Promoting to the live site

The build deliberately does **not** write `public/resume.pdf`, which is the CV served from
laikahkeen.com. Promotion is a separate, manual decision:

```bash
cp cv/build/resume.pdf public/resume.pdf
```

### Positioning

CV content is shaped to one claim: **builds the AI agent tooling other engineers adopt,
and ships the product frontend on top of it.** The role line, the profile's first
sentence, the current role's first bullet, and the first Skills row all lead with AI
tooling on purpose. Do not flatten this back into a generic "software engineer building
SaaS applications" summary. The full rationale, and what is deliberately kept off the CV,
is in `cv/README.md` — changing positioning is a decision to raise with the owner, not an
edit to make.

Two standing content rules: **no year counts anywhere**, and **no unverifiable numbers** —
a figure that cannot be defended in an interview is worse than no figure.

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
9. **For the CV, read `cv/README.md` first** - Edit `cv/cv.yaml`, never the generated
   HTML or PDF, and treat its constraints as evidence rather than preference
10. **Know what the site is for** - It is the depth layer behind the CV (see "What this
    site is for"). Keep the two consistent, and treat positioning copy as the owner's
    decision rather than something to reword in passing

## Contact

**Developer**: Lai Kah Keen
**Email**: laikahkeen@gmail.com
**Repository**: https://github.com/laikahkeen/laikahkeen

---

Last updated: 2026-08-09
