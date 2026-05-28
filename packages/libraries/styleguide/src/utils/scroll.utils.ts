export interface ScrollToTopOptions {
  /** Element reference to start searching for scroll containers */
  element?: HTMLElement | null
  /** Whether to also scroll the window (useful for mobile fullscreen) */
  scrollWindow?: boolean
}

/**
 * Scrolls to the top of all potential scroll containers.
 * Handles various scenarios including dialogs and iOS Safari fullscreen mode.
 *
 * @param options - Configuration options for scroll behavior
 */
export function scrollToTop(options: ScrollToTopOptions = {}): void {
  const { element, scrollWindow = false } = options

  if (element) {
    // Reset the element's own scroll position
    element.scrollTop = 0

    // Target the dialog body which is often the scroll container
    const dialogBody = element.closest('.el-dialog__body')
    if (dialogBody) {
      (dialogBody as HTMLElement).scrollTop = 0
    }

    // For fullscreen dialogs, the dialog element itself might be the scroll container
    const dialog = element.closest('.el-dialog')
    if (dialog) {
      (dialog as HTMLElement).scrollTop = 0
    }

    // For fullscreen dialogs, the overlay might be the scroll container
    const overlayDialog = element.closest('.el-overlay-dialog')
    if (overlayDialog) {
      (overlayDialog as HTMLElement).scrollTop = 0
    }

    // The overlay wrapper can also have scroll on some configurations
    const overlay = element.closest('.el-overlay')
    if (overlay) {
      (overlay as HTMLElement).scrollTop = 0
    }
  }

  // Fallback for iOS fullscreen mode where the window might be the scroll container
  if (scrollWindow) {
    window.scrollTo(0, 0)
  }
}
