#!/bin/sh
set -eu
# :app and :app_twin, two builds in one package: each output is its own
# directory, whole.
for DIR in test/js/vite/app/dist test/js/vite/app/twin; do
  JS=$(find "$DIR/assets" -name "index-*.js" | head -1)
  [ -n "$JS" ] || { echo "no content-hashed bundle in $DIR" >&2; exit 1; }
  grep -q "$(basename "$JS")" "$DIR/index.html" \
    || { echo "$DIR/index.html does not reference the bundle" >&2; exit 1; }

  # JSX was transformed without a word of TypeScript involved.
  grep -q "createRoot" "$JS" || { echo "react-dom missing from $DIR" >&2; exit 1; }
  grep -q "Hello, " "$JS" || { echo "@test/greeter never reached $DIR" >&2; exit 1; }
done

echo "ok"
