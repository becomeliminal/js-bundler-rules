subinclude("//build_defs:bundler", "///js//build_defs:js")

# A real React application. Three things happen here that esbuild_bundle cannot
# do: an index.html is the entry rather than a module, a config file is read and
# loads a plugin from the consumer's tree, and the output filenames are content
# hashed so none of them can be declared.
vite_bundle(
    name = "app",
    srcs = [
        "index.html",
        "src/App.tsx",
        "src/data.ts",
        "src/main.tsx",
        "src/styles.css",
    ],
    deps = ["//test/bundle/lib/greeter"],
    node_modules = "//third_party/js/app:node_modules",
)

build_rule(
    name = "app_test",
    srcs = ["check_app.sh"],
    data = [":app"],
    outs = ["app_test"],
    cmd = "cp $SRCS $OUT",
    binary = True,
    test = True,
    no_test_output = True,
    test_cmd = "$TEST",
)

# Inlined into one file, which is not what a real deployment does -- vite splits
# JS and CSS on purpose so a browser can cache them apart. It is what a page has
# to be to travel as a single artifact, and it proves the output is complete:
# nothing left to fetch means nothing was left behind.
genrule(
    name = "single_file",
    srcs = {"bundle": [":app"]},
    outs = ["app.html"],
    cmd = " && ".join([
        'HTML=$(for f in $SRCS_BUNDLE; do case "$f" in *index.html) echo "$f";; esac; done | head -1)',
        'JS=$(find $SRCS_BUNDLE -name "*.js" 2>/dev/null | head -1)',
        'CSS=$(find $SRCS_BUNDLE -name "*.css" 2>/dev/null | head -1)',
        " ".join([
            '"$TOOLS_NODE" -e',
            """'const f=require("fs"),p=process.argv;""",
            """const rd=(x)=>x&&f.existsSync(x)?f.readFileSync(x,"utf8"):"";""",
            """let h=rd(p[1]);""",
            """h=h.replace(/<script type="module"[^>]*><\\/script>/, () => "<script type=\\"module\\">"+rd(p[2])+"<\\/script>");""",
            """h=h.replace(/<link rel="stylesheet" crossorigin href="[^"]*">/, () => "<style>"+rd(p[3])+"<\\/style>");""",
            """f.writeFileSync(p[4], h)'""",
            '"$HTML" "$JS" "$CSS" "$OUT"',
        ]),
    ]),
    tools = {"node": ["//third_party/node:node|node"]},
    visibility = ["PUBLIC"],
)
