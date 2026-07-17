// `pdfjs-dist`, the legacy `?url` worker asset ('mocked-pdf-worker-url') and the
// spy-wrap of pdf-worker.utils itself are all hubbed in vitest.setup.ts (single
// shape for the project). The spy-wrap is real by default, so this own-spec
// exercises the real implementation through the shared wrapper.
describe('configurePdfWorker', () => {
  beforeEach(() => {
    // Reset the module-level `isWorkerConfigured` flag so each test exercises the util from a
    // clean slate, then re-import both the mock and the util from the fresh module registry.
    vi.resetModules()
  })

  it('points PDF.js at the legacy worker bundle on first call', async () => {
    const { GlobalWorkerOptions } = await import('pdfjs-dist')
    const { configurePdfWorker } = await import('./pdf-worker.utils')

    configurePdfWorker()

    expect(GlobalWorkerOptions.workerSrc).toBe('mocked-pdf-worker-url')
  })

  it('configures the worker only once', async () => {
    const { GlobalWorkerOptions } = await import('pdfjs-dist')
    const { configurePdfWorker } = await import('./pdf-worker.utils')

    configurePdfWorker()
    // A later actor (pdf.js itself, another consumer) changes the source; a second call must
    // not overwrite it, proving the setup is skipped once the worker is configured.
    GlobalWorkerOptions.workerSrc = 'changed-elsewhere'
    configurePdfWorker()

    expect(GlobalWorkerOptions.workerSrc).toBe('changed-elsewhere')
  })
})
