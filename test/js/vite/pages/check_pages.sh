#!/bin/sh
set -eu

DIR=test/js/vite/pages

# Every page exists, at the path its input dictated.
[ -f "$DIR/index.html" ] || { echo "front page missing" >&2; exit 1; }
[ -f "$DIR/admin/index.html" ] || { echo "admin page missing" >&2; exit 1; }

# Each references its own hashed bundle -- not merely a bundle: the wrong
# script in the right page is the failure multi-page introduces.
MAIN=$(find "$DIR/assets" -name "main-*.js" | head -1)
ADMIN=$(find "$DIR/assets" -name "admin-*.js" | head -1)
[ -n "$MAIN" ] && [ -n "$ADMIN" ] || { echo "an entry bundle is missing from assets/" >&2; exit 1; }

grep -q "$(basename "$MAIN")" "$DIR/index.html" \
  || { echo "index.html does not reference its own bundle" >&2; exit 1; }
grep -q "$(basename "$ADMIN")" "$DIR/admin/index.html" \
  || { echo "admin/index.html does not reference its own bundle" >&2; exit 1; }

# The pages carry their own code, and main also carries the shared library.
grep -q "page:main" "$MAIN" || { echo "main bundle lost its module" >&2; exit 1; }
grep -q "page:admin" "$ADMIN" || { echo "admin bundle lost its module" >&2; exit 1; }
grep -q "Hello, " "$MAIN" || { echo "@test/greeter missing from main" >&2; exit 1; }

echo ok
