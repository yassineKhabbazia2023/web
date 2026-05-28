import { PennylaneService } from '@pulse/common/services/pennylane'
import { isMobileDevice, logger } from '@pulse/toolbox'
import { openTermsPdfInNewTab, downloadTermsPdf } from './pennylane-terms.helper'

vi.mock('@pulse/common/services/pennylane', () => ({
  PennylaneService: {
    getTermsContent: vi.fn(),
  },
}))

vi.mock('@pulse/toolbox', () => ({
  isMobileDevice: vi.fn(),
  logger: {
    error: vi.fn(),
  },
}))

const mockGetTermsContent = vi.mocked(PennylaneService.getTermsContent)
const mockLoggerError = vi.mocked(logger.error)
const mockIsMobileDevice = vi.mocked(isMobileDevice)

describe('pennylane-terms.helper', () => {
  const mockAccountId = 123
  const mockPdfData = new ArrayBuffer(8)

  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  describe('openTermsPdfInNewTab', () => {
    let mockWindowOpen: ReturnType<typeof vi.fn>
    let mockStyle: { textContent: string }
    let mockEmbed: { src: string, type: string }
    let mockNewTab: {
      location: { href: string }
      close: ReturnType<typeof vi.fn>
      document: {
        title: string
        createElement: ReturnType<typeof vi.fn>
        head: { appendChild: ReturnType<typeof vi.fn> }
        body: { appendChild: ReturnType<typeof vi.fn> }
      }
    }

    beforeEach(() => {
      mockStyle = { textContent: '' }
      mockEmbed = { src: '', type: '' }
      mockNewTab = {
        location: { href: '' },
        close: vi.fn(),
        document: {
          title: '',
          createElement: vi.fn((tag: string) => tag === 'style' ? mockStyle : mockEmbed),
          head: { appendChild: vi.fn() },
          body: { appendChild: vi.fn() },
        },
      }
      mockWindowOpen = vi.fn().mockReturnValue(mockNewTab)
      vi.stubGlobal('open', mockWindowOpen)
      mockIsMobileDevice.mockReturnValue(false)
    })

    it('should open a blank tab synchronously then create DOM with embedded PDF on desktop', async () => {
      mockGetTermsContent.mockResolvedValue(mockPdfData)

      await openTermsPdfInNewTab(mockAccountId)

      expect(mockWindowOpen).toHaveBeenCalledWith('', '_blank')
      expect(mockGetTermsContent).toHaveBeenCalledWith(mockAccountId)
      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
      expect(mockNewTab.document.createElement).toHaveBeenCalledWith('style')
      expect(mockNewTab.document.createElement).toHaveBeenCalledWith('embed')
      expect(mockNewTab.document.head.appendChild).toHaveBeenCalledWith(mockStyle)
      expect(mockNewTab.document.body.appendChild).toHaveBeenCalledWith(mockEmbed)
      expect(mockEmbed.src).toBe('blob:mock-url')
      expect(mockEmbed.type).toBe('application/pdf')
    })

    it('should create a Blob with correct PDF type', async () => {
      mockGetTermsContent.mockResolvedValue(mockPdfData)

      await openTermsPdfInNewTab(mockAccountId)

      const createObjectURLSpy = vi.mocked(URL.createObjectURL)
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob
      expect(blobArg.type).toBe('application/pdf')
    })

    it('should close the tab and log error when fetching PDF fails', async () => {
      mockGetTermsContent.mockRejectedValue(new Error('Network error'))

      await openTermsPdfInNewTab(mockAccountId)

      expect(mockNewTab.close).toHaveBeenCalled()
      expect(mockLoggerError).toHaveBeenCalledWith('Error opening terms PDF in new tab')
    })

    it('should log error and return early if popup is blocked', async () => {
      mockWindowOpen.mockReturnValue(null)

      await openTermsPdfInNewTab(mockAccountId)

      expect(mockLoggerError).toHaveBeenCalledWith('Failed to open new tab - popup may be blocked')
      expect(mockGetTermsContent).not.toHaveBeenCalled()
    })

    describe('on mobile devices', () => {
      let mockLink: { href: string, download: string, click: ReturnType<typeof vi.fn> }

      beforeEach(() => {
        mockLink = { href: '', download: '', click: vi.fn() }
        vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement)
        mockIsMobileDevice.mockReturnValue(true)
      })

      it('should trigger download instead of embed on mobile', async () => {
        mockGetTermsContent.mockResolvedValue(mockPdfData)

        await openTermsPdfInNewTab(mockAccountId)

        expect(mockWindowOpen).not.toHaveBeenCalled()
        expect(mockLink.download).toBe('conditions-generales-rydge-conseil.pdf')
        expect(mockLink.click).toHaveBeenCalled()
      })
    })
  })

  describe('downloadTermsPdf', () => {
    let mockLink: { href: string, download: string, click: ReturnType<typeof vi.fn> }
    let createElementSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      }
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement)
    })

    it('should download the PDF with correct filename', async () => {
      vi.useFakeTimers()
      mockGetTermsContent.mockResolvedValue(mockPdfData)

      await downloadTermsPdf(mockAccountId)

      expect(mockGetTermsContent).toHaveBeenCalledWith(mockAccountId)
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockLink.href).toBe('blob:mock-url')
      expect(mockLink.download).toBe('conditions-generales-rydge-conseil.pdf')
      expect(mockLink.click).toHaveBeenCalled()

      expect(URL.revokeObjectURL).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')

      vi.useRealTimers()
    })

    it('should create a Blob with correct PDF type', async () => {
      mockGetTermsContent.mockResolvedValue(mockPdfData)

      await downloadTermsPdf(mockAccountId)

      const createObjectURLSpy = vi.mocked(URL.createObjectURL)
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob
      expect(blobArg.type).toBe('application/pdf')
    })

    it('should log error when download fails', async () => {
      mockGetTermsContent.mockRejectedValue(new Error('Network error'))

      await downloadTermsPdf(mockAccountId)

      expect(mockLoggerError).toHaveBeenCalledWith('Error downloading terms PDF')
    })
  })
})
