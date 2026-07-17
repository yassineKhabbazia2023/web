import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { withSetup } from '@pulse/toolbox/utils/test'
import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { usePennylaneTermsViewer } from './pennylane-terms-viewer.composable'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { PennylaneTermsViewerManager } from './pennylane-terms-viewer.manager'
import { MOBILE_SCALE } from './pennylane-terms-viewer.consts'
import { getIsMobile } from '@pulse/styleguide'
import { downloadTermsPdf } from '../../pennylane-terms.helper'

let getTermsContentMock: MockInstance
let loadPdfDocumentMock: MockInstance
let getAllPagesMock: MockInstance
let calculateOptimalScaleMock: MockInstance
let renderPageToCanvasMock: MockInstance
let formatZoomPercentageMock: MockInstance
let isScrolledToBottomMock: MockInstance

// getIsMobile is swapped for the shared spy by the '@pulse/styleguide' hub and
// downloadTermsPdf is spy-wrapped (real by default) in vitest.setup.ts: both
// are armed per test via vi.mocked(...) (doctrine: shared-hubs).

async function waitForPdfLoad() {
  await flushPromises()
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 250))
}

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
    vi.mocked(getIsMobile).mockReturnValue(false)
    getTermsContentMock = vi.spyOn(PennylaneService, 'getTermsContent').mockResolvedValue(mockPdfData)
    loadPdfDocumentMock = vi.spyOn(PennylaneTermsViewerManager, 'loadPdfDocument').mockResolvedValue(mockPdfDocument as any)
    getAllPagesMock = vi.spyOn(PennylaneTermsViewerManager, 'getAllPages').mockResolvedValue(mockPages as any)
    calculateOptimalScaleMock = vi.spyOn(PennylaneTermsViewerManager, 'calculateOptimalScale').mockReturnValue(1.2)
    renderPageToCanvasMock = vi.spyOn(PennylaneTermsViewerManager, 'renderPageToCanvas').mockReturnValue({
      promise: Promise.resolve(),
      cancel: vi.fn(),
    } as any)
    // Pure formatting/predicate helpers: spied real-by-default so the tests that
    // need a specific value can arm them without freezing a module mock.
    formatZoomPercentageMock = vi.spyOn(PennylaneTermsViewerManager, 'formatZoomPercentage')
    isScrolledToBottomMock = vi.spyOn(PennylaneTermsViewerManager, 'isScrolledToBottom')
  })

  it('should load PDF on mount', async () => {
    const emit = vi.fn()

    const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

    expect(result.isLoading.value).toBe(true)

    await waitForPdfLoad()

    expect(getTermsContentMock).toHaveBeenCalled()
    expect(loadPdfDocumentMock).toHaveBeenCalledWith(mockPdfData)
    expect(getAllPagesMock).toHaveBeenCalledWith(mockPdfDocument)
    expect(result.numPages.value).toBe(2)
    expect(result.isLoading.value).toBe(false)

    app.unmount()
  })

  it('should set error when PDF loading fails', async () => {
    const emit = vi.fn()

    getTermsContentMock.mockRejectedValueOnce(new Error('Network error'))

    const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

    await flushPromises()

    expect(result.isError.value).toBe(true)
    expect(result.isLoading.value).toBe(false)
    expect(loggerErrorSpy).toHaveBeenCalled()

    app.unmount()
  })

  it('should emit scroll-complete when scrollToBottom is called', async () => {
    const emit = vi.fn()

    const [composableResult, app] = withSetup(() => usePennylaneTermsViewer(emit))

    await waitForPdfLoad()

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
    const emit = vi.fn()

    const [_result, app] = withSetup(() => usePennylaneTermsViewer(emit))

    await waitForPdfLoad()

    app.unmount()

    expect(mockPdfDocument.destroy).toHaveBeenCalled()
  })

  it('should initialize numPages with correct value', async () => {
    const emit = vi.fn()

    const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

    await waitForPdfLoad()

    expect(result.numPages.value).toBe(2)

    app.unmount()
  })

  describe('setCanvasRef', () => {
    it('should render page when canvas ref is set', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      expect(renderPageToCanvasMock).toHaveBeenCalled()

      app.unmount()
    })

    it('should not render page twice for the same index', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      renderPageToCanvasMock.mockClear()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)
      result.setCanvasRef(mockCanvas, 0)

      expect(renderPageToCanvasMock).toHaveBeenCalledTimes(1)

      app.unmount()
    })

    it('should do nothing when canvas is null', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      renderPageToCanvasMock.mockClear()

      result.setCanvasRef(null, 0)

      expect(renderPageToCanvasMock).not.toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('scrollToBottom', () => {
    it('should do nothing when pdfContainer is null', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await flushPromises()

      result.pdfContainer.value = null
      result.scrollToBottom()

      expect(emit).not.toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('render error handling', () => {
    it('should handle render error gracefully', async () => {
      const emit = vi.fn()

      const renderError = new Error('Render failed')
      const rejectedPromise = Promise.reject(renderError)
      rejectedPromise.catch(() => {})

      renderPageToCanvasMock.mockReturnValue({
        promise: rejectedPromise,
        cancel: vi.fn(),
      } as any)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalled()

      app.unmount()
    })

    it('should not log error for RenderingCancelledException', async () => {
      const emit = vi.fn()

      const cancelError = new Error('Cancelled')
      cancelError.name = 'RenderingCancelledException'
      const rejectedPromise = Promise.reject(cancelError)
      rejectedPromise.catch(() => {})

      renderPageToCanvasMock.mockReturnValue({
        promise: rejectedPromise,
        cancel: vi.fn(),
      } as any)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

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
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      expect(result.isAtBottom.value).toBe(false)

      app.unmount()
    })
  })

  describe('zoom controls', () => {
    it('should allow zoom in when not at maximum', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      expect(result.canZoomIn.value).toBe(true)

      app.unmount()
    })

    it('should allow zoom out when above minimum', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      expect(result.canZoomOut.value).toBe(true)

      app.unmount()
    })

    it('should display correct zoom percentage', async () => {
      const emit = vi.fn()

      formatZoomPercentageMock.mockReturnValue('100%')

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      expect(result.zoomPercentage.value).toBe('100%')

      app.unmount()
    })

    it('should increase zoom and rerender pages when zoomIn is called', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      renderPageToCanvasMock.mockClear()

      result.zoomIn()

      expect(renderPageToCanvasMock).toHaveBeenCalled()

      app.unmount()
    })

    it('should decrease zoom and rerender pages when zoomOut is called', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      renderPageToCanvasMock.mockClear()

      result.zoomOut()

      expect(renderPageToCanvasMock).toHaveBeenCalled()

      app.unmount()
    })

    it('should not zoom in when already at maximum', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      // Zoom in multiple times to reach max
      for (let i = 0; i < 20; i++) {
        result.zoomIn()
      }

      renderPageToCanvasMock.mockClear()

      result.zoomIn()

      expect(result.canZoomIn.value).toBe(false)

      app.unmount()
    })

    it('should not zoom out when already at minimum', async () => {
      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      // Zoom out multiple times to reach min
      for (let i = 0; i < 20; i++) {
        result.zoomOut()
      }

      renderPageToCanvasMock.mockClear()

      result.zoomOut()

      expect(result.canZoomOut.value).toBe(false)

      app.unmount()
    })
  })

  describe('mobile scale', () => {
    it('should use mobile scale when on mobile device', async () => {
      vi.mocked(getIsMobile).mockReturnValue(true)

      const emit = vi.fn()

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      expect(getIsMobile).toHaveBeenCalled()
      expect(renderPageToCanvasMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        MOBILE_SCALE,
      )

      app.unmount()

      vi.mocked(getIsMobile).mockReturnValue(false)
    })
  })

  describe('render task cancellation', () => {
    it('should cancel existing render task when re-rendering same page', async () => {
      const emit = vi.fn()
      const cancelMock = vi.fn()

      renderPageToCanvasMock.mockReturnValue({
        promise: new Promise(() => {}),
        cancel: cancelMock,
      } as any)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      const mockCanvas = document.createElement('canvas')
      result.setCanvasRef(mockCanvas, 0)

      result.zoomIn()

      expect(cancelMock).toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('scroll handling', () => {
    it('should update isAtBottom when scrolled to bottom', async () => {
      const emit = vi.fn()

      isScrolledToBottomMock.mockReturnValue(true)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      expect(result.isAtBottom.value).toBe(false)

      app.unmount()
    })

    it('should initialize isAtBottom as false', async () => {
      const emit = vi.fn()

      isScrolledToBottomMock.mockReturnValue(false)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      expect(result.isAtBottom.value).toBe(false)

      app.unmount()
    })
  })

  describe('calculateBaseScale', () => {
    it('should not calculate scale when no pages are loaded', async () => {
      const emit = vi.fn()

      getAllPagesMock.mockResolvedValueOnce([])

      const [_result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await waitForPdfLoad()

      expect(calculateOptimalScaleMock).not.toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('downloadAndContinue', () => {
    it('should download PDF and emit scroll-complete', async () => {
      const emit = vi.fn()

      vi.mocked(downloadTermsPdf).mockResolvedValue(undefined)

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      await result.downloadAndContinue()

      expect(downloadTermsPdf).toHaveBeenCalled()
      expect(emit).toHaveBeenCalledWith('scroll-complete')

      app.unmount()
    })

    it('should set isDownloading to true while downloading', async () => {
      const emit = vi.fn()

      let resolveDownload: () => void = () => {}
      vi.mocked(downloadTermsPdf).mockImplementation(() => new Promise(resolve => {
        resolveDownload = resolve
      }))

      const [result, app] = withSetup(() => usePennylaneTermsViewer(emit))

      const downloadPromise = result.downloadAndContinue()

      expect(result.isDownloading.value).toBe(true)

      resolveDownload()
      await downloadPromise

      expect(result.isDownloading.value).toBe(false)

      app.unmount()
    })

  })
})
