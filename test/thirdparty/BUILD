subinclude("//build_defs:bundler", "///js//build_defs:js")

# An application bundle: one third-party package from a lockfile, one
# first-party library, in one bundle. This is what anyone bundling a real app
# actually has, and it is the case esbuild_bundle cannot currently serve --
# node_modules names the tree the sources resolve through, and esbuild lives in
# a different one.
esbuild_bundle(
    name = "bundle",
    entry_point = "main.js",
    out = "bundle.js",
    deps = ["//test/bundle/lib/greeter"],
    node_modules = "//third_party/js/consumer:node_modules",
    format = "cjs",
    platform = "node",
)

js_test(
    name = "bundle_test",
    entry_point = ":bundle",
)
