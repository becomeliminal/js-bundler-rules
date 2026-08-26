subinclude("///js//build_defs:npm")

# The one sanctioned way each tree's lockfile and BUILD change: edit the
# tree's package.json, then `plz run` the matching target here.
# react/ is an application's tree, and vite is pinned there rather than by
# this plugin -- the one place the ts-rules Compiler pattern does not carry
# over: a vite.config.ts imports plugins, and a plugin has to match the vite
# major it is loaded into. esbuild and terser have no such ecosystem, so the
# plugin owns those pins instead. --hoisted-link because vite_dev needs the
# layout with no symlinks in it.
npm_update(
    name = "update-react",
    args = ["--hoisted-link"],
    dir = "third_party/js/react",
)

npm_update(
    name = "update-terser",
    dir = "third_party/js/terser",
)
