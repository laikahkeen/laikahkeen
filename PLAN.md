# Site revamp — plan of record

Settled 2026-09-25 in a grilling session. Everything in "Decisions" was decided by the
owner; everything marked *(recommendation)* is mine and can be overruled at build time
without reopening anything above it.

The plan is **ordered, not calendared**. Week 1..6 are relative to whenever work starts.
Budget assumed: ~8-10 hrs/week, six weeks to v1.

---

## Why this exists

The site is a static brochure representing someone whose claim is that he builds live
agent systems. The medium contradicts the message. Secondary: four projects on the site
against ten-plus real builds in the workspace — that is a *writing* backlog, not a
building backlog.

Audience is **peer engineers and engineering leaders**. Optimising for a hiring manager
is what produces the generic version.

---

## Decisions (owner's, not derived)

These four reverse things `CLAUDE.md` currently lists as settled. Recording them is step
one of v1, so the next session reads them as decisions rather than drift.

| # | Was | Now | Where it bites |
|---|---|---|---|
| 1 | "Strict monochrome. No accent colour, ever." (`CLAUDE.md:104`) | Dark-only theme, one accent: gold `#C4922A`, taken from propbook | Whole design system |
| 2 | "Single page, scroll-driven. Not a multi-route site." (`CLAUDE.md:105`) | `vue-router`; home stays a scroll page, `/work/<slug>` and later `/writing/<slug>` | Unblocks issues #1, #2, #12, #14 |
| 3 | Audience is "someone who has just read the CV" (`CLAUDE.md:52-61`) | Peers and eng leaders; hiring-manager framing explicitly demoted | Positioning copy, hero |
| 4 | Site is "the depth layer behind the CV" | **Site is primary**; the CV becomes an export for when a process demands a PDF | `cv/README.md` constraints unchanged — they are evidence-based and stay |

Also settled:

- **Accent rule.** Black/white/grey = static content. Gold = *live system*. In v1 the only
  live thing is the MCP surface, so that is the only place gold appears.
- **Motion.** Strip most scroll animation. Keep Lenis. Type and layout carry it. The
  uniform fade-up is the thing that dates the site; the fix is less motion, not different.
- **Layout.** Break the seven-equal-full-width-sections rhythm — varied section shapes
  with real density differences.
- **MCP server is fully public**, no credential. Per-IP rate limiting, written from
  scratch.
- **MCP tool surface is three tools** and stays three: `list_projects`, `get_project(id)`,
  `get_experience`. The tool descriptions are the craft, not the count.
- **Stack: TypeScript MCP SDK on the edge**, importing `src/data/*.ts` directly.
- **keen-ops aggregates are parked.** v1 exposes site content only.
- **No inference in v1.** No chat, no generative charts, no budget meter.
- **Case study #1 is keen-ops.**
- **Distribution is in scope**: MCP registry listing + one written post. Current traffic
  is near zero, so a beautiful site that nobody loads does not meet the stated goal.

---

## Status — 2026-09-25

| # | Item | State |
|---|---|---|
| 1 | Decision record in `CLAUDE.md` | **done** |
| 2 | Issue cull | **done** — 6 closed, rest annotated |
| 3 | `vue-router` + `/work/<slug>` | **done** — prerendered, not a stub |
| 4-6 | MCP server | **built; verified against the SDK's real client over HTTP** — needs deploy |
| 7 | keen-ops case study | **blocked** — see "Open decisions" |
| 8 | Dark theme + gold accent | **tokens only.** Components not flipped |
| 9 | Motion strip + layout | not started |
| 10 | Live MCP panel | not started — needs a deployed endpoint |
| 11 | JSON-LD / 404 | JSON-LD **done**; 404 not started |
| 12 | Distribution | not started — yours |

Added along the way, not in the original plan:

- **Vitest**, at the owner's request. 38 tests: 14 site, 24 mcp. There were none before.
- **Vite 5 → 8**, at the owner's request. Audit 7 → 3 at the root, `mcp/` clean at 0.
- **`tailwind.config.js` → `.ts`**, so `src/theme.test.ts` imports real token values
  rather than duplicating them. Verified byte-identical CSS output.

### Resolved 2026-09-25 — owner chose the honest version (issue #17)

Both claims are corrected on **both** surfaces, because a site/CV disagreement is itself a
defect:

- **Reversibility.** Now: "Reversibility holds for writes that go through the ops
  executor — one that bypassed it made the next undo reverse an older batch and lose
  data, which is why every path outside the executor now records an inverse of its own."
  The CV's "every write is reversible" became "writes carry their own inverse".
- **Cross-domain.** No query spanning two domains exists — the MCP server is named
  `keen-finance` and its tools are finance tools. The store makes such a question
  *possible*; nothing built on it asks one. `projects.ts` now says exactly that. The
  `problem` field still frames cross-domain as the motivation, which is true as
  motivation.
- **Tool count dropped from both surfaces.** It read "41". Counted inside `registry()`
  (`internal/mcp/registry.go:150-381`) there are **45** — 21 read, 24 write — and
  keen-ops' own comment says 38. Three numbers, two wrong. The CV's figures were honestly
  verified on 2026-08-09 and had simply drifted. Dated readings are kept in a `cv.yaml`
  comment; no count appears in either published surface. Same reasoning as the FAR Capital
  removal recorded in `cv/README.md:168-171`.

CV rebuilt and verified: 1 page, CID fonts, 0 broken words. **Not promoted** to
`public/resume.pdf` — that stays a deliberate manual step.

### Open — still blocking

1. **The deploy.** Blocks the live MCP panel (nothing to point it at) and all
   distribution. Infrastructure is owner-only by standing rule.
2. **Should tests gate `deploy.yml`?** They currently do not run in CI, so the suite
   protects nothing automatic.

---

## v1 — six weeks

Ordered by dependency, and by the fact that the MCP server is the only artifact that
*travels*.

**Week 1 — record and scaffold** — *done 2026-09-25*
1. Write the four reversals above into `CLAUDE.md`, with reasons.
2. Run the issue cull (below).
3. Add `vue-router`; home at `/`, stub `/work/<slug>`. Landed as prerendered routes
   rather than stubs — `dist/work/<slug>/index.html` per project, route list generated
   from `src/data/projects.ts`. Issue #2's narrowed half (card links to the case study)
   was pulled forward from v2, because routes nothing links to are not a working layer.

**Weeks 2-3 — the MCP server** — *built 2026-09-25, undeployed*

Correction to this plan as first written: it said "own repo", which contradicted the
same document's reason for choosing TypeScript — reading `src/data/*.ts` directly so the
server and site cannot disagree. A separate repo reintroduces that sync seam. It is
therefore `mcp/` inside this repo, as its own npm package. That also removes the
`gh repo create` blocker; only the deploy is still yours.
4. Three tools, schemas from the site's own TypeScript types.
5. Streamable HTTP, stateless, JSON responses — the transport keen-ops proved
   (`keen-ops/bot/main.go:172-181`). A panic guard is not optional: the Go SDK has no
   `recover()` and an unguarded panic looks identical to a hang from the client side
   (`keen-ops/bot/internal/web/mcp.go:79-136`). The TS SDK needs the same treatment.
6. Per-IP rate limiting. **This is the riskiest item in v1** — not because it is hard, but
   because it is the only piece with no prior art in your own code, and it guards a public
   endpoint. keen-ops has no rate limiting anywhere to copy. If the six weeks slip, this
   is the part that must not be rushed.
   *(recommendation)* Cloudflare Workers + Durable Objects or KV for the counters.

**Week 4 — the case study** — *blocked on open decision 1*
7. `/work/keen-ops`: the reversibility contract, the event model, the single-writer
   invariant, with a real architecture diagram. This is also the "demonstrate BE
   understanding with a diagram" item from GOALS.md — one artifact, both jobs.

**Weeks 5-6 — the redesign** — *tokens done, components untouched*

Revision to method: the component flip is the one item here that must not be done blind.
Every section hardcodes `bg-white`/`text-black`, and hover states and gradients are
grayscale-tuned, so a mechanical swap can pass a build and be broken on screen. Browser
automation is available, so it gets done against a running dev server with real
screenshots — not from the diff.
8. Dark-only theme, gold accent, tokens documented *after* the palette is chosen (not
   before — that ordering was inverted in the original notes). **Token layer landed**:
   `accent` in `tailwind.config.ts`, contrast pinned by `src/theme.test.ts`. The rule
   "accent means live system" is documented and enforced by nothing — a known gap.
9. Motion strip + layout variation. Issue #4 (native `scrollIntoView` fighting Lenis) gets
   churned by this work — fix it here, not before.
10. The live MCP panel: the page pings your own MCP server and renders its tool list, in
    gold. This is what makes the endpoint visible to a visitor who would otherwise never
    know it exists.
11. JSON-LD (#8), static `404.html` (#15).
12. Distribution: list the endpoint, write the post.

Honest read on the budget: 48-60 hours for all twelve items is tight. If something has to
go, drop 8-9 (the redesign) before dropping 4-6 or 7 — the MCP server and the case study
are what serve the goal; the redesign is what serves the diagnosis.

---

## v2 — not now, and why

Chat, generative charts, and the budget meter. All three were in scope until the numbers
came back:

- RM1/day (~USD 0.21, and the MYR/USD rate drifts, so the dollar ceiling moves without
  anyone touching code) buys **~403 calls/day** on `gemini-2.5-flash-lite`, not the ~38 an
  earlier Anthropic-priced estimate suggested.
- At near-zero traffic a meter at that cap **never moves**, which makes it a prop. The
  case for a visible budget meter was built on scarcity that does not exist.

v2 decisions deliberately left open, because answering them now means answering them
stale:

- Model: `gemini-2.5-flash-lite` ($0.10/$0.40) over keen-ops' `gemini-2.5-flash`
  ($0.30/$2.50) — 3x cheaper in, 6x cheaper out. *(recommendation)*
- **Thinking budget must be capped.** keen-ops sets `ThinkingConfig{ThinkingBudget: -1}`
  (`keen-ops/bot/internal/ai/toolloop.go:79-85`) — unbounded. Gemini bills thinking tokens
  at the *output* rate, so that config on a public endpoint has no per-call ceiling. This
  is the one place where reusing keen-ops' patterns fights the budget.
- Free vs paid tier. The free tier states *"Content used to improve our products: Yes"*;
  paid states No. On an endpoint carrying visitor-typed text that is a disclosure
  decision, not a cost one.
- Whether RM1/day survives as a number at all.

Also v2: blog (`/writing/<slug>`, sourced from the keen journal — separate issue), RSS,
boostomatic as a project entry, card-links-to-case-study, a11y punch-list *after* the
redesign.

---

## Measurements, with their expiry

Every figure here is dated. A mismatch on re-reading means time passed, not that something
broke — re-take the reading before treating it as a discrepancy.

| Figure | Value | Source | Re-take by |
|---|---|---|---|
| Gemini pricing | `gemini-2.5-flash-lite` $0.10 / $0.40 per 1M | `ai.google.dev/gemini-api/docs/pricing`, page-stated **last updated 2026-09-22** | Re-fetch that page |
| `gemini-3.8/3.7/3.6-flash` | $0.75/$3.75 promo, **doubles 2027-01-01** | same page | Scheduled change, not a surprise |
| Cost per call @ 4k in / 300 out | $0.00052 flash-lite | arithmetic over the above | Recompute if prices move |
| Account blast radius | **$250/month** Tier 1 automatic ceiling; $10/10min rolling throttle | `ai.google.dev/gemini-api/docs/billing`, **last updated 2026-09-20** | Re-fetch |
| Gold on black | **7.5:1** (passes AA + AAA) | WCAG contrast, `#C4922A` on `#000000` | Stable unless the hex changes |
| Gold on white | **2.8:1** (fails AA 4.5:1 and the 3:1 UI floor) | same | This is why the theme is dark-only |
| Scroll perf | ~110fps, CLS 0.00, no long tasks | `CLAUDE.md:186-194`, trace predates this revamp | **Re-trace after the motion work** |

**Unverified, flagged rather than assumed:**

- Exact Gemini free-tier RPM/TPM/RPD. No longer published; lives behind a sign-in at
  `aistudio.google.com/rate-limit`. Do not plan around a number nobody can cite.
- Default and maximum explicit-cache TTL — absent from Google's caching docs.
- Implicit-caching minimum token count for any `*-flash-lite` model — absent from the docs
  table. (The published 4,096 floor for 3.x Flash means a ~4,000-token prompt would not
  implicitly cache on those models anyway.)
- Current Lighthouse scores. No baseline exists in this repo and none was run.

---

## Issue cull

Approved disposition. 6 closed, 4 in v1, 5 in v2, 1 parked.

**Close as done** — both shipped within a day of being filed, against a stale snapshot:
- #5 hero copy — `4a3d4a0`, `HeroSection.vue:21,35,41-45`
- #9 analytics — `2687b14`, `src/main.ts:5-21`, self-hosted Plausible

**Close as duplicate or obsolete:**
- #7 populate projects — subset of #16; projects.ts went 2 -> 4
- #11 Lighthouse — premise contradicted by `CLAUDE.md:186-194`; gsap chunk already split
  at `vite.config.ts:9-12`
- #6 'Currently Building' — premise now false; both active projects already render as live
- #12 /uses — buildable now that routes are in, but wrong audience under decision #3

**v1:** #3 (rescoped: this *is* the MCP server), #8 JSON-LD, #15 404, #4 scroll nav (folded
into the motion work)

**v2:** #1 blog (rescope — routing is unblocked), #14 RSS (after #1), #16 (narrowed to the
boostomatic entry), #2 (narrowed: card links to `/work/<slug>`; expand-in-place dies with
routes), #10 a11y (*after* the redesign, or it gets churned)

**Park:** #13 tag filtering — premature at 4 projects

Closing #5 does **not** mean the hero copy is settled. Decisions #3 and #4 both change what
the hero has to do. That is new work, not a reopened issue.

---

## Known defects, not being fixed here

Found while researching; none are portfolio work.

**This repo:**
- `src/composables/useScrollTo.ts` is dead code — nothing imports it, and it uses
  `window.scrollTo`, not Lenis. Delete it during the motion work.
- `App.vue:39` returns early under `prefers-reduced-motion`, so `lenis` is legitimately
  `null`. Any shared accessor needs a native fallback.
- `.no-scrollbar` in `src/assets/styles/main.css:15-22` is dead — defined in
  `@layer utilities`, used by no component, so Tailwind purges it. Pre-existing.
- `axios` (high) and `browserslist` (high) audit findings remain after the Vite upgrade;
  neither is fixable by it. `axios` is a runtime dependency, so that one actually ships.

**propbook:**
- `WallStrip.tsx:24` uses class `btn-cta`, defined nowhere.
- `layout.tsx:10` registers Geist as `--font-sans`, shadowing `globals.css:11`. DM Sans is
  loaded on every page and never used.
- `TimelineUI.tsx:33-38` hardcodes five chart hexes with a "keep in sync" comment and no
  enforcement. The comment is the bug.
- Email gold `#c8a256` (`lib/email.ts:32,88`) is not the brand gold `#C4922A`.
- Token collision: `--muted` (`:148`, a surface) vs `--color-muted` (`:25`, text grey).

**keen-ops:**
- No rate limiting anywhere. With the Railway public domain on, every route relies on its
  own bearer (`docs/mcp.md:34`) — so a leaked `DASHBOARD_TOKEN` or `CAPTURE_TOKEN` is
  unbounded, not merely unauthorized.
- `gemini-2.5-pro` sits in the pricing table (`internal/ai/telemetry.go:32`) but is never
  selected as a runtime model. Dead row.
