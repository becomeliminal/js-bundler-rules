subinclude("//build_defs:bundler", "///js//build_defs:js", "///ts//build_defs:ts")

# A browser bundle, which is the case the first fixture does not cover: several
# outputs rather than one, CSS pulled in by an import rather than named, and
# TypeScript with no compiler anywhere -- esbuild strips the types itself.
esbuild_bundle(
    name = "app",
    entry_point = "main.ts",
    out_dir = "dist",
    srcs = ["styles.css"],
    deps = ["//test/lib/layers"],
    check = ":typecheck",
    format = "esm",
    minify = True,
    platform = "browser",
    target = "es2022",
)

# main.ts is TypeScript, and esbuild strips types without reading them, so this
# is what stands between a type error and the bundle.
ts_check(
    name = "typecheck",
    srcs = [
        "env.d.ts",
        "main.ts",
    ],
    deps = ["//test/lib/layers"],
    tsconfig_deps = ["//:tsconfig.json"],
)

# A site is a directory you serve: the bundle, plus the page that loads it.
# Nothing assembles them, because nothing needs assembling -- index.html names
# esbuild's output directly, and esbuild names its output after the entry point.
#
# esbuild genuinely has no HTML entry, and that is one of the reasons vite
# exists. But the gap is that nobody rewrites the script tag when a filename
# content-hashes, which is a vite problem and not an esbuild one: esbuild's
# names are stable, so a static page is the whole answer here.
filegroup(
    name = "site",
    srcs = [
        "index.html",
        ":app",
    ],
    visibility = ["PUBLIC"],
)

# The page is drawn entirely at runtime, so the only thing the build can assert
# is that the bundle carries the data it draws from. If esbuild had left the
# import unresolved this string would not be here.
build_rule(
    name = "site_test",
    srcs = ["check_site.sh"],
    data = [":site"],
    outs = ["site_test"],
    cmd = "cp $SRCS $OUT",
    binary = True,
    test = True,
    no_test_output = True,
    test_cmd = "$TEST",
)
