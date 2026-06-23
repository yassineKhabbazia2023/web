import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { useCommercialProposal } from './commercial-proposal.composable'
import { COMMERCIAL_PROPOSAL_MAX_FILE_SIZE_BYTES } from './commercial-proposal.consts'
import type { EntitySummary } from '@pulse/common/types'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')
vi.mock('@entities/services/prospects/prospects.service')

const I18N_KEY = 'entities.prospect.conformity.proposal'
const prospectId = 1971

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setProspectId = (id: number | null | undefined): void => {
  currentEntityStoreMock.currentEntity = id === undefined
    ? undefined
    : { prospectId: id } as EntitySummary
}

const mountComposable = (emit = vi.fn()) => {
  const [result] = withSetup(() => useCommercialProposal(emit))
  return { result, emit }
}

const buildPdfFile = (sizeInBytes?: number): File => {
  const file = new File(['content'], 'proposal.pdf', { type: 'application/pdf' })
  if (sizeInBytes !== undefined) {
    Object.defineProperty(file, 'size', { value: sizeInBytes })
  }
  return file
}

describe('useCommercialProposal', () => {
  beforeEach(() => {
    setProspectId(prospectId)
  })

  describe('file selection', () => {
    it('should keep the first selected PDF file', () => {
      const { result } = mountComposable()

      result.onFilesSelected([buildPdfFile()])

      expect(result.hasSelectedFile.value).toBe(true)
    })

    it('should ignore non-PDF files', () => {
      const { result } = mountComposable()

      result.onFilesSelected([new File(['content'], 'proposal.png', { type: 'image/png' })])

      expect(result.hasSelectedFile.value).toBe(false)
    })

    it('should keep a file at exactly the maximum allowed size', () => {
      const { result } = mountComposable()

      result.onFilesSelected([buildPdfFile(COMMERCIAL_PROPOSAL_MAX_FILE_SIZE_BYTES)])

      expect(result.hasSelectedFile.value).toBe(true)
    })

    it('should ignore files larger than the maximum allowed size', () => {
      const { result } = mountComposable()

      result.onFilesSelected([buildPdfFile(COMMERCIAL_PROPOSAL_MAX_FILE_SIZE_BYTES + 1)])

      expect(result.hasSelectedFile.value).toBe(false)
    })

    it('should clear the selection when the file is removed', () => {
      const { result } = mountComposable()
      result.onFilesSelected([buildPdfFile()])

      result.onFileDeleted()

      expect(result.hasSelectedFile.value).toBe(false)
    })
  })

  describe('openCommercialProposalDocument', () => {
    const windowOpenSpy = vi.fn()
    const createObjectUrlMock = vi.fn().mockReturnValue('blob:mocked-url')

    beforeEach(() => {
      windowOpenSpy.mockClear()
      vi.stubGlobal('open', windowOpenSpy)
      URL.createObjectURL = createObjectUrlMock
    })

    it('should download the document and open it in a new tab', async () => {
      const documentBlob = new Blob()
      vi.mocked(ProspectsService.downloadCommercialProposal).mockResolvedValueOnce(documentBlob)
      const { result } = mountComposable()

      await result.openCommercialProposalDocument()

      expect(vi.mocked(ProspectsService.downloadCommercialProposal)).toHaveBeenCalledWith(prospectId)
      expect(createObjectUrlMock).toHaveBeenCalledWith(documentBlob)
      expect(windowOpenSpy).toHaveBeenCalledWith('blob:mocked-url', '_blank', 'noopener,noreferrer')
      expect(result.isDownloading.value).toBe(false)
    })

    it('should do nothing when no prospect is selected', async () => {
      setProspectId(null)
      const { result } = mountComposable()

      await result.openCommercialProposalDocument()

      expect(vi.mocked(ProspectsService.downloadCommercialProposal)).not.toHaveBeenCalled()
    })

    it('should display an error notification when the download fails', async () => {
      vi.mocked(ProspectsService.downloadCommercialProposal).mockRejectedValueOnce(new Error('network error'))
      const { result } = mountComposable()

      await result.openCommercialProposalDocument()

      expect(windowOpenSpy).not.toHaveBeenCalled()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.downloadError`)
      expect(result.isDownloading.value).toBe(false)
    })
  })

  describe('sendCommercialProposalToCustomer', () => {
    it('should upload the selected file, notify success and emit sent', async () => {
      const file = buildPdfFile()
      vi.mocked(ProspectsService.uploadCommercialProposal).mockResolvedValueOnce(undefined)
      const { result, emit } = mountComposable()
      result.onFilesSelected([file])

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(ProspectsService.uploadCommercialProposal)).toHaveBeenCalledWith(prospectId, file)
      expect(result.hasSelectedFile.value).toBe(false)
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', `${I18N_KEY}.sendSuccess`)
      expect(emit).toHaveBeenCalledWith('sent')
      expect(result.isSending.value).toBe(false)
    })

    it('should do nothing without a selected file', async () => {
      const { result, emit } = mountComposable()

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(ProspectsService.uploadCommercialProposal)).not.toHaveBeenCalled()
      expect(emit).not.toHaveBeenCalled()
    })

    it('should do nothing when no prospect is selected', async () => {
      setProspectId(null)
      const { result } = mountComposable()
      result.onFilesSelected([buildPdfFile()])

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(ProspectsService.uploadCommercialProposal)).not.toHaveBeenCalled()
    })

    it('should display an error notification and not emit when the upload fails', async () => {
      vi.mocked(ProspectsService.uploadCommercialProposal).mockRejectedValueOnce(new Error('network error'))
      const { result, emit } = mountComposable()
      result.onFilesSelected([buildPdfFile()])

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.sendError`)
      expect(emit).not.toHaveBeenCalled()
      expect(result.isSending.value).toBe(false)
    })
  })
})
