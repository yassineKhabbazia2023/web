import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { useCommercialProposal } from './commercial-proposal.composable'
import { OnboardingStep, OnboardingStepStatus } from '../prospect-conformity.enums'
import { armConformityDocumentMocks } from '@entities/__mocks__/vitest'

const openDocumentInNewTabMock = vi.mocked(openDocumentInNewTab)

const I18N_KEY = 'entities.prospect.conformity.proposal'
const entityId = 1971

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setEntityId = (id: number | undefined): void => {
  currentEntityStoreMock.currentEntityId = id
}

const mountComposable = (emit = vi.fn()) => {
  const [result] = withSetup(() => useCommercialProposal(emit))
  return { result, emit }
}

const buildPdfFile = (): File =>
  new File(['content'], 'proposal.pdf', { type: 'application/pdf' })

describe('useCommercialProposal', () => {
  beforeEach(() => {
    armConformityDocumentMocks()
    vi.spyOn(ProspectsService, 'downloadCommercialProposal').mockResolvedValue(undefined as unknown as Blob)
    vi.spyOn(ProspectsService, 'uploadCommercialProposal').mockResolvedValue(undefined)
    vi.spyOn(ProspectsService, 'fetchOnboardingStep').mockResolvedValue({
      id: OnboardingStep.CommercialProposal,
      status: OnboardingStepStatus.ToDo,
    })
    setEntityId(entityId)
  })

  describe('onboarding step status', () => {
    it('should fetch the commercial proposal step status on mount', async () => {
      vi.mocked(ProspectsService.fetchOnboardingStep).mockResolvedValue({
        id: OnboardingStep.CommercialProposal,
        status: OnboardingStepStatus.Completed,
      })
      const { result } = mountComposable()

      expect(result.isLoading.value).toBe(true)

      await flushPromises()

      expect(vi.mocked(ProspectsService.fetchOnboardingStep)).toHaveBeenCalledWith(
        entityId,
        OnboardingStep.CommercialProposal,
      )
      expect(result.isLoading.value).toBe(false)
      expect(result.status.value).toBe(OnboardingStepStatus.Completed)
    })
  })

  describe('file selection', () => {
    it('should start without any selected file', () => {
      const { result } = mountComposable()

      expect(result.selectedCommercialProposalFile.value).toBeNull()
    })
  })

  describe('openCommercialProposalDocument', () => {
    it('should open the document in a new tab for the current prospect', async () => {
      openDocumentInNewTabMock.mockResolvedValue(true)
      const { result } = mountComposable()

      await result.openCommercialProposalDocument()

      expect(openDocumentInNewTabMock).toHaveBeenCalledOnce()
      // The fetcher handed to the helper downloads the commercial proposal for the current prospect.
      const [fetchDocument] = openDocumentInNewTabMock.mock.calls[0]
      await fetchDocument()
      expect(vi.mocked(ProspectsService.downloadCommercialProposal)).toHaveBeenCalledWith(entityId)
      expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
      expect(result.isDownloading.value).toBe(false)
    })

    it('should do nothing when no prospect is selected', async () => {
      setEntityId(undefined)
      const { result } = mountComposable()

      await result.openCommercialProposalDocument()

      expect(openDocumentInNewTabMock).not.toHaveBeenCalled()
    })

    it('should display an error notification when the browser blocks the popup', async () => {
      openDocumentInNewTabMock.mockResolvedValue(false)
      const { result } = mountComposable()

      await result.openCommercialProposalDocument()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.downloadError`)
      expect(result.isDownloading.value).toBe(false)
    })

    it('should display an error notification when the download fails', async () => {
      openDocumentInNewTabMock.mockRejectedValue(new Error('network error'))
      const { result } = mountComposable()

      await result.openCommercialProposalDocument()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.downloadError`)
      expect(result.isDownloading.value).toBe(false)
    })
  })

  describe('sendCommercialProposalToCustomer', () => {
    it('should upload the selected file, notify success and emit sent', async () => {
      const file = buildPdfFile()
      vi.mocked(ProspectsService.uploadCommercialProposal).mockResolvedValueOnce(undefined)
      const { result, emit } = mountComposable()
      result.selectedCommercialProposalFile.value = file

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(ProspectsService.uploadCommercialProposal)).toHaveBeenCalledWith(entityId, file)
      expect(result.selectedCommercialProposalFile.value).toBeNull()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', `${I18N_KEY}.sendSuccess`)
      expect(emit).toHaveBeenCalledWith('sent')
      expect(result.isSending.value).toBe(false)
    })

    it('should refresh its own status after a successful send', async () => {
      const file = buildPdfFile()
      vi.mocked(ProspectsService.uploadCommercialProposal).mockResolvedValueOnce(undefined)
      vi.mocked(ProspectsService.fetchOnboardingStep)
        .mockResolvedValueOnce({ id: OnboardingStep.CommercialProposal, status: OnboardingStepStatus.ToDo })
        .mockResolvedValueOnce({ id: OnboardingStep.CommercialProposal, status: OnboardingStepStatus.Completed })
      const { result } = mountComposable()
      await flushPromises()
      expect(result.status.value).toBe(OnboardingStepStatus.ToDo)
      result.selectedCommercialProposalFile.value = file

      await result.sendCommercialProposalToCustomer()

      expect(result.status.value).toBe(OnboardingStepStatus.Completed)
    })

    it('should do nothing without a selected file', async () => {
      const { result, emit } = mountComposable()

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(ProspectsService.uploadCommercialProposal)).not.toHaveBeenCalled()
      expect(emit).not.toHaveBeenCalled()
    })

    it('should do nothing when no prospect is selected', async () => {
      setEntityId(undefined)
      const { result } = mountComposable()
      result.selectedCommercialProposalFile.value = buildPdfFile()

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(ProspectsService.uploadCommercialProposal)).not.toHaveBeenCalled()
    })

    it('should display an error notification and not emit when the upload fails', async () => {
      vi.mocked(ProspectsService.uploadCommercialProposal).mockRejectedValueOnce(new Error('network error'))
      const { result, emit } = mountComposable()
      result.selectedCommercialProposalFile.value = buildPdfFile()

      await result.sendCommercialProposalToCustomer()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.sendError`)
      expect(emit).not.toHaveBeenCalled()
      expect(result.isSending.value).toBe(false)
    })
  })
})
