#!/bin/sh
set -eu

DIR=test/ts/esbuild/site

# esbuild names its outputs after the entry point, so unlike vite these can be
# named rather than found.
for f in index.html main.js main.css; do
  [ -f "$DIR/$f" ] || { echo "missing $f: the site is not a complete directory" >&2; exit 1; }
done

grep -q 'src="main.js"' "$DIR/index.html" || { echo "the page does not load the bundle" >&2; exit 1; }
grep -q 'href="main.css"' "$DIR/index.html" || { echo "the page does not load the stylesheet" >&2; exit 1; }

# The library the page draws itself from, reached by package name. Nothing is
# written into the HTML, so this string can only be in the bundle.
grep -q "js-bundler-rules" "$DIR/main.js" || { echo "@stack/layers never reached the bundle" >&2; exit 1; }
grep -q "byte-identical" "$DIR/main.js" || { echo "fact data missing from the bundle" >&2; exit 1; }

echo "ok"
