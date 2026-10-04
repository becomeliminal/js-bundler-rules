subinclude("///ts//build_defs:ts")

# A first-party library importing a CommonJS subpath of a third-party package
# that the application never imports itself. Only the development server can
# get this wrong: a first-party library is excluded from vite's prebundling,
# so the optimizer never sees what it imports, and a CommonJS module served
# raw has no named exports for the browser to link. vite_bundle and vitest
# convert CommonJS themselves. test/ts/vite/app/verify_hmr.sh checks the dev
# server serves it prebundled.
ts_library(
    name = "compiled",
    package = "@test/compiled",
    srcs = ["index.ts"],
    node_modules = "//third_party/js/react:node_modules",
    tsconfig_deps = ["//:tsconfig.json"],
    visibility = ["//test/..."],
)
