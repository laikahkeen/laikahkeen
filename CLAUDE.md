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

**A revamp is decided but unbuilt — see `PLAN.md` and "Reversed 2026-09-25" below.**
Four things this file previously called settled have been overturned. The description
above still describes the *live* site; do not read it as the target.

## What this site is for

**The site is the primary artifact; the CV is an export of it** for when a process
demands a PDF. This reversed on 2026-09-25 — it used to be the other way round. The CV's
own constraints in `cv/README.md` are unchanged: they are evidence from primary sources,
not a consequence of which artifact leads.

- **Audience:** peer engineers and engineering leaders, arriving from a shared link or a
  search — not from the CV. Assume they arrived with a specific question, not to browse.
  **Optimising for a hiring manager is what produces the generic version of this site**,
  so that reader is deliberately not the target.
- **Job:** substantiate, and be linkable. Depth lives at its own URL so a peer can share
  one case study rather than a scroll anchor.
- **Never duplicate the CV, and never contradict it.** If the two disagree about a date,
  a title, or what the work was, that is a defect — fix it, do not pick a side silently.

### The claim both surfaces serve

> Builds the AI agent tooling other engineers adopt, and ships the product frontend on
> top of it.

**Aligned as of 2026-08.** Every first-read surface now leads with the claim: the
`index.html` title, description and keywords, the OG and Twitter cards, the hero eyebrow,
tagline and description, the hero metric tiles, and `AboutSection.vue`'s opening
paragraph. `keen-ops` is in `src/data/projects.ts` alongside propbook.

**One surface lagged until 2026-09-19: `public/og-image.png`.** The meta tags were
repositioned in Aug 2026; the image they point at still read "Full Stack Developer" for
another month, because it is a picture and nothing greps it. It now has a source
(`scripts/og-template.html`) and a build (`scripts/build-og.sh`) so it changes with
everything else. A repositioning that skips it ships the old claim to every Slack, Twitter
and LinkedIn preview.

Before this, all of them said "full stack developer" and none mentioned AI, MCP or agent
tooling — so a visitor arriving from the CV landed on a generic portfolio and the
differentiator vanished. If you find yourself reintroducing generic "full-stack
developer" framing on any of those surfaces, that is the regression.

**Positioning copy is the owner's decision, not a tidy-up.** Raise a change; do not
quietly reword the hero, and keep any edit consistent across all of the surfaces above —
they drifted apart once already.

### Voice — the two surfaces differ on purpose

- **The site is first person** ("I turn messy product ideas into…"). Keep it that way.
- **The CV uses no first-person pronouns at all.** Also deliberate.
- Do not "fix" either one to match the other; they are addressing different readers.
- Tone on both: understated, evidence over adjectives. No hype, no "passionate about",
  no invented metrics.

### What to keep as-is

These are settled and should survive any refactor. Changing one is a decision to raise,
not a judgement call to make mid-task:

- ~~**Strict monochrome.** No accent colour, ever.~~ **Reversed 2026-09-25** — see below.
- ~~**Single page, scroll-driven.** Not a multi-route site.~~ **Reversed 2026-09-25** — see below.
- **Vue 3 Composition API with `<script setup>`**, Tailwind-first, GSAP + Lenis for motion.
- **Content lives in `src/data/`**, never hardcoded in components.
- **Minimal dependencies.** The bundle is small on purpose; adding a library needs a reason.

### Reversed 2026-09-25 — decided by the owner, not yet built

Four entries above were overturned in one session. They are recorded here so the next
session reads them as decisions rather than drift, and does not "fix" the site back.
Full reasoning, ordering and the six-week v1 scope are in `PLAN.md`.

1. **Monochrome → dark-only, one accent.** Gold `#C4922A`, taken from propbook, where it
   is already the interactive token. It measures 7.5:1 on black and **2.8:1 on white** —
   which fails WCAG AA for text and the 3:1 floor for UI. That contrast number is why the
   theme is dark-only rather than dark-by-default: there is no light theme in which this
   accent is legal.
   **The accent means one thing: a live system.** Black, white and grey are static
   content. Gold marks the MCP surface and nothing else. "Gold = clickable" is the
   failure mode.
2. **Single page → `vue-router`.** Home stays a single scroll page; depth moves to
   `/work/<slug>`, and later `/writing/<slug>`. The constraint was written when the site
   was a brochure and stopped paying for itself the moment the goal became linkable depth.
3. **Audience → peers and eng leaders.** See "What this site is for" above.
4. **CV-primacy → site-primacy.** Also above. `cv/README.md` is untouched by this.

Two further decisions from the same session, not reversals:

- **Motion: less, not different.** The uniform fade-up-on-scroll is what dates the site.
  Strip most scroll animation, keep Lenis, let type and layout carry it. Break the seven
  equal full-width sections into varied shapes with real density differences.
- **A public MCP server is the centrepiece**, in its own repo: TypeScript SDK on the
  edge, importing `src/data/*.ts` directly so the server and the site cannot disagree.
  Three tools, no credential, per-IP rate limited. No inference anywhere in v1.

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite 8.x (bundles with **Rolldown**, not Rollup — see Deployment)
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
├── mcp/                 # Public MCP server. Own package.json, NOT part of the
│                        # Vite build. Reads ../src/data directly — see below
├── scripts/
│   ├── build-cv.sh      # cv.yaml -> html -> pdf, then verifies the output
│   ├── cv-render.py     # CV presentation + content validation
│   ├── build-og.sh      # og-template.html -> public/og-image.png, verified at 1200x630
│   └── og-template.html # source for the social card — subtitle tracks cv.yaml basics.role
├── public/              # Static assets (images, resume.pdf, generated og-image.png).
│                        # No CNAME — see "Deployment"
├── src/
│   ├── assets/          # Styles (main.css with Tailwind directives)
│   ├── components/
│   │   ├── layout/      # Navigation.vue, Footer.vue
│   │   ├── sections/    # HeroSection, AboutSection, etc.
│   │   └── ui/          # Reusable components (Button, ProjectCard, etc.)
│   ├── composables/     # Vue composables for scroll animations
│   ├── data/            # Content data (projects, skills, journey, experience)
│   ├── router/          # Route table. Home is '/', depth is '/work/<slug>'
│   ├── views/           # HomeView (the scroll page), WorkView (a case study)
│   ├── App.vue          # Shell: Navigation + RouterView + Footer + Lenis
│   ├── main.ts          # ViteSSG entry — NOT createApp().mount()
│   └── api/index.ts     # API integration (Web3Forms)
├── index.html           # HTML entry with meta tags and SEO
├── package.json
├── tailwind.config.ts   # Tailwind configuration
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
- **Theme**: black, white, gray scale, plus **one accent** — see below
- Palette defined in `tailwind.config.ts`, under `theme.colors` — which **replaces**
  Tailwind's palette rather than extending it. That is deliberate: a colour that is not
  listed there simply does not exist as a utility class, so the constraint is structural
  rather than a convention anyone has to remember.
- The config is **TypeScript** (`satisfies Config`) so `src/theme.test.ts` can import the
  real token values instead of duplicating them. Converting it from `.js` was verified
  byte-identical on the emitted CSS.

#### The accent

`accent` (`#C4922A`, hover `#D4A84A`) is the only non-neutral in the palette, taken from
propbook where it is already the interactive token.

**It carries a rule: the accent means "this is a live system."** In v1 that is the MCP
surface and nothing else — the endpoint block, connection state, the tool list the page
fetches. Static content stays neutral. "Accent = clickable" is the failure mode, and it
is how this degrades into decoration.

The rule is documented here and **not enforced by anything** — that is a known gap. What
*is* enforced, by `src/theme.test.ts`: the accent clears WCAG AA on black (7.5:1), its
hover variant does too, the palette has exactly one non-neutral, and it **fails** AA on
white (2.8:1). That last assertion is why the theme is dark-only; if it ever passes, the
dark-only decision rested on a premise that no longer holds and should be reopened rather
than quietly kept.
- Responsive: Mobile-first approach using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Custom animations defined in `tailwind.config.ts` under `extend.animation`

### Animations

- **GSAP**: Used for complex scroll-triggered animations
- **ScrollTrigger**: Attached to section components via composables
- **Lenis**: Smooth scroll initialized in `App.vue` (**not** `main.ts`), driven from
  `gsap.ticker` rather than its own rAF loop, with `lenis.on('scroll', ScrollTrigger.update)`
  so reveal animations stay in step with the smoothed scroll position

### If the site "feels slow"

Check `lerp` in `App.vue` **before** touching any animation. It is almost always this.

`duration: 1.2` used to be set there, which meant a single wheel tick took ~1090ms to come
to rest. That reads as sluggishness but is not a performance problem — the page holds
~110fps with one long frame across a full-page scroll, and a trace shows CLS 0.00 and no
long-task insights. Current setting is `lerp: 0.2`, measured at 194ms to cover 90% of a
scroll distance (down from 385ms at `lerp: 0.1`).

Useful distinction when measuring: time-to-*settle* is misleading, because smoothing has a
long asymptotic tail nobody perceives. Measure **time to ~90% of the distance**.

Two related rules:
- **Never reintroduce `duration`.** It is frame-rate dependent and mutually exclusive with
  `lerp`. Also note `smoothTouch` is not a real Lenis option — it was set here for a while
  behind an `as any` cast, doing nothing.
- **Mouse parallax uses `gsap.quickTo`**, not `gsap.to` per mousemove. The latter allocated
  a fresh tween per event per element — hundreds a second across the hero's three shapes.
  It also opts out entirely under `prefers-reduced-motion` and on devices without a fine
  pointer.
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

# Tests (Vitest + @vue/test-utils + jsdom)
npm test          # watch
npm run test:run  # once, for CI

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

Vitest, configured in the `test` block of `vite.config.ts` (which imports
`defineConfig` from `vitest/config`, not `vite`). Tests live beside what they test as
`*.test.ts`. `globals: false` — import `describe`/`it`/`expect` from `vitest` explicitly.

**`src/test/setup.ts` is load-bearing, not boilerplate.** jsdom has no `matchMedia`, and
GSAP's `registerPlugin(ScrollTrigger)` calls it at *module scope* in `useParallax.ts`.
Since the router imports `HomeView` eagerly, any test that touches the router pulls in
every section component — so without the shim the whole suite fails at collection, not at
assertion. Its `matches: false` also means the reduced-motion and fine-pointer guards both
read false under jsdom: **component tests here cannot assert animation behaviour**, only
structure and content.

What the existing suite is for: it pins decisions that were previously only recorded in
comments — unique URL-safe slugs (a duplicate silently shadows a prerendered page), the
narrative fields this file requires, and ideahook's dead `liveUrl` staying absent. Both
were verified by mutation: breaking each one does fail the suite.

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
**Update the social card**: Edit `scripts/og-template.html`, run `./scripts/build-og.sh` (writes `public/og-image.png` directly)
**Change Colors**: Modify `tailwind.config.ts` (stick to monochrome)
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

## The MCP server

`mcp/` is the public, unauthenticated MCP endpoint — the centrepiece of the revamp
(`PLAN.md`). It is a separate npm package in this repo, with its own `package.json`,
`tsconfig.json` and `vitest.config.ts`. Nothing in `mcp/` is bundled by the site build.

**Why it lives here rather than in its own repo.** It imports `../src/data/projects.ts`
and `../src/data/experience.ts` directly, so the server and the site cannot report
different work. A separate repo would need an export step, and that sync seam is the
exact class of bug this repo has already been bitten by. If you move it out, you own
that seam.

```bash
cd mcp && npm install
npm run type-check
npm run test:run        # or, from the repo root: npm run test:mcp
```

- **Transport**: `WebStandardStreamableHTTPServerTransport` — a plain
  `Request -> Response` handler, so it runs on Workers, Vercel Edge, Deno or Node with
  no adapter. Stateless (`sessionIdGenerator: undefined`), `enableJsonResponse: true`.
- **Three tools, and it stays three**: `list_projects`, `get_project`, `get_experience`.
  A test asserts exactly that set — a fourth tool should have to delete an assertion.
  The descriptions are the interface: an agent decides whether to call a tool from the
  description alone.
- **`mcp/vitest.config.ts` must exist.** Without it Vitest walks up, finds the site's
  `vite.config.ts`, and inherits its jsdom environment and `setupFiles` path resolved
  against `mcp/` — which fails at load, not at assertion.
- **Two layers of test, and the distinction matters.** `index.test.ts` drives the handler
  with hand-written JSON-RPC — it proves the handler behaves. `realclient.test.ts` runs the
  handler behind a real `node:http` server and drives it with the **SDK's own client** over
  real HTTP — it proves a client can hold a session, which is the actual product claim
  ("paste this URL into your client"). Passing the first does not imply the second; keep
  both. The bridge in that file may buffer responses only because the transport is
  configured for JSON, not SSE.
- **Schema violations come back as `isError` tool results, not thrown errors.** The SDK
  validates against the zod schema and hands the model something it can read and retry
  from. A client treating that as fatal would be wrong; pinned by a test.
- **Rate limiting is the risk surface**, because there is no credential. keen-ops has no
  rate limiting to copy, so `src/ratelimit.ts` is written from scratch. Read its
  `KNOWN LIMIT` note before trusting it: bounded memory and exact accounting cannot both
  hold, so an IP spray can evict a victim's counter and forgive its usage. Edge rate
  limiting in front of the process is the real defence; this is the second layer.

## Deployment

The site is deployed on GitHub Pages with a custom domain (laikahkeen.com), by
`.github/workflows/deploy.yml` on every push to `master`.

- **Build command**: `npm run build` → `vue-tsc && vite-ssg build`. A type error fails
  the deploy. `vite-ssg` prerenders every route, so `dist/` holds `index.html` **plus**
  `work/<slug>/index.html` per project — not a single SPA shell.
- **Why prerendered**: Pages has no SPA fallback, so a direct hit on `/work/keen-ops`
  would return GitHub's 404. `ssgOptions.dirStyle: "nested"` emits directory indexes
  rather than `<slug>.html`, so a shared link resolves without relying on the host
  mapping extensionless URLs to `.html`. Route list comes from `src/data/projects.ts`
  via `ssgOptions.includedRoutes`, so adding a project adds its page automatically.
- **`manualChunks` has two constraints, both learned by breaking them.** It must stay off
  the SSR pass (there `gsap` and `vue` resolve as external, and naming an external is a
  hard bundler error — hence the `isSsrBuild` branch), and it must be a **function, not an
  object map**. Vite 8 bundles with Rolldown, which rejects `{name: [modules]}` outright
  with "manualChunks is not a function". The object form worked through Vite 5, so this is
  the shape to expect in older examples.
- **Vite 8's config loader is native and does not resolve extensionless paths.** Hence
  `./src/data/projects.ts` with the extension in `vite.config.ts`, and `../types/index.ts`
  rather than `../types` in `src/data/*.ts`. There is an env var to silence the warning;
  don't — it hides a real resolution difference.

#### Home-page weight, as dated readings

Kept as rows rather than overwritten, because the drift is the useful part. Re-measure
with `npm run build`; a mismatch means time or a dependency moved, not that something
broke.

| Date | Home first load (gz) | What changed |
|---|---|---|
| 2026-09-25 | 113.9 KB | before routing |
| 2026-09-25 | 130.9 KB | `vue-router` + prerendering added |
| 2026-09-25 | ~123.9 KB | Vite 5 → 8. Smaller despite no code change: better minification, and the chunk split shifted — ScrollTrigger now lands in the `gsap` chunk rather than `app` |
- **Output directory**: `dist/`
- **Install in CI**: `npm ci`, not `npm install` — a lockfile exists and CI must honour it
- **Custom domain**: held in the repo's **Pages settings**, not in the tree. There is
  **no `public/CNAME`**; the workflow writes `dist/CNAME` at build time. If you go looking
  for `public/CNAME` because this file used to claim it existed, that is why.
- **Publish mechanism**: GitHub's own `actions/upload-pages-artifact` + `actions/deploy-pages`,
  with Pages source set to *GitHub Actions*. It was the third-party `peaceiris/actions-gh-pages`
  pushing a `gh-pages` branch until 2026-08. That branch is now **stale** — do not read it as
  the live site, and do not restore branch-based publishing without also flipping the Pages
  source setting back.

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

Last updated: 2026-09-19
