# js-bundler-rules

Layer 3 of a JavaScript stack for the [Please](https://please.build) build system:

| layer | repo | provides |
|---|---|---|
| 0 | [node-rules](https://github.com/becomeliminal/node-rules) | a pinned, hermetic node |
| 1 | [js-rules](https://github.com/becomeliminal/js-rules) | packages, `node_modules`, running programs |
| 2 | [ts-rules](https://github.com/becomeliminal/ts-rules) | compiling and type-checking TypeScript |
| 3 | **js-bundler-rules** | `esbuild_bundle`, `vite_bundle`, `rollup_bundle`, `webpack_bundle`, `terser_minified`, `vitest_test`, `vite_dev` |

## Regenerating a lockfile

Each tree under `third_party/js/` has an `npm_update` target, and that is the
one sanctioned way its lockfile and generated `BUILD` change: edit the tree's
`package.json`, then

```sh
plz run //third_party/js:update-react
```

It drives pnpm through the corepack inside the pinned node toolchain --
nothing installed -- then regenerates the `BUILD`. Policy flags (react's
`--hoisted-link`, which vite_dev's symlink-free layout needs) are recorded on
the target, so every repin applies the same policy.

## Layout

```
third_party/js/
  esbuild/   the bundler this plugin pins, overridable by the Esbuild config key
  terser/    the minifier this plugin pins, for the same reason
  react/     the consumer's tree: vite, react, rollup, webpack, vitest, jsdom
  tiny/      one zero-dependency package, for the smallest third-party case

test/
  lib/       first-party libraries every fixture shares
  js/        fixtures whose sources are plain JavaScript
    esbuild/
    vite/    app, library mode, multi-page, snapshots
    rollup/
    webpack/
    terser/
  ts/        fixtures whose sources are TypeScript
    esbuild/  including tsconfig path aliases
    vite/    app, SSR, the HMR dev server
```

Split by language before bundler, because that is the axis where a bundler
behaves differently. `@vitejs/plugin-react` transforming a `.jsx` is a different
path from the same plugin transforming a `.tsx`, and a repo that has not adopted
TypeScript should not have to write its build config in it -- `test/js/vite`
uses a `vite.config.js`. Splitting this way makes a missing combination visible
as an empty directory; the one that was missing when this split was made was
exactly vite with plain JavaScript.

esbuild and terser are pinned by this plugin; **vite, rollup and webpack are
pinned by the consumer**. That asymmetry is deliberate: their configs import
plugins and loaders, and a plugin has to match the major it is loaded into, so
a plugin-owned copy would silently mismatch whatever the consumer pinned.
esbuild and terser have no such ecosystem, which is the only reason this
plugin can own those two.

## The dependency boundary, proven

Nothing in this stack reimplements module resolution: each bundler resolves
imports itself, against the `node_modules` the build assembled from declared
deps. `test/verify_boundary.sh` proves the consequence across five
independent resolvers -- esbuild, rollup, webpack, vite and vitest: remove a
declared dep and every tool's own resolution fails, restore it and every one
succeeds. Native semantics, graph discipline.

## A bundle cannot be built from TypeScript nothing checks

Neither bundler reads types. vite transpiles with esbuild and esbuild strips
them without looking, so a type error reaches the output having failed no build.

Both rules therefore refuse to parse if any source is TypeScript and `check` is
absent:

```
vite_bundle app: src/App.tsx is TypeScript and nothing checks it. This bundler
strips types without reading them, so a type error here would reach the output
having failed no build. Pass check = ":typecheck" naming a ts_check over these
sources, or check = False to say you meant it.
```

`check` names a `ts_check` and becomes a dependency of the bundle, so the bundle
cannot be produced while the check fails. `check = False` bundles unchecked
TypeScript deliberately.

They stay **two actions**, because they are different failures over different
inputs: a type error is no reason to invalidate a bundle's cache, and a changed
asset is no reason to type-check again. Only the edge between them is enforced.

This follows every other language's binary rule rather than the bundler's own
behaviour — `go_binary` cannot emit a binary from code that does not compile,
and neither can cargo. The JavaScript convention agrees, it is just spelled in a
package.json: `tsc -b && vite build` is what vite's own React template ships,
and a developer running `npm run build` experiences it as one thing.

Aspect leaves this open — their esbuild example bundles an `index.ts` with
nothing checking it. Their intended wiring puts a `ts_project` upstream so the
check gates because the JavaScript itself comes out of tsc, which works for
esbuild and cannot work for vite, whose plugins need the original `.tsx`.
