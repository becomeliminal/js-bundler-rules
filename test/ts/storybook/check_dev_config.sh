#!/bin/sh
# storybook_dev's generated config lists what each case branch produces: the
# scope negation for a scoped workspace package, scoped dependencies one level
# down, and plain ones as they are.
set -u
config=test/ts/storybook/_dev.storybook/main.mjs
fail=0

has() { # description, fixed string expected in the config
    if grep -qF -- "$2" "$config"; then
        echo "ok    $1"
    else
        echo "FAIL  $1: $2 not in $config"
        fail=1
    fi
}

# GIVEN storybook_dev's config, generated from a tree holding @test/* workspace
# packages, a scoped dependency (@playwright/test) and a plain one (react)
# WHEN the IGNORE and DIRECT lists in it are read
# THEN each case branch contributed its entry
has "IGNORE negates a scoped package's scope directory" "'!**/node_modules/@test',"
has "DIRECT lists a scoped dependency by its full name" "'@playwright/test',"
has "DIRECT lists a plain dependency" "'react',"
# AND a scope directory never stands in for its packages
if grep -E '^const DIRECT' "$config" | grep -qF -- "'@playwright',"; then
    echo "FAIL  DIRECT lists the bare scope @playwright"
    fail=1
else
    echo "ok    DIRECT never lists a bare scope"
fi

exit $fail
