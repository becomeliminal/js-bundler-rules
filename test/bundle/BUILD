subinclude("//build_defs:bundler", "///js//build_defs:js")

# The falsification test. main.js imports one first-party library, which imports
# another; only the first is named here. If the tree esbuild resolves through is
# wrong in any way this fails immediately, which is the cheapest place to find
# out.
esbuild_bundle(
    name = "bundle",
    entry_point = "main.js",
    out = "bundle.js",
    deps = ["//test/bundle/lib/shouter"],
    format = "cjs",
    platform = "node",
)

# A bundle is only a bundle if it runs. Depends on nothing but the output, so
# anything the bundler failed to inline surfaces here as a missing module.
js_test(
    name = "bundle_test",
    entry_point = ":bundle",
)
