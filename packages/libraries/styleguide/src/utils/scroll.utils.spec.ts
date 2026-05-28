import { scrollToTop } from './scroll.utils'

const createMockElement = (closestResults: Record<string, HTMLElement | null> = {}) => {
  const element = document.createElement('div')
  element.scrollTop = 100

  vi.spyOn(element, 'closest').mockImplementation((selector: string) => {
    return closestResults[selector] ?? null
  })

  return element
}

describe('scroll.utils', () => {
  describe('scrollToTop', () => {
    beforeEach(() => {
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    })

    it('should reset element scrollTop when element is provided', () => {
      const element = createMockElement()

      scrollToTop({ element })

      expect(element.scrollTop).toBe(0)
    })

    it('should reset dialog body scrollTop when found', () => {
      const dialogBody = document.createElement('div')
      dialogBody.scrollTop = 200

      const element = createMockElement({
        '.el-dialog__body': dialogBody,
      })

      scrollToTop({ element })

      expect(dialogBody.scrollTop).toBe(0)
    })

    it('should reset overlay dialog scrollTop when found', () => {
      const overlayDialog = document.createElement('div')
      overlayDialog.scrollTop = 300

      const element = createMockElement({
        '.el-overlay-dialog': overlayDialog,
      })

      scrollToTop({ element })

      expect(overlayDialog.scrollTop).toBe(0)
    })

    it('should reset dialog element scrollTop when found', () => {
      const dialog = document.createElement('div')
      dialog.scrollTop = 250

      const element = createMockElement({
        '.el-dialog': dialog,
      })

      scrollToTop({ element })

      expect(dialog.scrollTop).toBe(0)
    })

    it('should reset overlay scrollTop when found', () => {
      const overlay = document.createElement('div')
      overlay.scrollTop = 350

      const element = createMockElement({
        '.el-overlay': overlay,
      })

      scrollToTop({ element })

      expect(overlay.scrollTop).toBe(0)
    })

    it('should scroll window when scrollWindow option is true', () => {
      scrollToTop({ scrollWindow: true })

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    })

    it('should not scroll window by default', () => {
      const element = createMockElement()

      scrollToTop({ element })

      expect(window.scrollTo).not.toHaveBeenCalled()
    })

    it('should handle all scroll containers when all options are provided', () => {
      const dialogBody = document.createElement('div')
      dialogBody.scrollTop = 200

      const dialog = document.createElement('div')
      dialog.scrollTop = 250

      const overlayDialog = document.createElement('div')
      overlayDialog.scrollTop = 300

      const overlay = document.createElement('div')
      overlay.scrollTop = 350

      const element = createMockElement({
        '.el-dialog__body': dialogBody,
        '.el-dialog': dialog,
        '.el-overlay-dialog': overlayDialog,
        '.el-overlay': overlay,
      })

      scrollToTop({ element, scrollWindow: true })

      expect(element.scrollTop).toBe(0)
      expect(dialogBody.scrollTop).toBe(0)
      expect(dialog.scrollTop).toBe(0)
      expect(overlayDialog.scrollTop).toBe(0)
      expect(overlay.scrollTop).toBe(0)
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    })

    it('should handle empty options gracefully', () => {
      expect(() => scrollToTop()).not.toThrow()
      expect(() => scrollToTop({})).not.toThrow()
    })

    it('should handle null element gracefully', () => {
      expect(() => scrollToTop({ element: null })).not.toThrow()
    })
  })
})
