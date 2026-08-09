#!/usr/bin/env python3
"""
Render cv/cv.yaml to HTML using the same CSS as cv/index.html.

This is the full-fidelity renderer: it reproduces the existing hand-written
layout exactly, but takes its content from YAML instead of inline markup. It
keeps the two structures rendercv's schema cannot express — experience entries
containing independently-dated sub-clients, and Education folded into the
Skills section.

  ./scripts/cv-render.py                 # writes cv/build/resume.html
  ./scripts/cv-render.py --out FILE      # writes elsewhere

The layout constraints in the CSS are evidence, not taste. See cv/research.md.

Requires PyYAML. If it is not installed, run via uv:

  uv run --with pyyaml scripts/cv-render.py
"""

from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit(
        "error: PyYAML not installed.\n"
        "Run instead: uv run --with pyyaml scripts/cv-render.py"
    )

ROOT = Path(__file__).resolve().parent.parent

# ── CSS ────────────────────────────────────────────────────────────────────
# Copied verbatim from cv/index.html. If R4 is adopted, index.html goes away
# and this becomes the only copy.
CSS = """
      :root {
        --black: #000000;
        --white: #ffffff;
        --gray-100: #f5f5f5;
        --gray-300: #d4d4d4;
        --gray-500: #737373;
        --gray-600: #525252;
        --gray-800: #262626;
        --gray-900: #171717;

        --text: var(--gray-900);
        --muted: var(--gray-600);
        --faint: var(--gray-500);
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        background: var(--gray-100);
      }

      body {
        font-family: "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        font-size: 10pt;
        line-height: 1.4;
        color: var(--text);
        background: var(--gray-100);
        -webkit-font-smoothing: antialiased;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 8mm auto;
        padding: 13mm 15mm;
        background: var(--white);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      }

      .masthead {
        border-bottom: 1.5px solid var(--black);
        padding-bottom: 7px;
        margin-bottom: 11px;
      }

      .name {
        font-size: 21pt;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.05;
      }

      .role {
        font-size: 10.5pt;
        font-weight: 500;
        color: var(--gray-800);
        margin-top: 2px;
      }

      /* Contact details sit in the document body, never a header/footer or
         text box — Greenhouse lists both as parse failure modes. */
      .contact {
        margin-top: 6px;
        font-size: 9.2pt;
        color: var(--muted);
      }

      .contact a {
        color: var(--muted);
        text-decoration: none;
      }

      .sep {
        color: var(--gray-300);
        margin: 0 5px;
      }

      section {
        margin-bottom: 9px;
      }

      section:last-child {
        margin-bottom: 0;
      }

      h2 {
        font-size: 9pt;
        font-weight: 700;
        /* Do not raise past 0.10em. At 0.14em pdftotext splits the wider
           headings into individual letters — "SKILLS & EDUCATION" extracted as
           "S K I L L S & E D U C AT I O N", so a parser keying on the section
           name could not find it. Verified: 0.10em and below extract whole. */
        letter-spacing: 0.10em;
        text-transform: uppercase;
        color: var(--black);
        padding-bottom: 3px;
        border-bottom: 1px solid var(--gray-300);
        margin-bottom: 7px;
      }

      .summary {
        color: var(--gray-800);
      }

      .job {
        margin-bottom: 9px;
      }

      .job:last-child {
        margin-bottom: 0;
      }

      /* Note: a right-aligned date in a flex row extracts AFTER the location
         line rather than next to the title. Tried flex-start alignment to fix
         the ordering — it changed nothing, so this stays on baseline, which
         looks correct. The date is still inside the entry block, so this is
         cosmetic in the text layer, not a parsing failure. */
      .job-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 10px;
      }

      .job-title {
        font-size: 10.5pt;
        font-weight: 600;
      }

      .job-title .at {
        font-weight: 400;
        color: var(--gray-600);
      }

      .job-dates {
        font-size: 9pt;
        color: var(--faint);
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      .job-meta {
        font-size: 9pt;
        color: var(--faint);
        margin-bottom: 4px;
      }

      .project-name {
        font-size: 10pt;
        font-weight: 600;
        margin-top: 6px;
      }

      .project-name .tagline {
        font-weight: 400;
        color: var(--gray-600);
      }

      ul {
        list-style: none;
        margin-top: 3px;
      }

      li {
        position: relative;
        padding-left: 12px;
        margin-bottom: 2px;
        color: var(--gray-800);
      }

      li::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.5em;
        width: 3px;
        height: 3px;
        background: var(--faint);
        border-radius: 50%;
      }

      strong {
        font-weight: 600;
        color: var(--gray-900);
      }

      .row {
        display: flex;
        gap: 8px;
        margin-bottom: 3px;
      }

      .row:last-child {
        margin-bottom: 0;
      }

      .row-label {
        flex: 0 0 22mm;
        font-weight: 600;
        color: var(--gray-600);
        font-size: 9.2pt;
      }

      .row-value {
        flex: 1;
        color: var(--gray-800);
      }

      @page {
        size: A4;
        /* >= 0.5in per CMU SCS guidance; do not reduce to win a page break */
        margin: 13mm 15mm;
      }

      @media print {
        html,
        body {
          background: var(--white);
        }

        .page {
          width: auto;
          min-height: 0;
          margin: 0;
          padding: 0;
          box-shadow: none;
        }

        h2 {
          break-after: avoid;
          page-break-after: avoid;
        }

        .job-head,
        .job-meta,
        .project-name {
          break-after: avoid;
          page-break-after: avoid;
        }

        li,
        .row {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        a {
          color: inherit;
        }

        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
"""


def inline(text: str) -> str:
    """Escape HTML, then turn **bold** into <strong>, and pad ' | ' / ' · '.

    Non-breaking spaces around the separators keep them from landing at a line
    break, matching the hand-written markup.
    """
    out = html.escape(str(text).strip(), quote=False)
    out = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", out)
    out = out.replace(" | ", "&nbsp;|&nbsp;")
    out = out.replace(" · ", "&nbsp;·&nbsp;")
    return out


FONT_STACKS = {
    # Locally installed -> Chrome embeds CID TrueType, not Type 3.
    #
    # Do NOT lead this stack with -apple-system / BlinkMacSystemFont. Verified:
    # SF Pro embeds as Type 3 and produces a LARGER file (252K) than the Inter
    # webfont it was meant to replace. Named font files embed correctly; the
    # macOS system UI font does not. Probed CID-clean: Helvetica Neue, Arial,
    # Verdana, Tahoma, Optima.
    "sans-local": '"Helvetica Neue", Helvetica, Arial, sans-serif',
    "serif-local": 'Charter, "Iowan Old Style", Georgia, "Times New Roman", serif',
    # Webfont -> Type 3, larger file, needs the network at render time.
    "inter-webfont": '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
}

# Bullets must be <= 2 lines (CMU SCS). At 10pt over the ~180mm text column this
# is roughly 105 characters per line; the threshold is deliberately generous so
# it flags only real overruns.
CHARS_PER_LINE = 105
MAX_BULLET_LINES = 2

# Openers that are not action verbs. CMU SCS: Action Verb + Context + Result.
WEAK_OPENERS = {
    "a", "an", "the", "responsible", "responsibilities", "duties", "helped",
    "assisted", "worked", "involved", "tasked", "various", "successfully",
}


def validate(cv: dict) -> list[str]:
    """Check the content rules documented in cv/README.md.

    This is the equivalent of rendercv's schema validation, except it enforces
    THIS CV's evidenced constraints rather than a generic resume shape.
    """
    warn: list[str] = []

    def check_bullets(where: str, bullets: list[str]) -> None:
        for bl in bullets:
            plain = re.sub(r"\*\*(.+?)\*\*", r"\1", bl).strip()
            lines = -(-len(plain) // CHARS_PER_LINE)  # ceil
            if lines > MAX_BULLET_LINES:
                warn.append(
                    f"{where}: bullet is ~{lines} lines (max {MAX_BULLET_LINES}, "
                    f"{len(plain)} chars) — {plain[:60]}..."
                )
            first = re.split(r"\W+", plain, maxsplit=1)[0].lower()
            if first in WEAK_OPENERS:
                warn.append(f"{where}: bullet opens with {first!r}, not an action verb")
            if re.search(r"\b\d+\s*\+?\s*year", plain, re.I):
                warn.append(
                    f"{where}: bullet contains a year count — README.md excludes these"
                )

    for job in cv.get("experience", []):
        for f in ("title", "org", "dates"):
            if not job.get(f):
                warn.append(f"experience entry missing required field {f!r}")
        check_bullets(job.get("org", "?"), job.get("bullets", []))
        for sub in job.get("subentries", []):
            check_bullets(sub.get("name", "?"), sub.get("bullets", []))

    if re.search(r"\b\d+\s*\+?\s*year", cv.get("profile", ""), re.I):
        warn.append("profile contains a year count — README.md excludes these")
    if not cv.get("basics", {}).get("phone", "").startswith("+"):
        warn.append("phone is not in international form — expected a leading '+'")
    return warn


def render(cv: dict) -> str:
    b = cv["basics"]
    d = cv.get("design", {})
    font_key = d.get("font", "inter-webfont")
    if font_key not in FONT_STACKS:
        sys.exit(f"error: design.font must be one of {sorted(FONT_STACKS)}")
    fold = cv.get("layout", {}).get("fold_education_into_skills", True)
    p: list[str] = []

    # ── masthead ──
    contact = [inline(b["email"]), inline(b["phone"]), inline(b["location"])]
    contact += [
        f'<a href="{html.escape(l["url"])}">{inline(l["text"])}</a>'
        for l in b.get("links", [])
    ]
    sep = '<span class="sep">|</span>'
    p.append(
        '      <header class="masthead">\n'
        f'        <div class="name">{inline(b["name"])}</div>\n'
        f'        <div class="role">{inline(b["role"])}</div>\n'
        f'        <div class="contact">{sep.join(contact)}</div>\n'
        "      </header>"
    )

    # ── profile ──
    p.append(
        "      <section>\n"
        "        <h2>Profile</h2>\n"
        f'        <p class="summary">{inline(cv["profile"])}</p>\n'
        "      </section>"
    )

    # ── experience ──
    jobs: list[str] = []
    for job in cv.get("experience", []):
        j = [
            '        <div class="job">',
            '          <div class="job-head">',
            f'            <div class="job-title">{inline(job["title"])}'
            f' <span class="at">— {inline(job["org"])}</span></div>',
            f'            <div class="job-dates">{inline(job["dates"])}</div>',
            "          </div>",
        ]
        if job.get("meta"):
            j.append(f'          <div class="job-meta">{inline(job["meta"])}</div>')
        if job.get("bullets"):
            j.append("          <ul>")
            j += [f"            <li>{inline(x)}</li>" for x in job["bullets"]]
            j.append("          </ul>")
        # Sub-clients: the structure rendercv cannot express.
        for sub in job.get("subentries", []):
            j.append(
                f'          <div class="project-name">{inline(sub["name"])}'
                f' <span class="tagline">— {inline(sub["tagline"])}</span></div>'
            )
            if sub.get("bullets"):
                j.append("          <ul>")
                j += [f"            <li>{inline(x)}</li>" for x in sub["bullets"]]
                j.append("          </ul>")
        j.append("        </div>")
        jobs.append("\n".join(j))
    p.append(
        "      <section>\n        <h2>Experience</h2>\n"
        + "\n\n".join(jobs)
        + "\n      </section>"
    )

    def rows(items: list[tuple[str, str]]) -> str:
        return "\n".join(
            '        <div class="row">\n'
            f'          <div class="row-label">{inline(k)}</div>\n'
            f'          <div class="row-value">{inline(v)}</div>\n'
            "        </div>"
            for k, v in items
        )

    # ── projects ──
    if cv.get("projects"):
        p.append(
            "      <!-- Unpaid own products live here, not in Experience. -->\n"
            "      <section>\n        <h2>Projects</h2>\n"
            + rows([(x["label"], x["value"]) for x in cv["projects"]])
            + "\n      </section>"
        )

    # ── skills (+ education, folded) ──
    edu = [
        (
            "Education",
            f'{e["institution"]} — {e["degree"]}, {e["dates"]}',
        )
        for e in cv.get("education", [])
    ]
    skill_rows = [(x["label"], x["value"]) for x in cv.get("skills", [])]
    heading = "Skills &amp; Education" if fold else "Skills"
    p.append(
        f"      <section>\n        <h2>{heading}</h2>\n"
        + rows(skill_rows + (edu if fold else []))
        + "\n      </section>"
    )
    if not fold and edu:
        p.append(
            "      <section>\n        <h2>Education</h2>\n"
            + rows(edu)
            + "\n      </section>"
        )

    # ── design overrides ──
    # Each of these is free in vertical space, so none endangers the page budget.
    ov = [f"      body {{ font-family: {FONT_STACKS[font_key]}; }}"]
    if d.get("justify", False):
        # Justification without hyphenation opens rivers at this column width.
        hy = "auto" if d.get("hyphenate", True) else "manual"
        ov.append(
            "      .summary, li, .row-value {\n"
            "        text-align: justify;\n"
            f"        hyphens: {hy};\n"
            f"        -webkit-hyphens: {hy};\n"
            "      }"
        )
    if d.get("center_header", False):
        ov.append(
            "      .masthead { text-align: center; }\n"
            "      .contact { display: flex; flex-wrap: wrap;\n"
            "                 justify-content: center; row-gap: 2px; }"
        )
    overrides = "\n\n".join(ov)

    webfont = (
        """    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
"""
        if font_key == "inter-webfont"
        else "    <!-- No webfont: a locally installed font embeds as CID, not Type 3. -->\n"
    )

    body = "\n\n".join(p)
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{inline(b["name"])} — {inline(b["role"].split("—")[0].strip())}</title>
    <!-- GENERATED from cv/cv.yaml by scripts/cv-render.py. Do not edit. -->
{webfont}    <style>{CSS}
      /* ---------- design overrides, from cv.yaml `design:` ---------- */

{overrides}
    </style>
  </head>

  <body>
    <div class="page">
{body}
    </div>
  </body>
</html>
"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--yaml", default=str(ROOT / "cv" / "cv.yaml"))
    ap.add_argument("--out", default=str(ROOT / "cv" / "build" / "resume.html"))
    ap.add_argument("--font", choices=sorted(FONT_STACKS), default=None)
    ap.add_argument("--justify", choices=("true", "false"), default=None)
    ap.add_argument("--center-header", dest="center_header",
                    choices=("true", "false"), default=None)
    a = ap.parse_args()

    cv = yaml.safe_load(Path(a.yaml).read_text(encoding="utf-8"))

    # CLI overrides, for rendering variants without editing cv.yaml.
    cv.setdefault("design", {})
    for k in ("font",):
        if getattr(a, k) is not None:
            cv["design"][k] = getattr(a, k)
    for k in ("justify", "center_header"):
        if getattr(a, k) is not None:
            cv["design"][k] = getattr(a, k) == "true"

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(cv), encoding="utf-8")
    print(f"Wrote {out}")

    for w in validate(cv):
        print(f"  warning: {w}", file=sys.stderr)


if __name__ == "__main__":
    main()
