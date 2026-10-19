#!/usr/bin/env bash
#
# Build the "enter the server" room: scripts/blender/server-room.py -> public/models/server-room.glb
#
# Writes straight to the served file. Needs Blender (brew install --cask blender);
# the Cycles bake runs on the GPU and takes a minute or two.
#
# Usage: ./scripts/build-server-room.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public/models/server-room.glb"

BLENDER="$(command -v blender || true)"
[ -n "$BLENDER" ] || BLENDER="/Applications/Blender.app/Contents/MacOS/Blender"
[ -x "$BLENDER" ] || { echo "error: Blender not found. brew install --cask blender" >&2; exit 1; }

mkdir -p "$(dirname "$OUT")"
"$BLENDER" --background --factory-startup --python "$ROOT/scripts/blender/server-room.py" -- "$OUT"

[ -s "$OUT" ] || { echo "error: $OUT was not written" >&2; exit 1; }
echo "OK: $OUT ($(du -k "$OUT" | cut -f1) KB)"
