import { GlobalWorkerOptions } from 'pdfjs-dist'
// The app build aliases 'pdfjs-dist' to its LEGACY build (transpiled + self-polyfilled for older
// browsers). We wire the matching LEGACY worker here via `?url`, so the bundler emits it as an asset
// against the app's `base` and pdf.js spawns the worker itself. The worker bundle self-polyfills its
// own global scope, so older browsers (e.g. the Chrome 125 fleet) no longer crash on Promise.try /
// Uint8Array.toHex / Float16Array.
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'

// The PDF.js worker only needs to be wired once per session.
let isWorkerConfigured = false

/**
 * Points PDF.js at its worker bundle. Idempotent, so every PDF.js consumer (text extraction,
 * document viewers, …) can call it freely and the worker setup stays in a single place.
 */
export const configurePdfWorker = (): void => {
  if (isWorkerConfigured) {
    return
  }
  GlobalWorkerOptions.workerSrc = pdfWorkerUrl
  isWorkerConfigured = true
}
