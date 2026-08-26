// Required by the config, not by any bundled module -- the file that proves
// config_deps is genuinely staged. If it were missing, the config itself
// would fail to load, before webpack read a single entry.
module.exports = "assembled by webpack_bundle";
