// `pdfjs-dist` and the legacy worker asset are mocked: the worker is a heavy `?url` asset that
// cannot be resolved in the node test environment, and we only care that the util wires the
// worker source exactly once.
vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
}))

vi.mock('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url', () => ({
  default: 'mocked-pdf-worker-url',
}))

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
