subinclude("//build_defs:bundler", "///js//build_defs:js")

# The committed snapshot is a source and an input: without it the test fails
# rather than silently writing one into the sandbox, which is what CI mode is
# for. verify_snapshots.sh walks the whole round trip by hand.
vitest_test(
    name = "snap_test",
    srcs = [
        "receipt.js",
        "receipt.test.js",
    ] + glob(["__snapshots__/*.snap"], allow_empty = True),
    config = "vite.config.js",
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)

# The one sanctioned writer. `plz run //test/js/vite/snap:update` after a
# deliberate change to receipt.js, then review the snapshot diff like any
# other diff.
vitest_update(
    name = "update",
    srcs = [
        "receipt.js",
        "receipt.test.js",
    ],
    config = "vite.config.js",
    deps = ["//test/lib/greeter"],
    node_modules = "//third_party/js/react:node_modules",
)
