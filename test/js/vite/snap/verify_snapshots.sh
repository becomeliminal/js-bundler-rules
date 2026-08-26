#!/bin/sh
# The developer round trip for snapshot updating, as the steps a person types.
# Not a plz test and cannot be: the update target writes to the source tree,
# which is its entire job.
set -eu
cd "$(git rev-parse --show-toplevel)"

SNAP=test/js/vite/snap/__snapshots__/receipt.test.js.snap

echo "1) the committed snapshot passes"
plz test //test/js/vite/snap:snap_test

echo "2) change the code; the test must fail against the stale snapshot"
sed -i 's/`${n + 1}\. ${item}`/`${n + 1}) ${item}`/' test/js/vite/snap/receipt.js
if plz test //test/js/vite/snap:snap_test 2>/dev/null; then
    echo "FAIL: a stale snapshot passed" >&2; exit 1
fi

echo "3) the test target never writes: the source snapshot is untouched"
grep -q '1\. tea' "$SNAP" || { echo "FAIL: the test rewrote the snapshot" >&2; exit 1; }

echo "4) the update target is the one sanctioned writer"
plz run //test/js/vite/snap:update
grep -q '1) tea' "$SNAP" || { echo "FAIL: update did not rewrite the snapshot" >&2; exit 1; }

echo "5) the test passes against the rewritten snapshot"
plz test //test/js/vite/snap:snap_test

echo "6) put it all back"
sed -i 's/`${n + 1}) ${item}`/`${n + 1}. ${item}`/' test/js/vite/snap/receipt.js
plz run //test/js/vite/snap:update
plz test //test/js/vite/snap:snap_test

echo "ok: the snapshot round trip holds"
