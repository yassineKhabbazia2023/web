import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { logger } from '@pulse/toolbox'
import { PennylaneTermsViewerManager } from './pennylane-terms-viewer.manager'
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from './pennylane-terms-viewer.types'

/**
 * Composable for managing the Pennylane terms and conditions PDF viewer
 * Handles loading, page rendering and scroll detection
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

  let pdfDocument: PDFDocumentProxy | null = null
  let pdfPages: PDFPageProxy[] = []
  let renderTasks: (RenderTask | null)[] = []
  const renderedPages = new Set<number>()
  let scrollObserver: IntersectionObserver | null = null

  /**
   * Loads the PDF from the Pennylane service
   */
  async function loadPdf() {
    try {
      isLoading.value = true
      isError.value = false

      cleanupObserverAndListeners()
      cancelAllRenderTasks()

      const pdfData = await PennylaneService.getTermsContent(accountId.value)

      pdfDocument = await PennylaneTermsViewerManager.loadPdfDocument(pdfData)
      pdfPages = await PennylaneTermsViewerManager.getAllPages(pdfDocument)

      canvasRefs.value = new Array(pdfPages.length).fill(null)
      numPages.value = pdfPages.length

      await nextTick()
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
   * Renders a PDF page on the corresponding canvas
   */
  function renderPage(page: PDFPageProxy, index: number) {
    const canvas = canvasRefs.value[index]
    if (!canvas) {
      return
    }

    if (renderTasks[index]) {
      renderTasks[index]?.cancel()
    }

    const containerWidth = pdfContainer.value?.clientWidth ?? 733
    const scale = PennylaneTermsViewerManager.calculateOptimalScale(page, containerWidth)

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
        threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    )

    const lastCanvas = canvasRefs.value[canvasRefs.value.length - 1]
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
    if (!pdfContainer.value) {
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

      if (!renderedPages.has(index)) {
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
    setCanvasRef,
    scrollToBottom,
  }
}
