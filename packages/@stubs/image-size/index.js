/**
 * pptxgenjs declares image-size as a runtime dependency but never loads it: its
 * own package.json maps the module to `false` in the "browser" field, and none
 * of its five dist bundles reference it.
 *
 * The real package cannot be patched — its repository is archived and both
 * GHSA-w3rx-r6r6-pgpr and GHSA-5p2g-fcmc-qvqq are published with no fixed
 * release — so it is replaced here rather than carried through the tree.
 *
 * Throwing rather than returning a size keeps the substitution honest: should
 * anything ever reach for it, it says so instead of reporting wrong dimensions.
 */
function imageSize() {
  throw new Error(
    'image-size is stubbed in this monorepo, see packages/@stubs/image-size/README.md',
  )
}

// image-size@1.x exposes a default export, image-size@2.x a named `imageSize`.
module.exports = imageSize
module.exports.default = imageSize
module.exports.imageSize = imageSize
