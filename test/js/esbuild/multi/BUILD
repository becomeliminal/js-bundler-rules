subinclude("//build_defs:bundler", "///js//build_defs:js")

# Two entry points into one bundle graph, sharing a library. One invocation
# with two entries splits the shared code once; two invocations would each
# carry their own copy, which is the reason entry_points exists at all.
esbuild_bundle(
    name = "bundle",
    entry_points = [
        "page_a.js",
        "page_b.js",
    ],
    out_dir = "dist",
    deps = ["//test/lib/greeter"],
    format = "esm",
    metafile = True,
    sources_content = False,
    sourcemap = "linked",
    splitting = True,
)

js_test(
    name = "multi_test",
    srcs = ["multi.test.js"],
    data = [":bundle"],
)
