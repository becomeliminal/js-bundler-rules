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

## Type-checking is a separate target

Neither bundler type-checks. vite transpiles TypeScript with esbuild, which
strips types without reading them, so a type error reaches the bundle having
failed no build — verified, not assumed: `//test/vite/app:app` builds cleanly
from sources that `//test/vite/app:typecheck` rejects.

So an application carries both, and they are different failures over different
inputs: a type error is no reason to invalidate a bundle's cache, and a changed
asset is no reason to type-check again. `tsc && vite build` draws the same line
by hand.
