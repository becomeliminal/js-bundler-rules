const path = require("path");
const webpack = require("webpack");
// A local require from the config: the case config_deps exists for.
const banner = require("./banner.txt.js");

module.exports = {
  mode: "production",
  entry: "./entry.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: { type: "commonjs2" },
  },
  // The required value flows into the code itself, where minification cannot
  // drop it -- a banner comment would be extracted with the licenses.
  plugins: [new webpack.DefinePlugin({ __STAMP__: JSON.stringify(banner) })],
  devtool: false,
};
