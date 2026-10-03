# js-rules builds its companion tool from source, so its Go plugin is needed
# here too. Worth removing later: rust-rules ships please_rust as a hash-pinned
# release download, and a from-source build also fails under remote execution.
plugin_repo(
    name = "go",
    revision = "v1.31.0",
)

plugin_repo(
    name = "js",
    owner = "becomeliminal",
    plugin = "js-rules",
    # Pinned past link-tree: runtimes and build actions link the tree rather
    # than copy it, which is what lets vite_dev run on the store layout.
    revision = "6e81489806e8edcbf3d9a99c946ffb71aab62669",
)

plugin_repo(
    name = "node",
    owner = "becomeliminal",
    plugin = "node-rules",
    revision = "v0.1.0",
)

plugin_repo(
    name = "ts",
    owner = "becomeliminal",
    plugin = "ts-rules",
    revision = "c0b36c80760a6fb2c91159bc23478b37250ffabf",
)
