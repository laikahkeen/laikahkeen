#!/usr/bin/env bash
#
# Build the social card: scripts/og-template.html -> public/og-image.png
#
# Unlike the CV, this writes straight to the served file — the OG image has no
# staging step and is only read when someone shares the link.
#
# Usage: ./scripts/build-og.sh
#
# Chrome discovery mirrors build-cv.sh. The output is verified at 1200x630,
# which is what the og:image and twitter:image tags in index.html promise.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HTML="$ROOT/scripts/og-template.html"
OUT="$ROOT/public/og-image.png"

[ -f "$HTML" ] || { echo "error: $HTML not found" >&2; exit 1; }

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

[ -n "$CHROME" ] || { echo "error: no Chrome/Chromium binary found." >&2; exit 1; }
echo "Rendering with: $CHROME"

# --virtual-time-budget lets the Google Fonts request land before the snapshot;
# without it the card renders in the local fallback stack.
"$CHROME" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --virtual-time-budget=10000 \
  --screenshot="$OUT" \
  "file://$HTML" 2>/dev/null

[ -f "$OUT" ] || { echo "error: Chrome did not produce $OUT" >&2; exit 1; }
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1 | tr -d ' '))"

echo
echo "Verification:"
if command -v sips >/dev/null 2>&1; then
  W=$(sips -g pixelWidth "$OUT" | awk '/pixelWidth/{print $2}')
  H=$(sips -g pixelHeight "$OUT" | awk '/pixelHeight/{print $2}')
  if [ "$W" = "1200" ] && [ "$H" = "630" ]; then
    echo "  size:  ${W}x${H}"
  else
    echo "  size:  ${W}x${H}  <-- expected 1200x630, the size index.html advertises."
  fi
fi
