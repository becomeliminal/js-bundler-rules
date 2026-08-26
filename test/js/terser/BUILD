subinclude("//build_defs:bundler", "///js//build_defs:js")

esbuild_bundle(
    name = "bundle",
    entry_point = "entry.js",
    out = "bundle.js",
    platform = "node",
    deps = ["//test/lib/greeter"],
)

# The second pass: consumes the bundle above, not sources. Its output is a
# directory, so min/bundle.js sits beside bundle.js without colliding.
terser_minified(
    name = "min",
    srcs = [":bundle"],
)

# The other input shape: a bundler that emitted a directory of files. Every
# .js among them is minified at its own relative path under min_many/.
esbuild_bundle(
    name = "chunks",
    srcs = glob(["src/*.js"]),
    out_dir = "dist",
    entry_points = [
        "src/alpha.js",
        "src/beta.js",
    ],
    format = "cjs",
    platform = "node",
)

terser_minified(
    name = "min_many",
    srcs = [":chunks"],
)

js_test(
    name = "minified_test",
    srcs = ["check_minified.test.js"],
    data = [
        ":bundle",
        ":chunks",
        ":min",
        ":min_many",
    ],
)
