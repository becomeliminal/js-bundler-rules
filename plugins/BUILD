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
    # Pinned past link-sources: vite_dev's sources and first-party libraries
    # are linked from one spec whose live directories its watcher keeps in
    # step, and a run never resolves its tree from the source tree.
    revision = "9700302af5a76d6925b21d53865935aa62bef01b",
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
    revision = "3d644edfc178793389598922f4741ee4c65374bc",
)
