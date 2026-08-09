# CV

Source for the CV. See `research.md` for the primary sources behind the
constraints below — most of them are evidence, not taste.

## Editing

Edit **`cv.yaml`**. That is the only file with content in it.

```bash
./scripts/build-cv.sh          # cv.yaml -> cv/build/resume.html -> cv/build/resume.pdf
```

`scripts/cv-render.py` turns the YAML into HTML and holds all the presentation.
`cv/build/` is generated output — never edit the HTML or the PDF by hand.

The build **validates the content rules below on every run** and prints
violations to stderr: bullets over two lines, bullets not opening with an action
verb, year counts, a phone number not in international form. It then verifies the
PDF: page count, font embedding, and that no word was broken across a line in the
text layer.

It sits **outside** the Vite build: `vite.config.ts` uses the default root
`index.html` as its only entry, so `cv/` is never bundled or deployed.

## Promoting to the live site

`build-cv.sh` **does not write to `public/resume.pdf`.** That is the live CV
served from laikahkeen.com. Promoting a new build is deliberate:

```bash
cp cv/build/resume.pdf public/resume.pdf
```

The previous live CV is preserved at `cv/archive/resume-2025-12-original.pdf`,
and the retired hand-written HTML source at `cv/archive/index-2026-08-retired.html`.

### Manual fallback

If Chrome cannot be found, open `cv/build/resume.html` and print (Cmd+P):
Save as PDF, A4, margins **None** (the `@page` rule supplies its own),
**background graphics on**.

## Hard constraints — do not "fix" these

These come from primary sources, cited in `research.md`:

- **Single column.** Greenhouse documents "resumes with a columned layout" as a
  cause of failed resume parsing. A sidebar also interleaves the text layer, so
  extraction no longer follows reading order. Do not reintroduce one.
- **Body font >= 10pt** and **margins >= 0.5in (12.7mm)** per CMU SCS. An
  earlier draft hit one page by dropping to 8.7pt and 11mm. That was the wrong
  trade — pay for the page with content, never with legibility.
- **No tables, text boxes, graphics, or header/footer contact details.** All are
  on Greenhouse's parse-failure list. Contact info lives in the body.
- **Bullets: two lines maximum**, opening with a verb, following
  Action Verb + Context + Result (CMU SCS).
- **No first-person pronouns.**
- **`design.hyphenate` stays `false`.** See "Hyphenation" below.

## Page budget

**One page, deliberately** — the CV stays sharp; the site carries depth.

It fits with almost no slack. Adding more than a line or two pushes it to two.
When that happens, cut content — do not reach for font size or margins.
`build-cv.sh` reports the page count on every build.

## Hyphenation — the one trap that bites silently

**Never set `design.hyphenate: true`.** Chrome's automatic hyphenation breaks
words in the **text layer** using U+2010, not a soft hyphen. Verified: `products`
extracted as `prod‐ucts`, `migration` as `mi‐gration`. A keyword search for the
whole word then fails — precisely the parse degradation `research.md` exists to
prevent, and it is invisible in the rendered PDF.

Justified text without hyphenation has slightly looser word spacing. That is the
cheaper price. `build-cv.sh` counts broken words on every build and will tell you.

## Fonts

`design.font` takes `serif-local` (current), `sans-local`, or `inter-webfont`.

The `-local` options use an installed font, which Chrome embeds as **CID
TrueType**. This was previously a documented defect: the Inter *webfont* embedded
as **Type 3** regardless of `--headless` vs `--headless=new`. Using a locally
installed font fixed it, and also halved the file size (232K → 124K) and removed
the render-time dependency on `fonts.googleapis.com`.

Two verified gotchas:

- **Do not lead a font stack with `-apple-system` / `BlinkMacSystemFont`.** SF Pro
  embeds as Type 3 *and* produced a **larger** file (252K) than the webfont it
  replaced. Named font files embed correctly; the macOS system UI font does not.
  Probed CID-clean: Charter, Helvetica Neue, Arial, Verdana, Tahoma, Optima.
- `inter-webfont` reproduces the pre-2026-08 CV exactly when paired with
  `justify: false` and `center_header: false`. It is kept only for that.

## Why not rendercv

`rendercv` was evaluated as an alternative renderer in Aug 2026 and rejected.
It reads YAML, validates a schema, embeds fonts correctly, and needs no Chrome —
all genuine advantages. It was still the wrong trade:

- **Both themes tried overflowed to two pages.** Paying content to change
  renderer inverts the priority this document sets.
- **`classic` interleaves its date column into the bullet text** on extraction —
  the exact failure mode `research.md` identifies as highest-impact.
- **`classic` auto-injects computed durations** (`1 year`), which the positioning
  rules below exclude. Not a setting; it is the theme's behaviour.
- **No nesting.** The `Contract Engineer` entry holds two independently-dated
  sub-clients; rendercv flattens them into three sibling jobs reading as separate
  employers.
- **Education always gets its own section**, undoing the fold that holds one page.
- **It drops the phone country code.** Given valid E.164 `+60162159518` it
  displays `016-215 9518`.

Its portable merits — CID fonts, small files, justified text, a centred header,
and content validation — were all adopted into this pipeline instead. Its one
non-portable merit was extra whitespace, which is what bought it the second page.

## Positioning — agreed, not incidental

The content is shaped to a specific claim. Changing it should be a decision.

**The claim (set 2026-08):**

> Builds the AI agent tooling other engineers adopt, and ships the product
> frontend on top of it.

Most candidates are one or the other — frontend engineers do not write the Go
MCP server, and AI/backend people do not ship the Vue SaaS UI. The combination is
the differentiator, and the *adoption* is the proof: social proof from other
engineers rather than a self-assessment. Everything below serves that claim.

- **The role line, the profile's first sentence, the first bullet of the current
  role, and the first Skills row all lead with AI tooling.** That alignment is
  deliberate; an earlier draft opened "software engineer building SaaS
  application software", which was true of a hundred thousand people.
- **"MCP" stays out of the role line** and appears only in the body. A
  non-specialist recruiter may not parse the acronym, and the headline is the
  wrong place to lose them.
- **Frontend is range and delivery. Backend is support, not depth.** Backend
  appears where it carries billing and the APIs. The commit history would support
  a heavier backend claim; it was deliberately not made.
- **Billing is kept prominent.** Owning money — subscriptions, a live currency
  migration, Stripe — is a trust signal most engineers cannot offer.
- **No year counts anywhere.** No "4+ years". Dates live in entries and the
  reader can do the arithmetic. Years are a poor proxy here — much of the work
  was part-time and concurrent (three contracts at once through 2024–25).
- **Paid work goes in Experience. Unpaid own products go in Projects.**
- **Collaboration is shown with evidence, never adjectives.** Only two claims are
  made, both verifiable: the engineering team adopting the MCP server, and
  client-facing requirements work. No "team player", no mentoring claim.

## Deliberately kept off

- **Boostomatic's own client roster** (Tinybot, ACA Acupuncture, Black Voyage and
  others) and staff Slack/Notion IDs, all present in `boostomatic/config/`. That
  is the client's confidential data and this PDF is publicly downloadable.
  "8 client accounts across 14 Slack channels" carries the scale without it.
- **A named referee.** The previous CV printed a former colleague's personal
  email and phone number on a public download.
- **Non-engineering history.** The assistant-architect role (2020–21) is cut; the
  architecture degree in Education covers the timeline.
- **FAR Capital's numbers** — "100+ business automations", "RM1M annually",
  "100K+ records". Removed 2026-08: the owner could not stand behind the figures,
  and a number you cannot defend in the room is worse than no number. They were
  deleted rather than softened, and the entry demoted to a bullet-less line. It
  stays in Experience because it was employment, and it carries the 2021–2024
  timeline and the promotion.
- **The i18n work** — cheap work by the author's own assessment, and it was
  costing three lines.
- **Hourly rates**, which appear in the journal but never belong on a CV.

## Known cosmetic quirk

Right-aligned dates extract after the location line rather than beside the title.
Tried fixing via flex alignment; it changed nothing. Harmless — the date stays
inside its entry block, so this is a text-layer ordering nit, not a parse failure.
