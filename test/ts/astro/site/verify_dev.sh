#!/bin/sh
# astro_dev's verification, scripted, as test/ts/vite/app/verify_hmr.sh is for
# vite_dev: it starts the real server, edits real sources while it runs, and
# asserts what it serves. Run it from the repository root:
#
#   ./test/ts/astro/site/verify_dev.sh
#
# It restores every file it touches, including on failure. POSIX sh and no
# `sed -i`, so it runs the same on Linux and macOS.
set -u

PORT=${1:-5229}
SITE=test/ts/astro/site
PAGE=$SITE/src/pages/index.astro
LIB=test/lib/greeter/index.ts
NEW_PAGE=$SITE/src/pages/zz_new.astro
LOG=$(mktemp)
URL="http://localhost:$PORT"
fail=0

say() { printf "  %-60s %s\n" "$1" "$2"; }
check() { if [ "$2" = "$3" ]; then say "$1" "ok"; else say "$1" "FAIL (wanted $2, got $3)"; fail=1; fi; }
served() { # path, marker, wanted
  got=x
  for _ in $(seq 1 30); do
    got=$(curl -s "$URL$1" | grep -c "$2")
    [ "$got" -gt 0 ] && got=1
    [ "$got" = "$3" ] && break
    sleep 0.3
  done
  echo "$got"
}
edit() { perl -pi -e "$1" "$2"; }

cp "$PAGE" "$PAGE.bak"
cp "$LIB" "$LIB.bak"
cleanup() {
  mv "$PAGE.bak" "$PAGE" 2>/dev/null
  mv "$LIB.bak" "$LIB" 2>/dev/null
  rm -f "$NEW_PAGE"
  [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null
  rm -f "$LOG"
}
trap cleanup EXIT INT TERM

plz build //$SITE:dev >/dev/null 2>&1 || { echo "build failed"; exit 1; }
BEFORE=$(mktemp)
git status --porcelain --ignored=no > "$BEFORE"
# Astro backgrounds its dev server when it detects an AI agent; this script
# wants it in the foreground wherever it runs.
ASTRO_DEV_BACKGROUND=1 plz run //$SITE:dev -- --port "$PORT" > "$LOG" 2>&1 &
SERVER_PID=$!
for _ in $(seq 1 60); do curl -sf -o /dev/null "$URL/" 2>/dev/null && break; sleep 0.5; done

check "the page renders" 1 "$(served / '<title>astro_build</title>' 1)"
# A first-party package's stylesheet, by package name, from a repository
# file, and its library in the page's script.
check "a CSS @import of a first-party package resolves" 1 "$(served /node_modules/@test/greeter/greeter.css GREETER_CSS_MARKER 1)"
curl -s "$URL/node_modules/@test/greeter/index.ts" >/dev/null

edit 's|const title: string = "astro_build";|const title: string = "HMR_PAGE_MARKER";|' "$PAGE"
check "a page edit is served" 1 "$(served / HMR_PAGE_MARKER 1)"

edit 's|Hello, |HMR_LIB_MARKER |' "$LIB"
check "a library edit is served" 1 "$(served /node_modules/@test/greeter/index.ts HMR_LIB_MARKER 1)"

printf -- '---\n---\n<html><body>NEW_PAGE_MARKER</body></html>\n' > "$NEW_PAGE"
check "a new page is served" 1 "$(served /zz_new NEW_PAGE_MARKER 1)"
rm "$NEW_PAGE"
check "a deleted page stops being served" 0 "$(served /zz_new NEW_PAGE_MARKER 0)"

check "the server never inlined a CommonJS dependency" 0 "$(grep -c 'require is not defined' "$LOG")"

AFTER=$(mktemp)
git status --porcelain --ignored=no > "$AFTER"
check "the server wrote nothing outside plz-out" 0 \
  "$(diff "$BEFORE" "$AFTER" | grep '^>' | grep -cv 'index.astro\|greeter/index.ts\|\.bak\|zz_')"
rm -f "$BEFORE" "$AFTER"

[ "$fail" = 0 ] && echo "PASS: the development loop works" || { echo "FAIL"; sed -n '1,40p' "$LOG"; }
exit "$fail"
