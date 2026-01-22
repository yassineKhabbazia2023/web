import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { logger } from '@pulse/toolbox'
import { getIsMobile } from '@pulse/styleguide'
import { PennylaneTermsViewerManager } from './pennylane-terms-viewer.manager'
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from './pennylane-terms-viewer.types'
import { ZOOM_STEP, MIN_ZOOM, MAX_ZOOM, MOBILE_SCALE, DEFAULT_CONTAINER_WIDTH } from './pennylane-terms-viewer.types'

/**
 * Composable for managing the Pennylane terms and conditions PDF viewer
 * Handles loading, page rendering, zoom controls and scroll detection
 */
export function usePennylaneTermsViewer(
  accountId: Ref<number>,
  emit: (event: 'scroll-complete') => void,
) {
  const isLoading = ref(true)
  const isError = ref(false)
  const numPages = ref(0)
  const canvasRefs = ref<(HTMLCanvasElement | null)[]>([])
  const pdfContainer = ref<HTMLDivElement | null>(null)
  const isAtBottom = ref(false)

  const zoomLevel = ref(1)
  const baseScale = ref(1)

  let pdfDocument: PDFDocumentProxy | null = null
  let pdfPages: PDFPageProxy[] = []
  let renderTasks: (RenderTask | null)[] = []
  const renderedPages = new Set<number>()
  let scrollObserver: IntersectionObserver | null = null

  const effectiveScale = computed(() => baseScale.value * zoomLevel.value)

  const zoomPercentage = computed(() =>
    PennylaneTermsViewerManager.formatZoomPercentage(zoomLevel.value),
  )

  const canZoomIn = computed(() => zoomLevel.value < MAX_ZOOM)
  const canZoomOut = computed(() => zoomLevel.value > MIN_ZOOM)

  /**
   * Loads the PDF from the Pennylane service
   */
  async function loadPdf() {
    try {
      isLoading.value = true
      isError.value = false

      cleanupObserverAndListeners()
      cancelAllRenderTasks()

      const fetchedPdfData = await PennylaneService.getTermsContent(accountId.value)

      pdfDocument = await PennylaneTermsViewerManager.loadPdfDocument(fetchedPdfData)
      pdfPages = await PennylaneTermsViewerManager.getAllPages(pdfDocument)

      canvasRefs.value = new Array(pdfPages.length).fill(null)
      numPages.value = pdfPages.length

      await nextTick()

      calculateBaseScale()

      await new Promise(resolve => setTimeout(resolve, 200))

      isLoading.value = false
      await nextTick()
      setupScrollObserver()
    } catch (err) {
      logger.error('Error loading PDF:', err)
      isError.value = true
      isLoading.value = false
    }
  }

  /**
   * Calculates the base scale to fit the PDF width in the container
   */
  function calculateBaseScale() {
    if (pdfPages.length === 0) {
      return
    }

    const firstPage = pdfPages[0]
    const isMobile = getIsMobile(window.innerWidth)

    if (isMobile) {
      baseScale.value = MOBILE_SCALE
      return
    }

    const containerWidth = pdfContainer.value?.clientWidth ?? DEFAULT_CONTAINER_WIDTH
    baseScale.value = PennylaneTermsViewerManager.calculateOptimalScale(
      firstPage,
      containerWidth,
    )
  }

  /**
   * Renders a PDF page on the corresponding canvas
   */
  function renderPage(page: PDFPageProxy, index: number) {
    const canvas = canvasRefs.value[index]
    if (canvas === null || canvas === undefined) {
      return
    }

    if (renderTasks[index]) {
      renderTasks[index]?.cancel()
    }

    const scale = effectiveScale.value

    const renderTask = PennylaneTermsViewerManager.renderPageToCanvas(page, canvas, scale)
    renderTasks[index] = renderTask

    renderTask.promise
      .then(() => {
        renderTasks[index] = null
      })
      .catch((err: Error) => {
        if (err.name !== 'RenderingCancelledException') {
          logger.error('Error rendering page:', err)
        }
        renderTasks[index] = null
      })
  }

  /**
   * Re-renders all pages with the current scale
   */
  function rerenderAllPages() {
    renderedPages.clear()
    pdfPages.forEach((page, index) => {
      const canvas = canvasRefs.value[index]
      if (canvas) {
        renderedPages.add(index)
        renderPage(page, index)
      }
    })
  }

  /**
   * Zooms in by one step
   */
  function zoomIn() {
    if (canZoomIn.value === false) {
      return
    }
    zoomLevel.value += ZOOM_STEP
    rerenderAllPages()
  }

  /**
   * Zooms out by one step
   */
  function zoomOut() {
    if (canZoomOut.value === false) {
      return
    }
    zoomLevel.value -= ZOOM_STEP
    rerenderAllPages()
  }

  /**
   * Sets up scroll observation to detect when the user reaches the end
   */
  function setupScrollObserver() {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            (entry.target as HTMLElement).dataset.lastPage === 'true' &&
            entry.intersectionRatio >= 0.5
          ) {
            emit('scroll-complete')
            scrollObserver?.disconnect()
          }
        })
      },
      {
        root: pdfContainer.value,
        threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1],
      },
    )

    const lastCanvas = canvasRefs.value.at(-1)
    if (lastCanvas) {
      scrollObserver.observe(lastCanvas)
    }

    if (pdfContainer.value) {
      pdfContainer.value.addEventListener('scroll', handleScroll)
    }
  }

  /**
   * Handles scroll event to detect when user reaches the bottom
   */
  function handleScroll() {
    if (pdfContainer.value === null) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = pdfContainer.value
    const atBottom = PennylaneTermsViewerManager.isScrolledToBottom(
      scrollTop,
      scrollHeight,
      clientHeight,
    )

    isAtBottom.value = atBottom

    if (atBottom === true) {
      emit('scroll-complete')
    }
  }

  /**
   * Automatically scrolls to the bottom of the PDF
   */
  function scrollToBottom() {
    if (pdfContainer.value === null) {
      return
    }

    pdfContainer.value.scrollTo({
      top: pdfContainer.value.scrollHeight,
      behavior: 'smooth',
    })

    setTimeout(() => {
      emit('scroll-complete')
    }, 500)
  }

  /**
   * Cleans up observers and listeners
   */
  function cleanupObserverAndListeners() {
    scrollObserver?.disconnect()
    if (pdfContainer.value) {
      pdfContainer.value.removeEventListener('scroll', handleScroll)
    }
  }

  /**
   * Cancels all ongoing render tasks
   */
  function cancelAllRenderTasks() {
    renderTasks.forEach((task) => {
      task?.cancel()
    })
    renderTasks = []
    renderedPages.clear()
  }

  /**
   * Sets canvas ref and renders the page (called by Vue)
   */
  function setCanvasRef(el: HTMLCanvasElement | null, index: number) {
    if (el) {
      canvasRefs.value[index] = el

      if (renderedPages.has(index) === false) {
        const page = pdfPages[index]
        if (page) {
          renderedPages.add(index)
          renderPage(page, index)
        }
      }
    }
  }

  onMounted(() => {
    loadPdf()
  })

  onUnmounted(() => {
    cleanupObserverAndListeners()
    cancelAllRenderTasks()

    if (pdfDocument) {
      pdfDocument.destroy()
      pdfDocument = null
    }
    pdfPages = []
  })

  watch(() => accountId.value, () => {
    loadPdf()
  })

  return {
    isLoading,
    isError,
    numPages,
    pdfContainer,
    isAtBottom,
    zoomPercentage,
    canZoomIn,
    canZoomOut,
    setCanvasRef,
    scrollToBottom,
    zoomIn,
    zoomOut,
  }
}
