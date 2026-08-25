subinclude("//build_defs:bundler", "///js//build_defs:js")

# A browser bundle, which is the case the first fixture does not cover: several
# outputs rather than one, CSS pulled in by an import rather than named, and
# TypeScript with no compiler anywhere -- esbuild strips the types itself.
esbuild_bundle(
    name = "app",
    entry_point = "main.ts",
    out_dir = "dist",
    srcs = ["styles.css"],
    deps = ["//test/site/layers"],
    format = "esm",
    minify = True,
    platform = "browser",
    target = "es2022",
)

# esbuild has no HTML entry point -- it bundles modules, not pages -- so the
# page is assembled separately. That is not a gap to paper over: it is most of
# why vite exists, and this rule is the shape of the thing vite replaces.
#
# The substitution runs through node rather than sed because the bundle is
# arbitrary minified JavaScript, and every shell tool that edits text in place
# has characters it treats as syntax.
genrule(
    name = "site",
    srcs = {
        "html": ["index.html"],
        "bundle": [":app"],
    },
    outs = ["site.html"],
    # out_dir hoists: Please lifts the directory's contents into the output
    # root, so this receives main.js and main.css rather than a dist/. They are
    # picked by extension because esbuild names them after the entry point.
    cmd = " && ".join([
        'CSS=$(for f in $SRCS_BUNDLE; do case "$f" in *.css) echo "$f";; esac; done | head -1)',
        'JS=$(for f in $SRCS_BUNDLE; do case "$f" in *.js) echo "$f";; esac; done | head -1)',
        " ".join([
            '"$TOOLS_NODE" -e',
            """'const f=require("fs"),p=process.argv;""",
            """const rd=(x)=>f.readFileSync(x,"utf8");""",
            """f.writeFileSync(p[4], rd(p[1])""",
            """.replace("/*__CSS__*/", () => rd(p[2]))""",
            """.replace("/*__JS__*/", () => rd(p[3])))'""",
            '"$SRCS_HTML" "$CSS" "$JS" "$OUT"',
        ]),
    ]),
    tools = {"node": ["//third_party/node:node|node"]},
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
