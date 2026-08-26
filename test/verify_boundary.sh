#!/bin/sh
# The dependency boundary, proven at the filesystem level.
#
# Nothing here reimplements module resolution: each bundler resolves
# "@test/greeter" itself, against the node_modules the build assembled. The
# boundary holds because an undeclared dependency was never staged -- so
# removing the dep from the BUILD file must make every tool's OWN resolver
# fail, and restoring it must make every one succeed. Native semantics,
# graph discipline.
#
# Not a plz test: it edits BUILD files and restores them. Run from anywhere
# inside the repo.
set -eu
cd "$(git rev-parse --show-toplevel)"

DEP='"//test/lib/greeter"'

check() { # $1 tool name, $2 BUILD file, $3 plz verb, $4 target
    build=$2; verb=$3; target=$4
    # build caches by hash, test caches results: each needs its own force flag
    flag=--rebuild; [ "$verb" = test ] && flag=--rerun
    cp "$build" "$build.bak"
    # drop the greeter dep from the named file, and prove the edit landed --
    # a pattern that silently matched nothing would "pass" by testing nothing
    sed -i "s|$DEP||" "$build"
    if grep -qF "$DEP" "$build"; then
        mv "$build.bak" "$build"
        echo "FAIL: could not remove the dep from $build" >&2
        exit 1
    fi
    if plz "$verb" "$flag" "$target" >/dev/null 2>&1; then
        mv "$build.bak" "$build"
        echo "FAIL: $1 resolved @test/greeter without the dep declared" >&2
        exit 1
    fi
    mv "$build.bak" "$build"
    plz "$verb" "$flag" "$target" >/dev/null 2>&1 || {
        echo "FAIL: $1 does not build with the dep restored" >&2; exit 1; }
    echo "ok: $1 fails without the dep, succeeds with it"
}

check esbuild test/js/terser/BUILD   build //test/js/terser:bundle
check rollup  test/js/rollup/BUILD   build //test/js/rollup:bundle
check webpack test/js/webpack/BUILD  build //test/js/webpack:bundle
check vite    test/js/vite/app/BUILD build //test/js/vite/app:app
check vitest  test/js/vite/app/BUILD test  //test/js/vite/app:unit_test

echo "ok: the boundary holds across five independent resolvers"
