#!/bin/sh
# storybook_dev's verification, scripted, as test/ts/vite/app/verify_hmr.sh is
# vite_dev's. Not a plz test and it cannot be one: it starts the real server,
# edits real sources while it runs, and asserts the edits arrive. Run it from
# the repository root:
#
#   ./test/ts/storybook/verify_dev.sh
#
# It restores every file it touches, including on failure. POSIX sh and no
# `sed -i`, so it runs the same on Linux and macOS.
set -u

PORT=${1:-6219}
DIR=test/ts/storybook
STORY_SRC=$DIR/src/Greeting.tsx
PREVIEW=$DIR/.storybook/preview.ts
LIB_SRC=test/lib/greeter/index.ts
NEW_STORY=$DIR/src/ZzNew.stories.tsx
LOG=$(mktemp)
URL="http://localhost:$PORT"
fail=0

say() { printf "  %-60s %s\n" "$1" "$2"; }
check() { # name, expected, actual
  if [ "$2" = "$3" ]; then say "$1" "ok"; else say "$1" "FAIL (wanted $2, got $3)"; fail=1; fi
}
# Polls until a fetched URL contains (1) or stops containing (0) a marker.
served() { # path, marker, wanted
  got=x
  for _ in $(seq 1 40); do
    got=$(curl -s "$URL$1" | grep -c "$2")
    [ "$got" -gt 0 ] && got=1
    [ "$got" = "$3" ] && break
    sleep 0.3
  done
  echo "$got"
}
edit() { perl -pi -e "$1" "$2"; }

cp "$STORY_SRC" "$STORY_SRC.bak"
cp "$PREVIEW" "$PREVIEW.bak"
cp "$LIB_SRC" "$LIB_SRC.bak"
cleanup() {
  mv "$STORY_SRC.bak" "$STORY_SRC" 2>/dev/null
  mv "$PREVIEW.bak" "$PREVIEW" 2>/dev/null
  mv "$LIB_SRC.bak" "$LIB_SRC" 2>/dev/null
  rm -f "$NEW_STORY"
  [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null
  # Whatever still listens on the port: plz run's child outlives plz itself.
  command -v lsof >/dev/null && lsof -ti "tcp:$PORT" -sTCP:LISTEN | xargs kill 2>/dev/null
  rm -f "$LOG"
}
trap cleanup EXIT INT TERM

plz build //$DIR:dev >/dev/null 2>&1 || { echo "build failed"; exit 1; }

BEFORE=$(mktemp)
git status --porcelain --ignored=no > "$BEFORE"
plz run //$DIR:dev -- -p "$PORT" > "$LOG" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 120); do
  curl -sf -o /dev/null "$URL/index.json" 2>/dev/null && break
  sleep 0.5
done
check "server serves its story index" 1 "$(served /index.json greeting--quiet 1)"

# Populate the module graph before editing, so a later fetch proves watching
# rather than a first read.
curl -s "$URL/src/Greeting.tsx" >/dev/null
curl -s "$URL/.storybook/preview.ts" >/dev/null
curl -s "$URL/node_modules/@test/greeter/index.ts" >/dev/null

edit 's|A first-party library.s output, rendered.|HMR_STORY_MARKER|' "$STORY_SRC"
check "a component edit reaches the browser" 1 "$(served /src/Greeting.tsx HMR_STORY_MARKER 1)"

edit 's|layout: "centered"|layout: "padded", hmr: "HMR_PREVIEW_MARKER"|' "$PREVIEW"
check "a preview edit reaches the browser" 1 "$(served /.storybook/preview.ts HMR_PREVIEW_MARKER 1)"

edit 's|Hello, |HMR_LIB_MARKER |' "$LIB_SRC"
check "a library edit reaches the browser" 1 "$(served /node_modules/@test/greeter/index.ts HMR_LIB_MARKER 1)"

# A first-party library's CommonJS import, prebundled rather than served raw.
check "a library's CommonJS import is prebundled" 1 \
  "$(served /node_modules/@test/compiled/index.ts 'react_compiler-runtime.js' 1)"

# A story file that did not exist when the server started: indexed and served.
cat > "$NEW_STORY" <<'STORY'
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Greeting } from "@/Greeting";

const meta = { title: "ZzNew", component: Greeting } satisfies Meta<typeof Greeting>;
export default meta;
export const Fresh: StoryObj<typeof meta> = { args: { who: "NEW_STORY_MARKER" } };
STORY
check "a new story file is indexed" 1 "$(served /index.json zznew--fresh 1)"
check "  ... and served" 1 "$(served /src/ZzNew.stories.tsx NEW_STORY_MARKER 1)"

# playwright_binary: a program driving the pinned browser, run from this
# package, so its relative arguments resolve here.
plz build //$DIR:storybook >/dev/null 2>&1
SHOT=$DIR/zz_capture.png
plz run //$DIR:capture -- ../../../plz-out/gen/$DIR/storybook-static greeting--loud zz_capture.png >/dev/null 2>&1
check "playwright_binary captures a story in the pinned browser" 1 "$(file "$SHOT" 2>/dev/null | grep -c 'PNG image data')"
rm -f "$SHOT"

# esbuild_binary: a TypeScript program run from this package, importing from
# the tree; its relative output path lands here.
plz run //$DIR:stamp -- zz_stamp.txt >/dev/null 2>&1
check "esbuild_binary runs from its package, importing the tree" 1 "$(grep -c 'ESBUILD_BINARY_MARKER react' "$DIR/zz_stamp.txt" 2>/dev/null || echo 0)"
rm -f "$DIR/zz_stamp.txt"

AFTER=$(mktemp)
git status --porcelain --ignored=no > "$AFTER"
check "the server wrote nothing outside plz-out" 0 \
  "$(diff "$BEFORE" "$AFTER" | grep '^>' | grep -cv 'Greeting.tsx\|preview.ts\|greeter/index.ts\|\.bak\|ZzNew\|zz_capture')"
rm -f "$BEFORE" "$AFTER"

[ "$fail" = 0 ] && echo "PASS: the Storybook development loop works" || { echo "FAIL"; sed -n '1,40p' "$LOG"; }
exit "$fail"
