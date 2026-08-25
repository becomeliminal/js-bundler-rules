#!/bin/sh
set -eu

SITE=test/site/site.html

grep -q "js-bundler-rules" "$SITE" || { echo "layer data missing: the bundle did not resolve @stack/layers" >&2; exit 1; }
grep -q "byte-identical" "$SITE" || { echo "fact data missing from the bundle" >&2; exit 1; }
grep -q "IBM+Plex" "$SITE" || { echo "the page shell was not assembled around the bundle" >&2; exit 1; }
grep -q "__CSS__" "$SITE" && { echo "stylesheet was never substituted in" >&2; exit 1; }
grep -q "__JS__" "$SITE" && { echo "bundle was never substituted in" >&2; exit 1; }

echo "ok"
