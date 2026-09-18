# image-size (stub)

Local replacement for the `image-size` npm package, wired in through the root
`overrides` field:

```json
"overrides": {
  "image-size": "file:packages/@stubs/image-size"
}
```

## Why

`@pulse/key-moments` depends on `pptxgenjs` to build the PowerPoint export, and
`pptxgenjs@4.0.1` declares `image-size@^1.2.1` as a runtime dependency. That
package carries two high-severity advisories:

| Advisory | CVE | Flaw |
| --- | --- | --- |
| [GHSA-w3rx-r6r6-pgpr](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr) | CVE-2025-71330 | ICNS parser hangs on a zero-valued entry length |
| [GHSA-5p2g-fcmc-qvqq](https://github.com/advisories/GHSA-5p2g-fcmc-qvqq) | CVE-2025-71329 | JXL and HEIF parsers hang on a zero-valued box size |

Neither can be fixed by upgrading. `image-size@2.0.2` is the last version ever
published, the advisory range is `<=2.0.2`, and the repository was archived in
June 2026 with its issue tracker disabled. `npm audit fix --force` only offers a
downgrade to `pptxgenjs@1.1.5`, three majors back, which would delete the export
feature.

## Why stubbing is safe here

`image-size` is never loaded by the code we ship:

- `pptxgenjs/package.json` declares `"browser": { "image-size": false }`, so a
  Vite build resolves it to an empty module;
- none of the published bundles (`pptxgen.es.js`, `pptxgen.cjs.js`,
  `pptxgen.bundle.js`, `pptxgen.min.js`) contains a single reference to it;
- we import pptxgenjs through a dynamic import in the browser only, from
  `packages/applets/key-moments/src/export/export.manager.ts`.

Upstream reached the same conclusion: PptxGenJS
[issue #1474](https://github.com/gitbrent/PptxGenJS/issues/1474) reports the
dependency as declared but absent from every bundle, and
[PR #1473](https://github.com/gitbrent/PptxGenJS/pull/1473) removes it with a
byte-identical dist. Both were opened on 2026-08-09 and are still awaiting a
maintainer.

The stub version is `1.2.2`, which has to stay inside the `^1.2.1` range
pptxgenjs asks for: npm validates an overridden `file:` target against the
original range, and a version outside it is reported as `invalid`, fails
`npm ls` with `ELSPROBLEMS`, and gets silently replaced by the registry package.
The number is not what clears the audit — a `file:` link carries no registry
identity, so it is never submitted to the advisory endpoint.

## If the lockfile ever loses the link

npm does not re-evaluate a dependency edge the lockfile already satisfies, so
adding the override alone changes nothing on an existing `package-lock.json` —
not even with `npm install --force`. Deleting the `node_modules/image-size`
entry makes npm drop the package instead of linking the stub, and regenerating
the whole lockfile with `--package-lock-only` produces entries stripped of their
`resolved`/`integrity` fields. The two entries below have to be written by hand,
then reified with a plain `npm install`:

```json
"node_modules/image-size": {
  "resolved": "node_modules/pptxgenjs/packages/@stubs/image-size",
  "link": true
},
"node_modules/pptxgenjs/packages/@stubs/image-size": {}
```

That `resolved` path is how npm itself records a `file:` override — it looks
wrong, but `npm ci` reads it correctly and produces
`node_modules/image-size -> ../packages/@stubs/image-size`.

## When to remove this

Drop the override and this folder once PptxGenJS releases a version without the
dependency — watch PR #1473. `npm ls image-size` should then return nothing.

Do **not** replace it with `image-size-next`: that fork is days old, has a
single anonymous maintainer, and publishes a `legacy` dist-tag shaped to slip
into the `^1.2.1` range that pptxgenjs asks for.
