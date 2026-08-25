// vite ships declarations for this (vite/client); esbuild ships none, so a
// project bundling CSS with esbuild has to say what a stylesheet import is.
// That difference is small and worth knowing: it is the kind of thing a
// framework provides and a bundler does not.
declare module "*.css";
