import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import {
  getSupportingDocumentItemMock,
  getSupportingDocumentsResponseMock,
} from '@entities/__mocks__'
import { useConformityDocuments } from './conformity-documents.composable'
import { PROSPECT_DOCUMENT_DEFAULT_MAX_FILES } from '@entities/modules/entity/prospect/prospect.constants'
import { OnboardingStep, OnboardingStepStatus } from '../prospect-conformity.enums'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const getSupportingDocumentsMock = vi.fn()
const fetchOnboardingStepMock = vi.fn()

const emitMock = vi.fn()

const accountIdMock = 602

const mountComposable = ({ hasSupportingStep = true, hasSupportingAccess = true, hasComplementaryAccess = true } = {}) => {
  const [result] = withSetup(() =>
    useConformityDocuments(emitMock, ref(hasSupportingStep), ref(hasSupportingAccess), ref(hasComplementaryAccess)),
  )
  return result
}

describe('conformity-documents.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(ConformityDocumentsService, 'getSupportingDocuments').mockImplementation(getSupportingDocumentsMock)
    vi.spyOn(ProspectsService, 'fetchOnboardingStep').mockImplementation(fetchOnboardingStepMock)
    currentEntityStoreMock.currentEntityId = accountIdMock
    getSupportingDocumentsMock.mockResolvedValue(getSupportingDocumentsResponseMock())
    fetchOnboardingStepMock.mockResolvedValue({
      id: OnboardingStep.SupportingDocuments,
      status: OnboardingStepStatus.ToDo,
    })
  })

  describe('initial loading on mount', () => {
    it('should fetch the supporting documents and split them by category', async () => {
      const result = mountComposable()

      expect(result.isLoading.value).toBe(true)

      await flushPromises()

      expect(getSupportingDocumentsMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.predefinedItems.value.every((item) => item.type !== SupportingDocumentType.COMPLEMENTARY)).toBe(true)
      expect(result.complementaryDocuments.value).toHaveLength(1)
      expect(result.complementaryMaxFiles.value).toBe(10)
      expect(result.isLoading.value).toBe(false)
      expect(result.hasError.value).toBe(false)
    })

    it('should not fetch the documents when there is no current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined

      const result = mountComposable()
      await flushPromises()

      expect(getSupportingDocumentsMock).not.toHaveBeenCalled()
      expect(result.isLoading.value).toBe(false)
    })

    it('should leave the lists empty when the fetch fails', async () => {
      getSupportingDocumentsMock.mockRejectedValue(new Error('API Error'))

      const result = mountComposable()
      await flushPromises()

      expect(result.predefinedItems.value).toEqual([])
      expect(result.complementaryDocuments.value).toEqual([])
      expect(result.isLoading.value).toBe(false)
      expect(result.hasError.value).toBe(true)
    })

    it('should fall back to the default maxFiles when the response has no complementary entry', async () => {
      getSupportingDocumentsMock.mockResolvedValue({
        documents: [getSupportingDocumentItemMock({ type: SupportingDocumentType.KBIS })],
      })

      const result = mountComposable()
      await flushPromises()

      expect(result.complementaryDocuments.value).toEqual([])
      expect(result.complementaryMaxFiles.value).toBe(PROSPECT_DOCUMENT_DEFAULT_MAX_FILES)
    })
  })

  describe('reload', () => {
    it('should fetch the supporting documents again', async () => {
      const result = mountComposable()
      await flushPromises()

      await result.reload()

      expect(getSupportingDocumentsMock).toHaveBeenCalledTimes(2)
      // reload only refreshes the documents, not the step status.
      expect(fetchOnboardingStepMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('onSupportingDocumentsChanged', () => {
    it('should reload the documents and step status, then ask the parent to refresh the onboarding steps', async () => {
      const result = mountComposable()
      await flushPromises()

      await result.onSupportingDocumentsChanged()

      expect(getSupportingDocumentsMock).toHaveBeenCalledTimes(2)
      expect(fetchOnboardingStepMock).toHaveBeenCalledTimes(2)
      expect(emitMock).toHaveBeenCalledWith('refresh-steps')
    })
  })

  describe('supporting step status', () => {
    it('should fetch the step status on mount and expose isCompleted', async () => {
      fetchOnboardingStepMock.mockResolvedValue({
        id: OnboardingStep.SupportingDocuments,
        status: OnboardingStepStatus.Completed,
      })

      const result = mountComposable()
      await flushPromises()

      expect(fetchOnboardingStepMock).toHaveBeenCalledWith(accountIdMock, OnboardingStep.SupportingDocuments)
      expect(result.isCompleted.value).toBe(true)
    })

    it('should keep isCompleted false while the step is not completed', async () => {
      const result = mountComposable()
      await flushPromises()

      expect(result.isCompleted.value).toBe(false)
    })
  })

  describe('step status fetch failure', () => {
    beforeEach(() => {
      fetchOnboardingStepMock.mockRejectedValue(new Error('API Error (404)'))
    })

    it('should keep the supporting card visible with the error even when the API returns no document', async () => {
      getSupportingDocumentsMock.mockResolvedValue({ documents: [] })

      const result = mountComposable()
      await flushPromises()

      expect(result.hasSupportingDocumentsError.value).toBe(true)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      // The complementary card does not consume the step status: it keeps its own display logic.
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(false)
    })

    it('should surface the error on the supporting card even when the documents fetch succeeds', async () => {
      const result = mountComposable()
      await flushPromises()

      expect(result.hasSupportingDocumentsError.value).toBe(true)
      // The shared documents fetch succeeded: the complementary card must not show an alert.
      expect(result.hasError.value).toBe(false)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should not report a status error when the status fetch is skipped (step absent)', async () => {
      const result = mountComposable({ hasSupportingStep: false })
      await flushPromises()

      expect(fetchOnboardingStepMock).not.toHaveBeenCalled()
      expect(result.hasSupportingDocumentsError.value).toBe(false)
    })
  })

  describe('display flags', () => {
    it('should hide both sections when the API returns no document', async () => {
      getSupportingDocumentsMock.mockResolvedValue({ documents: [] })

      const result = mountComposable()
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(false)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(false)
    })

    it('should display only the complementary section when the API returns only the complementary item', async () => {
      getSupportingDocumentsMock.mockResolvedValue({
        documents: [getSupportingDocumentItemMock({ type: SupportingDocumentType.COMPLEMENTARY })],
      })

      const result = mountComposable()
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(false)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should display only the supporting section when the API returns only predefined documents', async () => {
      getSupportingDocumentsMock.mockResolvedValue({
        documents: [getSupportingDocumentItemMock({ type: SupportingDocumentType.KBIS })],
      })

      const result = mountComposable()
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(false)
    })

    it('should display both sections when the API returns supporting and complementary documents', async () => {
      getSupportingDocumentsMock.mockResolvedValue(getSupportingDocumentsResponseMock())

      const result = mountComposable()
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should keep both sections visible while loading', () => {
      const result = mountComposable()

      expect(result.isLoading.value).toBe(true)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should keep both sections visible on fetch error so the alert is shown', async () => {
      getSupportingDocumentsMock.mockRejectedValue(new Error('API Error'))

      const result = mountComposable()
      await flushPromises()

      expect(result.hasError.value).toBe(true)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })
  })

  describe('access gating', () => {
    it('should skip the fetch and keep both cards visible when both accesses are denied', async () => {
      const result = mountComposable({ hasSupportingAccess: false, hasComplementaryAccess: false })
      await flushPromises()

      expect(getSupportingDocumentsMock).not.toHaveBeenCalled()
      expect(result.isLoading.value).toBe(false)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should still fetch and force the supporting card visible when only the supporting access is denied', async () => {
      getSupportingDocumentsMock.mockResolvedValue({
        documents: [getSupportingDocumentItemMock({ type: SupportingDocumentType.COMPLEMENTARY })],
      })

      const result = mountComposable({ hasSupportingAccess: false })
      await flushPromises()

      expect(getSupportingDocumentsMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should skip the step status fetch when the supporting access is denied', async () => {
      const result = mountComposable({ hasSupportingAccess: false })
      await flushPromises()

      // Only the supporting card consumes the status, so a denied access must not call /steps/:stepId.
      expect(fetchOnboardingStepMock).not.toHaveBeenCalled()
      expect(result.isCompleted.value).toBe(false)
      // The complementary card still needs isLoading to settle.
      expect(result.isLoading.value).toBe(false)
    })

    it('should skip both fetches when both accesses are denied', async () => {
      const result = mountComposable({ hasSupportingAccess: false, hasComplementaryAccess: false })
      await flushPromises()

      expect(getSupportingDocumentsMock).not.toHaveBeenCalled()
      expect(fetchOnboardingStepMock).not.toHaveBeenCalled()
      expect(result.isLoading.value).toBe(false)
    })

    it('should still fetch and force the complementary card visible when only the complementary access is denied', async () => {
      getSupportingDocumentsMock.mockResolvedValue({
        documents: [getSupportingDocumentItemMock({ type: SupportingDocumentType.KBIS })],
      })

      const result = mountComposable({ hasComplementaryAccess: false })
      await flushPromises()

      expect(getSupportingDocumentsMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })
  })

  describe('supporting step absence', () => {
    it('should hide the supporting card even when the API returns predefined documents', async () => {
      const result = mountComposable({ hasSupportingStep: false })
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(false)
      // The complementary card keeps its own display logic (the response holds a complementary item).
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should skip the step status fetch and settle loading on the documents fetch alone', async () => {
      const result = mountComposable({ hasSupportingStep: false })
      await flushPromises()

      expect(fetchOnboardingStepMock).not.toHaveBeenCalled()
      expect(result.isCompleted.value).toBe(false)
      expect(result.isLoading.value).toBe(false)
    })

    it('should hide the supporting card while loading and keep the complementary card visible', () => {
      const result = mountComposable({ hasSupportingStep: false })

      expect(result.isLoading.value).toBe(true)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(false)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should hide the supporting card on fetch error and keep the complementary card visible', async () => {
      getSupportingDocumentsMock.mockRejectedValue(new Error('API Error'))

      const result = mountComposable({ hasSupportingStep: false })
      await flushPromises()

      expect(result.hasError.value).toBe(true)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(false)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should still fetch the documents for the complementary card', async () => {
      const result = mountComposable({ hasSupportingStep: false })
      await flushPromises()

      expect(getSupportingDocumentsMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.complementaryDocuments.value).toHaveLength(1)
    })
  })
})
