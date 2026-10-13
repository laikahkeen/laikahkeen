# Project Goals

## Vision

Personal brand site — show off what I do best, technically and creatively.

## Direction

Make this the single link I send people to understand what I do. Projects, writing, and
technical depth all in one place. The site itself should demonstrate the craft.

Audience is **peer engineers and engineering leaders**. Optimising for a hiring manager is
what produces the generic version.

## Current Priorities

The revamp is planned and ordered in **`PLAN.md`** — that is the working document. This
list is the summary.

**v1 — as of 2026-09-25:**

- [x] Record the reversed decisions in `CLAUDE.md`
- [x] Cull the issue tracker — 6 closed, the rest annotated with phase
- [x] `vue-router` + `/work/<slug>`, prerendered to real directory indexes
- [x] Public MCP server — three tools, per-IP rate limited. In `mcp/` in **this** repo,
      not its own, so it reads `src/data/` directly and cannot drift from the site
- [x] JSON-LD
- [x] keen-ops case study + backend diagram, at `/work/keen-ops`
- [~] Dark-only theme + gold accent — token layer done, components not yet flipped
- [ ] Motion stripped back, layout varied
- [ ] Live MCP panel — needs a deployed endpoint first
- [ ] Static 404
- [ ] Distribution: list the endpoint, write the post

Not in the original plan, added on request: **Vitest** (33 tests, from zero) and
**Vite 5 → 8** (audit 7 → 3 at the root; `mcp/` clean).

**Open decisions blocking work** — full detail in `PLAN.md`:

All three earlier blockers are resolved: the claims are softened on both surfaces
(issue #17), the cross-domain claim is dropped, and CI now gates on tests. What remains
is the deploy, and your eye on the layout.

**Shipped as PR #18** (`revamp/v1-foundation`) — build changes, not visual ones.

**Needs your hands, not mine:** deploying the MCP server, the registry listing and the
post, and your eye on the layout once it exists.

**v2:** blog (sourced from the keen journal), RSS, boostomatic as a project entry,
a11y punch-list, and the inference features — chat and generative charts.

## Out of Scope

- CMS or admin panel (edit in code)
- Multi-language support
- A chat box for its own sake. It proves only that an API can be called; the MCP server
  is the thing that demonstrates the claim, and it costs nothing per call because the
  visitor's own agent pays for inference.

## Notes

The freeform questions that used to sit at the bottom of this file — how to demonstrate
AI in the UI, plugging in the MCP server, generative charts, journey-based interaction,
a design system, and a backend diagram — were worked through on 2026-09-25 and are all
answered in `PLAN.md`. They are not open questions any more.

This file was originally written as guidance for a "dreaming" agent that filed issues
automatically. That agent is stopped, and nothing in this repo runs it. The 16 issues it
left are culled; treat anything it filed in future as a proposal to triage, never a
worklist.
