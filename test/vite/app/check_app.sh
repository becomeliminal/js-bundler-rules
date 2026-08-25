#!/bin/sh
set -eu

DIR=test/vite/app

# vite content-hashes its filenames, which is the reason the rule declares a
# directory rather than files. Find the bundle rather than naming it.
JS=$(find "$DIR/assets" -name "index-*.js" | head -1)
[ -n "$JS" ] || { echo "no content-hashed bundle in $DIR/assets" >&2; exit 1; }

grep -q "$(basename "$JS")" "$DIR/index.html" \
  || { echo "index.html does not reference the bundle vite emitted" >&2; exit 1; }

# The first-party library, reached by package name through the tree the overlay
# built. Minified, so the template literal is what survives.
grep -q "Hello, " "$JS" \
  || { echo "@test/greeter never made it into the bundle" >&2; exit 1; }

# React itself, from the consumer's lockfile rather than this plugin's.
CSS=$(find "$DIR/assets" -name "index-*.css" | head -1)
[ -n "$CSS" ] || { echo "no stylesheet emitted" >&2; exit 1; }
grep -q "$(basename "$CSS")" "$DIR/index.html" \
  || { echo "index.html does not reference the stylesheet vite emitted" >&2; exit 1; }

grep -q "createRoot" "$JS" \
  || { echo "react-dom missing: the consumer tree was not resolved" >&2; exit 1; }

# One React, not two. This is the dedupe question, asked of the output rather
# than the tree: a second copy would carry a second copy of this marker.
COPIES=$(grep -o "Objects are not valid as a React child" "$JS" | wc -l)
[ "$COPIES" -le 1 ] || { echo "react appears $COPIES times: the bundle carries duplicates" >&2; exit 1; }

# Client-side routing, which is the case a static page cannot fake: a dynamic
# segment is read from the URL at render time, so the router has to be in here.
grep -q "hashchange" "$JS" \
  || { echo "react-router missing: the hash history was never bundled" >&2; exit 1; }

echo "ok"
