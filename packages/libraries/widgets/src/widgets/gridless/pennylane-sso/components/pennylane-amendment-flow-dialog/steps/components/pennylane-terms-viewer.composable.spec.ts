import { ref, nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import { usePennylaneTermsViewer } from './pennylane-terms-viewer.composable'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { PennylaneTermsViewerManager } from './pennylane-terms-viewer.manager'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/pennylane')
vi.mock('pdfjs-dist', () => ({ getDocument: vi.fn() }))
vi.mock('./pennylane-terms-viewer.manager')

describe('usePennylaneTermsViewer', () => {
  const mockPdfData = new Uint8Array([1, 2, 3, 4, 5])
  const mockPdfDocument = {
    numPages: 2,
    destroy: vi.fn(),
  }
  const mockPages = [
    { getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }) },
    { getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }) },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(PennylaneService.getTermsContent).mockResolvedValue(mockPdfData)
    vi.mocked(PennylaneTermsViewerManager.loadPdfDocument).mockResolvedValue(mockPdfDocument as any)
    vi.mocked(PennylaneTermsViewerManager.getAllPages).mockResolvedValue(mockPages as any)
    vi.mocked(PennylaneTermsViewerManager.calculateOptimalScale).mockReturnValue(1.2)
    vi.mocked(PennylaneTermsViewerManager.renderPageToCanvas).mockReturnValue({
      promise: Promise.resolve(),
      cancel: vi.fn(),
    } as any)
  })

  it('should load PDF on mount', async () => {
    const accountId = ref(123)
    const emit = vi.fn()

    const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

    expect(result.isLoading.value).toBe(true)

    await flushPromises()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(PennylaneService.getTermsContent).toHaveBeenCalledWith(123)
    expect(PennylaneTermsViewerManager.loadPdfDocument).toHaveBeenCalledWith(mockPdfData)
    expect(PennylaneTermsViewerManager.getAllPages).toHaveBeenCalledWith(mockPdfDocument)
    expect(result.numPages.value).toBe(2)
    expect(result.isLoading.value).toBe(false)

    app.unmount()
  })

  it('should set error when PDF loading fails', async () => {
    const accountId = ref(123)
    const emit = vi.fn()

    vi.mocked(PennylaneService.getTermsContent).mockRejectedValueOnce(new Error('Network error'))

    const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

    await flushPromises()

    expect(result.error.value).toBe('Unable to load document. Please try again.')
    expect(result.isLoading.value).toBe(false)
    expect(loggerErrorSpy).toHaveBeenCalled()

    app.unmount()
  })

  it('should reload PDF when accountId changes', async () => {
    const accountId = ref(123)
    const emit = vi.fn()

    const [_result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

    await flushPromises()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(PennylaneService.getTermsContent).toHaveBeenCalledTimes(1)

    accountId.value = 456
    await nextTick()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(PennylaneService.getTermsContent).toHaveBeenCalledTimes(2)
    expect(PennylaneService.getTermsContent).toHaveBeenCalledWith(456)

    app.unmount()
  })

  it('should emit scroll-complete when scrollToBottom is called', async () => {
    const accountId = ref(123)
    const emit = vi.fn()

    const [composableResult, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

    await flushPromises()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 250))

    const mockContainer = {
      scrollHeight: 1000,
      scrollTo: vi.fn(),
      removeEventListener: vi.fn(),
    }
    composableResult.pdfContainer.value = mockContainer as any

    composableResult.scrollToBottom()

    expect(mockContainer.scrollTo).toHaveBeenCalledWith({
      top: 1000,
      behavior: 'smooth',
    })

    await new Promise(resolve => setTimeout(resolve, 600))

    expect(emit).toHaveBeenCalledWith('scroll-complete')

    app.unmount()
  })

  it('should cleanup resources on unmount', async () => {
    const accountId = ref(123)
    const emit = vi.fn()

    const [_result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

    await flushPromises()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 250))

    app.unmount()

    expect(mockPdfDocument.destroy).toHaveBeenCalled()
  })

  it('should initialize numPages with correct value', async () => {
    const accountId = ref(123)
    const emit = vi.fn()

    const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

    await flushPromises()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(result.numPages.value).toBe(2)

    app.unmount()
  })

  describe('setCanvasRef', () => {
    it('should render page when canvas ref is set', async () => {
      const accountId = ref(123)
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 250))

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      expect(PennylaneTermsViewerManager.renderPageToCanvas).toHaveBeenCalled()

      app.unmount()
    })

    it('should not render page twice for the same index', async () => {
      const accountId = ref(123)
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 250))

      vi.mocked(PennylaneTermsViewerManager.renderPageToCanvas).mockClear()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)
      result.setCanvasRef(mockCanvas, 0)

      expect(PennylaneTermsViewerManager.renderPageToCanvas).toHaveBeenCalledTimes(1)

      app.unmount()
    })

    it('should do nothing when canvas is null', async () => {
      const accountId = ref(123)
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 250))

      vi.mocked(PennylaneTermsViewerManager.renderPageToCanvas).mockClear()

      result.setCanvasRef(null, 0)

      expect(PennylaneTermsViewerManager.renderPageToCanvas).not.toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('scrollToBottom', () => {
    it('should do nothing when pdfContainer is null', async () => {
      const accountId = ref(123)
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

      await flushPromises()

      result.pdfContainer.value = null
      result.scrollToBottom()

      expect(emit).not.toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('render error handling', () => {
    it('should handle render error gracefully', async () => {
      const accountId = ref(123)
      const emit = vi.fn()

      const renderError = new Error('Render failed')
      const rejectedPromise = Promise.reject(renderError)
      rejectedPromise.catch(() => {})

      vi.mocked(PennylaneTermsViewerManager.renderPageToCanvas).mockReturnValue({
        promise: rejectedPromise,
        cancel: vi.fn(),
      } as any)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 250))

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalled()

      app.unmount()
    })

    it('should not log error for RenderingCancelledException', async () => {
      const accountId = ref(123)
      const emit = vi.fn()

      const cancelError = new Error('Cancelled')
      cancelError.name = 'RenderingCancelledException'
      const rejectedPromise = Promise.reject(cancelError)
      rejectedPromise.catch(() => {})

      vi.mocked(PennylaneTermsViewerManager.renderPageToCanvas).mockReturnValue({
        promise: rejectedPromise,
        cancel: vi.fn(),
      } as any)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

      await flushPromises()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 250))

      loggerErrorSpy.mockClear()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      await flushPromises()

      expect(loggerErrorSpy).not.toHaveBeenCalledWith('Error rendering page:', expect.anything())

      app.unmount()
    })
  })

  describe('isAtBottom state', () => {
    it('should initialize isAtBottom as false', async () => {
      const accountId = ref(123)
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(accountId, emit))

      expect(result.isAtBottom.value).toBe(false)

      app.unmount()
    })
  })
})
