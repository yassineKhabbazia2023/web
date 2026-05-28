import { HTMLService } from './html.service'
import { APP_NAME } from '../../constants/pulse.constants'

describe('HTMLService', () => {
  beforeEach(() => {
    // Reset document.title before each test
    document.title = ''
  })

  describe('setDocumentTitle', () => {
    it('should set document title with the provided title', () => {
      const title = 'Test Title'
      HTMLService.setDocumentTitle(title)
      expect(document.title).toBe(title)
    })

    it('should set default document title without separator if title is empty', () => {
      HTMLService.setDocumentTitle('')
      expect(document.title).toBe(APP_NAME)
    })
  })
  describe('resetDocumentTitle', () => {
    it('should set default document title when invoked', () => {
      HTMLService.resetDocumentTitle()
      expect(document.title).toBe(APP_NAME)
    })
  })
})
