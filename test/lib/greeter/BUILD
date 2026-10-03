subinclude("///ts//build_defs:ts")

# A ts_library rather than a js_library, which is the point of having ts-rules
# at all: everything that imports this is checked against the declarations the
# compiler emits, rather than against nothing.
ts_library(
    name = "greeter",
    package = "@test/greeter",
    srcs = [
        "index.ts",
        "parts/punctuation.ts",
    ],
    # Copied into the package as is: test/ts/vite/app's CSS @imports it.
    assets = ["greeter.css"],
    tsconfig_deps = ["//:tsconfig.json"],
    visibility = ["//test/..."],
)
