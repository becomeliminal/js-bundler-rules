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
    # Pinned past link-sources (vite_dev's sources and first-party libraries
    # are linked from one spec whose live directories its watcher keeps in
    # step) and past the macOS package-root fix (#107: BSD wc pads its count,
    # so @types/* landed a directory too deep on a Mac).
    revision = "3cc69ed5d50392968f3c98100063b280aeb64fd4",
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
    revision = "e40bf491d486a738f840a3716e538093e89549c2",
)
