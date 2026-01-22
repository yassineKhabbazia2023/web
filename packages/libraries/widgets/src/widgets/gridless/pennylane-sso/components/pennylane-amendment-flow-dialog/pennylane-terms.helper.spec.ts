import { PennylaneService } from '@pulse/common/services/pennylane'
import { logger } from '@pulse/toolbox'
import { openTermsPdfInNewTab } from './pennylane-terms.helper'

vi.mock('@pulse/common/services/pennylane', () => ({
  PennylaneService: {
    getTermsContent: vi.fn(),
  },
}))

vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: vi.fn(),
  },
}))

const mockGetTermsContent = vi.mocked(PennylaneService.getTermsContent)
const mockLoggerError = vi.mocked(logger.error)

describe('pennylane-terms.helper', () => {
  const mockAccountId = 123
  const mockPdfData = new ArrayBuffer(8)
  let mockWindowOpen: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockWindowOpen = vi.fn()
    vi.stubGlobal('open', mockWindowOpen)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
  })

  describe('openTermsPdfInNewTab', () => {
    it('should fetch PDF content and open it in a new tab', async () => {
      mockGetTermsContent.mockResolvedValue(mockPdfData)

      await openTermsPdfInNewTab(mockAccountId)

      expect(mockGetTermsContent).toHaveBeenCalledWith(mockAccountId)
      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
      expect(mockWindowOpen).toHaveBeenCalledWith('blob:mock-url')
    })

    it('should create a Blob with correct PDF type', async () => {
      mockGetTermsContent.mockResolvedValue(mockPdfData)

      await openTermsPdfInNewTab(mockAccountId)

      const createObjectURLSpy = vi.mocked(URL.createObjectURL)
      const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob
      expect(blobArg.type).toBe('application/pdf')
    })

    it('should log error when fetching PDF fails', async () => {
      mockGetTermsContent.mockRejectedValue(new Error('Network error'))

      await openTermsPdfInNewTab(mockAccountId)

      expect(mockLoggerError).toHaveBeenCalledWith('Error opening terms PDF in new tab')
      expect(mockWindowOpen).not.toHaveBeenCalled()
    })
  })
})
