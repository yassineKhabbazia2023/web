import { fileURLToPath, URL } from 'node:url'
import type { Alias } from 'vite'

// Single source of truth for the pdf.js LEGACY build alias, shared by the app build
// (vite.config.app.ts) and Storybook (.storybook/main.ts) so previews exercise the exact same
// build that ships to users. The legacy build is transpiled and self-polyfilled (core-js +
// Float16Array) for older browsers, where the default build crashes on Promise.try /
// Uint8Array.toHex / Float16Array (e.g. the Chrome 125 fleet).
//
// Exact match only, so the worker subpath (pdfjs-dist/legacy/build/pdf.worker.min.mjs?url) is
// untouched — it is already pinned to the legacy build directly in pdf-worker.utils.ts. Skip this
// alias under Vitest, which mocks 'pdfjs-dist' directly.
export const pdfjsLegacyAlias: Alias = {
  find: /^pdfjs-dist$/,
  replacement: fileURLToPath(
    new URL('../../node_modules/pdfjs-dist/legacy/build/pdf.min.mjs', import.meta.url),
  ),
}
