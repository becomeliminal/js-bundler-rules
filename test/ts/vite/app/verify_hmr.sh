#!/bin/sh
# The dev server's verification, scripted. Not a plz test and it cannot be one:
# a development server reacts to files that change after the build, so this
# starts the real server, edits real sources while it runs, and asserts the
# edits arrive. Run it from the repository root:
#
#   ./test/ts/vite/app/verify_hmr.sh
#
# It builds what it needs, cleans up after itself, and restores every file it
# touches -- including on failure. POSIX sh and no `sed -i`, so it runs the same
# on Linux and macOS.
set -u

PORT=${1:-5219}
APP=test/ts/vite/app
APP_SRC=$APP/src/App.tsx
LIB=test/lib/greeter
LIB_SRC=$LIB/index.ts
LOG=$(mktemp)
URL="http://localhost:$PORT"
fail=0

say() { printf "  %-60s %s\n" "$1" "$2"; }
check() { # name, expected, actual
  if [ "$2" = "$3" ]; then say "$1" "ok"; else say "$1" "FAIL (wanted $2, got $3)"; fail=1; fi
}
# Polls until a fetched URL contains (1) or stops containing (0) a marker, and
# prints what it last saw. A server reacts to a file change asynchronously.
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
# A replacement in a file, portably: perl rather than sed -i, whose flags
# differ between GNU and BSD.
edit() { perl -pi -e "$1" "$2"; }

# Everything this script creates, so cleanup removes it whatever happens.
NEW_FILE=$APP/src/zz_new.ts
NEW_DIR=$APP/src/zz_dir
NEW_PUBLIC=$APP/public/zz_asset.txt
NEW_LIB=$LIB/parts/zz_lib.ts
# Where the tree's label points in the SOURCE tree: the launcher's candidate
# for //third_party/js/react:node_modules at the repository root.
DECOY=third_party/js/react/node_modules

# Cleanup removes the decoy, so it must be ours: refuse rather than delete a
# directory someone else put there.
if [ -e "$DECOY" ]; then echo "$DECOY exists; move it aside first"; exit 1; fi

cp "$APP_SRC" "$APP_SRC.bak"
cp "$LIB_SRC" "$LIB_SRC.bak"
cleanup() {
  mv "$APP_SRC.bak" "$APP_SRC" 2>/dev/null
  mv "$LIB_SRC.bak" "$LIB_SRC" 2>/dev/null
  rm -rf "$NEW_FILE" "$NEW_DIR" "$NEW_PUBLIC" "$NEW_LIB" "$DECOY"
  [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null
  rm -f "$LOG"
}
trap cleanup EXIT INT TERM

plz build //test/ts/vite/app:dev >/dev/null 2>&1 || { echo "build failed"; exit 1; }

# A decoy npm install in the source directory: what a stale `npm install`
# leaves behind. The launcher must run the tree Please built and never this --
# at the repository root, a source-tree path is not a candidate. Were it
# picked up, the server would print DECOY and exit.
mkdir -p "$DECOY/vite/bin"
printf '{"name":"vite","version":"0.0.0-decoy","bin":{"vite":"bin/vite.js"}}\n' > "$DECOY/vite/package.json"
printf 'console.log("DECOY");\nprocess.exit(1);\n' > "$DECOY/vite/bin/vite.js"

# Snapshot before the server runs, so the final check measures what the SERVER
# did rather than whatever state the working tree happened to be in.
BEFORE=$(mktemp)
git status --porcelain --ignored=no > "$BEFORE"
plz run //test/ts/vite/app:dev -- --port "$PORT" > "$LOG" 2>&1 &
SERVER_PID=$!

# Up, within a bounded wait.
for _ in $(seq 1 60); do
  curl -sf -o /dev/null "$URL/" 2>/dev/null && break
  sleep 0.5
done
check "server serves" 200 "$(curl -s -o /dev/null -w '%{http_code}' "$URL/")"
check "it runs the tree Please built, not a source-tree install" 0 "$(grep -c DECOY "$LOG")"

# Populate the module graph BEFORE editing. Without this the post-edit fetch
# reads the file fresh and proves nothing about watching -- the exact false
# positive that hid the watcher bug when this was first built.
curl -s "$URL/src/App.tsx" >/dev/null
curl -s "$URL/node_modules/@test/greeter/index.ts" >/dev/null

# An app source, edited while serving.
edit 's|Smaller, and not finished|HMR_APP_MARKER|' "$APP_SRC"
check "an app edit reaches the browser" 1 "$(served /src/App.tsx HMR_APP_MARKER 1)"

# A first-party library -- the half that needs the hoisted tree, the live
# links, and the watcher negations. Any one missing and this stays 0.
edit 's|Hello, |HMR_LIB_MARKER |' "$LIB_SRC"
check "a library edit reaches the browser" 1 "$(served /node_modules/@test/greeter/index.ts HMR_LIB_MARKER 1)"

# A CSS @import of a first-party package, by name. vite resolves it through
# its own resolver -- aliases and vite:resolve, never plugins -- from the
# stylesheet's real path in the repository, where no plz tree sits.
check "a CSS @import of a first-party package resolves" 1 \
  "$(served /src/styles.css GREETER_CSS_MARKER 1)"

# The update propagated, not merely re-servable: vite logged an hmr update.
check "hmr update was pushed to the client" 1 "$(grep -c 'hmr update' "$LOG" | awk '{print ($1>0)?1:0}')"

# --- Files that did not exist when the server started. ---

# By URL: what index.html and the browser ask for.
printf 'export const NEW_FILE = "NEW_FILE_MARKER";\n' > "$NEW_FILE"
check "a new file is served by its URL" 1 "$(served /src/zz_new.ts NEW_FILE_MARKER 1)"

# A new directory of files, imported through the "@" alias -- resolved against
# the run directory, where nothing would be without its live link.
mkdir -p "$NEW_DIR/deeper"
printf 'export const THING = "NEW_DIR_MARKER";\n' > "$NEW_DIR/deeper/Thing.ts"
sleep 0.5
printf 'import { THING } from "@/zz_dir/deeper/Thing";\nconsole.log(THING);\n' >> "$APP_SRC"
# Resolved means rewritten to the module's path, extension included -- as
# /@fs/<real path>, since a linked source resolves to the file it points at.
# vite's error page for an unresolved import quotes only the bare specifier.
check "an edit importing it through @/ resolves" 1 \
  "$(served /src/App.tsx 'zz_dir/deeper/Thing.ts"' 1)"
check "  ... and the new module is served" 1 "$(served /src/zz_dir/deeper/Thing.ts NEW_DIR_MARKER 1)"

# A new static asset, served from public/ at the root.
printf 'NEW_PUBLIC_MARKER\n' > "$NEW_PUBLIC"
check "a new public/ asset is served" 1 "$(served /zz_asset.txt NEW_PUBLIC_MARKER 1)"

# A new module in a first-party library's source directory.
printf 'export const LIB_NEW = "NEW_LIB_MARKER";\n' > "$NEW_LIB"
check "a new library module is served" 1 "$(served /node_modules/@test/greeter/parts/zz_lib.ts NEW_LIB_MARKER 1)"

# --- And files that go away. ---

# Deleted: the link goes with it, so the old module stops being served (the
# SPA fallback answers instead) rather than a dangling link lingering.
rm "$NEW_FILE"
check "a deleted file stops being served" 0 "$(served /src/zz_new.ts NEW_FILE_MARKER 0)"
check "  ... and its link is gone" 0 \
  "$(find plz-out/gen/$APP -path '*_run/src/zz_new.ts' 2>/dev/null | wc -l | tr -d ' ')"

# Renamed: an unlink and an add. The new name is served; the old one is not.
mv "$NEW_DIR/deeper/Thing.ts" "$NEW_DIR/deeper/Renamed.ts"
check "a renamed file is served under its new name" 1 "$(served /src/zz_dir/deeper/Renamed.ts NEW_DIR_MARKER 1)"
check "  ... and not its old one" 0 "$(served /src/zz_dir/deeper/Thing.ts NEW_DIR_MARKER 0)"

# A whole directory deleted: every link under it goes, not only a file's.
rm -rf "$NEW_DIR"
check "a deleted directory's files stop being served" 0 "$(served /src/zz_dir/deeper/Renamed.ts NEW_DIR_MARKER 0)"

# The principle the design exists to honour: the server created nothing in the
# source tree. Compared against the snapshot, minus this script's own files.
AFTER=$(mktemp)
git status --porcelain --ignored=no > "$AFTER"
check "the server wrote nothing outside plz-out" 0 \
  "$(diff "$BEFORE" "$AFTER" | grep '^>' | grep -cv 'App.tsx\|greeter/index.ts\|\.bak\|zz_')"
rm -f "$BEFORE" "$AFTER"

[ "$fail" = 0 ] && echo "PASS: the development loop works" || { echo "FAIL"; sed -n '1,40p' "$LOG"; }
exit "$fail"
