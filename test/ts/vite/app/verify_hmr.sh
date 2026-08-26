#!/bin/sh
# The dev server's verification, scripted. Not a plz test and it cannot be one:
# a development server reacts to files that change after the build, so this
# starts the real server, edits real sources while it runs, and asserts the
# edits arrive. Run it from the repository root:
#
#   ./test/ts/vite/app/verify_hmr.sh
#
# It builds what it needs, cleans up after itself, and restores every file it
# touches -- including on failure.
set -u

PORT=${1:-5219}
APP_SRC=test/ts/vite/app/src/App.tsx
LIB_SRC=test/lib/greeter/index.ts
LOG=$(mktemp)
fail=0

say() { printf "  %-52s %s\n" "$1" "$2"; }
check() { # name, expected, actual
  if [ "$2" = "$3" ]; then say "$1" "ok"; else say "$1" "FAIL (wanted $2, got $3)"; fail=1; fi
}

cp "$APP_SRC" "$APP_SRC.bak"
cp "$LIB_SRC" "$LIB_SRC.bak"
cleanup() {
  mv "$APP_SRC.bak" "$APP_SRC" 2>/dev/null
  mv "$LIB_SRC.bak" "$LIB_SRC" 2>/dev/null
  [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null
  rm -f "$LOG"
}
trap cleanup EXIT INT TERM

plz build //test/ts/vite/app:dev >/dev/null 2>&1 || { echo "build failed"; exit 1; }

# Snapshot before the server runs, so the final check measures what the SERVER
# did rather than whatever state the working tree happened to be in.
BEFORE=$(mktemp)
git status --porcelain --ignored=no > "$BEFORE"
plz run //test/ts/vite/app:dev -- --port "$PORT" > "$LOG" 2>&1 &
SERVER_PID=$!

# Up, within a bounded wait.
for _ in $(seq 1 60); do
  curl -sf -o /dev/null "http://localhost:$PORT/" 2>/dev/null && break
  sleep 0.5
done
check "server serves" 200 "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/")"

# Populate the module graph BEFORE editing. Without this the post-edit fetch
# reads the file fresh and proves nothing about watching -- the exact false
# positive that hid the watcher bug when this was first built.
curl -s "http://localhost:$PORT/src/App.tsx" >/dev/null
curl -s "http://localhost:$PORT/node_modules/@test/greeter/index.ts" >/dev/null

# An app source, edited while serving.
sed -i 's|Smaller, and not finished|HMR_APP_MARKER|' "$APP_SRC"
got=0
for _ in $(seq 1 20); do
  got=$(curl -s "http://localhost:$PORT/src/App.tsx" | grep -c HMR_APP_MARKER)
  [ "$got" = 1 ] && break
  sleep 0.5
done
check "an app edit reaches the browser" 1 "$got"

# A first-party library -- the half that needs the hoisted tree, devlink, and
# the watcher negations. Any one missing and this stays 0.
sed -i 's|`Hello, ${who}!`|`HMR_LIB_MARKER ${who}`|' "$LIB_SRC"
got=0
for _ in $(seq 1 20); do
  got=$(curl -s "http://localhost:$PORT/node_modules/@test/greeter/index.ts" | grep -c HMR_LIB_MARKER)
  [ "$got" = 1 ] && break
  sleep 0.5
done
check "a library edit reaches the browser" 1 "$got"

# The update propagated, not merely re-servable: vite logged an hmr update.
check "hmr update was pushed to the client" 1 "$(grep -c 'hmr update' "$LOG" | head -1 | awk '{print ($1>0)?1:0}')"

# The principle the design exists to honour: the server created nothing in the
# source tree. Compared against the snapshot, minus this script's own edits.
AFTER=$(mktemp)
git status --porcelain --ignored=no > "$AFTER"
check "the server wrote nothing outside plz-out" 0 \
  "$(diff "$BEFORE" "$AFTER" | grep '^>' | grep -cv 'App.tsx\|greeter/index.ts\|\.bak')"
rm -f "$BEFORE" "$AFTER"

[ "$fail" = 0 ] && echo "PASS: the development loop works" || echo "FAIL"
exit "$fail"
