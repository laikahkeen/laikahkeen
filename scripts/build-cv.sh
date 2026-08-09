#!/usr/bin/env bash
#
# Build the CV: cv/cv.yaml -> cv/build/resume.html -> cv/build/resume.pdf
#
# Content lives in cv/cv.yaml. Presentation lives in scripts/cv-render.py.
# Neither the HTML nor the PDF is edited by hand.
#
# This deliberately does NOT write to public/resume.pdf — that file is the live
# CV served from laikahkeen.com. Promoting a new build is a manual, deliberate
# step:
#
#   cp cv/build/resume.pdf public/resume.pdf
#
# Usage: ./scripts/build-cv.sh
#
# The script verifies the output after rendering: page count, font embedding,
# and that no word was broken across a line in the text layer. A failure in any
# of those is a real defect — see cv/README.md before working around it.
#
# If Chrome cannot be found, open cv/build/resume.html and print (Cmd+P):
#   Paper: A4, Margins: None, Background graphics: on
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
YAML="$ROOT/cv/cv.yaml"
HTML="$ROOT/cv/build/resume.html"
OUT="$ROOT/cv/build/resume.pdf"

[ -f "$YAML" ] || { echo "error: $YAML not found" >&2; exit 1; }
mkdir -p "$(dirname "$OUT")"

# ── render YAML -> HTML ────────────────────────────────────────────────────
# cv-render.py also validates the content rules from cv/README.md and prints
# any violations to stderr. Those are warnings, not fatal — read them.
if python3 -c "import yaml" 2>/dev/null; then
  python3 "$ROOT/scripts/cv-render.py" --yaml "$YAML" --out "$HTML"
elif command -v uv >/dev/null 2>&1; then
  uv run --with pyyaml "$ROOT/scripts/cv-render.py" --yaml "$YAML" --out "$HTML"
else
  echo "error: needs PyYAML (pip install pyyaml) or uv" >&2
  exit 1
fi

# ── find a Chrome/Chromium binary ──────────────────────────────────────────
CHROME=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)"
do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then CHROME="$candidate"; break; fi
done

if [ -z "$CHROME" ]; then
  echo "error: no Chrome/Chromium binary found." >&2
  echo "Fallback: open cv/build/resume.html and print to PDF (A4, no margins," >&2
  echo "background graphics enabled)." >&2
  exit 1
fi

echo "Rendering with: $CHROME"

# --virtual-time-budget is retained for the inter-webfont option, which needs
# the Google Fonts request to land before the snapshot. It is harmless for the
# local-font options.
"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  --print-to-pdf="$OUT" \
  "file://$HTML" 2>/dev/null

[ -f "$OUT" ] || { echo "error: Chrome did not produce $OUT" >&2; exit 1; }
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1 | tr -d ' '))"

# ── verify ─────────────────────────────────────────────────────────────────
echo
echo "Verification:"

PAGES=$(python3 -c "
import re,sys
d=open('$OUT','rb').read()
print(len(re.findall(rb'/Type\s*/Page[^s]', d)))")
if [ "$PAGES" = "1" ]; then
  echo "  pages:        $PAGES"
else
  echo "  pages:        $PAGES  <-- OVER BUDGET. Cut content; do not shrink type or margins."
fi

if command -v pdffonts >/dev/null 2>&1; then
  TYPES=$(pdffonts "$OUT" | tail -n +3 | awk '{print $2}' | sort -u | paste -sd, -)
  if echo "$TYPES" | grep -q "Type 3"; then
    echo "  fonts:        $TYPES  <-- Type 3. Is design.font set to a *-local option?"
  else
    echo "  fonts:        $TYPES"
  fi
fi

if command -v pdftotext >/dev/null 2>&1; then
  TXT="$(mktemp)"
  pdftotext "$OUT" "$TXT"
  BROKEN=$(python3 -c "
import re,sys
d=open('$TXT',encoding='utf-8').read()
print(len(re.findall(r'\w(‐|­)\n', d)))")
  if [ "$BROKEN" = "0" ]; then
    echo "  broken words: $BROKEN"
  else
    echo "  broken words: $BROKEN  <-- hyphenation is corrupting the text layer."
    echo "                   Set design.hyphenate: false in cv/cv.yaml."
  fi
  echo
  echo "Text layer should read straight down the page:"
  head -12 "$TXT" | sed 's/^/  | /'
  rm -f "$TXT"
fi
