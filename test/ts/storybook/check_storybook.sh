#!/bin/sh
set -eu

DIR=test/ts/storybook/storybook-static

fail() { echo "$1" >&2; exit 1; }

[ -f "$DIR/index.html" ] || fail "no Storybook manager page in $DIR"
[ -f "$DIR/iframe.html" ] || fail "no preview iframe in $DIR"

# Storybook's own index of what it built: both stories, and the autodocs page.
for id in greeting--quiet greeting--loud greeting--docs; do
  grep -q "\"$id\"" "$DIR/index.json" || fail "index.json is missing $id"
done

# The prop table, from react-docgen-typescript: the TypeScript compiler read
# the props' doc comments, which only it does.
grep -rq "GREETING_PROP_DOC_MARKER" "$DIR/assets" || fail "no docgen prop descriptions in the build"

# The first-party library, reached by package name through the tree.
grep -rq "Hello, " "$DIR/assets" || fail "@test/greeter never made it into the build"

# The preview's stylesheet, imported through the vite config's "@" alias:
# Storybook merged the project's vite config.
grep -rq "STORYBOOK_CSS_MARKER" "$DIR/assets" || fail "the preview's stylesheet is missing: the vite config was not merged"
