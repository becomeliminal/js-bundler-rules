# js-bundler-rules

Layer 3 of a JavaScript stack for the [Please](https://please.build) build system:

| layer | repo | provides |
|---|---|---|
| 0 | [node-rules](https://github.com/becomeliminal/node-rules) | a pinned, hermetic node |
| 1 | [js-rules](https://github.com/becomeliminal/js-rules) | packages, `node_modules`, running programs |
| 2 | [ts-rules](https://github.com/becomeliminal/ts-rules) | compiling and type-checking TypeScript |
| 3 | **js-bundler-rules** | `esbuild_bundle`, `vite_bundle` |

## Regenerating a lockfile

Lockfiles are maintained by pnpm, the way `go.mod` is maintained by `go`. This
does not need pnpm installed: corepack ships inside the node toolchain this repo
already pins, so the same node the build uses can drive it.

```sh
plz build //third_party/node:node
N=$PWD/plz-out/bin/third_party/node/node
cd third_party/js/<tree>
COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  "$N/bin/node" "$N/lib/node_modules/corepack/dist/corepack.js" pnpm install --lockfile-only
cd -
plz run ///js//tools/please_js -- update \
  --lockfile third_party/js/<tree>/pnpm-lock.yaml \
  --out third_party/js/<tree>/BUILD \
  --lock-label pnpm-lock.yaml
```

These instructions live here rather than in a comment at the top of the lockfile
because **pnpm strips comments whenever it rewrites one**.

## Layout

```
third_party/js/
  esbuild/   the bundler this plugin pins, overridable by the Esbuild config key
  react/     an application's tree: vite, react, react-router, and their types
  tiny/      one zero-dependency package, for the smallest third-party case

test/
  lib/       first-party libraries every fixture shares
  esbuild/   what esbuild_bundle is tested against
  vite/      what vite_bundle is tested against
```

esbuild is pinned by this plugin; **vite is pinned by the consumer**. That
asymmetry is deliberate: a `vite.config.ts` imports plugins, and a plugin has to
match the vite major it is loaded into, so a plugin-owned vite would silently
mismatch whatever `@vitejs/plugin-react` a consumer pinned. esbuild has no such
ecosystem, which is the only reason this plugin can own that one.

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
