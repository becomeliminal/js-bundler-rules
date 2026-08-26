#!/bin/sh
set -eu
DIR=test/js/vite/app

JS=$(find "$DIR/assets" -name "index-*.js" | head -1)
[ -n "$JS" ] || { echo "no content-hashed bundle" >&2; exit 1; }
grep -q "$(basename "$JS")" "$DIR/index.html" \
  || { echo "index.html does not reference the bundle" >&2; exit 1; }

# JSX was transformed without a word of TypeScript involved.
grep -q "createRoot" "$JS" || { echo "react-dom missing" >&2; exit 1; }
grep -q "Hello, " "$JS" || { echo "@test/greeter never reached the bundle" >&2; exit 1; }

echo "ok"
