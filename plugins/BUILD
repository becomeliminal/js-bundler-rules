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
    revision = "d11d38945b87e2d6132da6fb537419a68f0e4c0b",
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
    revision = "fa3818a",
)
