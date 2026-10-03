#!/bin/sh
set -eu
DIR=test/ts/astro/site/dist

[ -f "$DIR/index.html" ] || { echo "no index.html in $DIR" >&2; exit 1; }
grep -q "<title>astro_build</title>" "$DIR/index.html" \
  || { echo "the page was not rendered" >&2; exit 1; }
# The library, imported by package name, was bundled into the page's script.
grep -rq "Hello, " "$DIR" \
  || { echo "@test/greeter never reached the site's scripts" >&2; exit 1; }
# Its stylesheet, imported by package name, reached the site's CSS.
grep -rq "GREETER_CSS_MARKER" "$DIR" \
  || { echo "@test/greeter/greeter.css never reached the site" >&2; exit 1; }
grep -q "ASTRO_PUBLIC_MARKER" "$DIR/marker.txt" \
  || { echo "public/ was not copied" >&2; exit 1; }

echo "ok"
