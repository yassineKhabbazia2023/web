import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import {
  getSupportingDocumentItemMock,
  getSupportingDocumentsResponseMock,
} from '@entities/__mocks__'
import { useConformityDocuments } from './conformity-documents.composable'
import { PROSPECT_DOCUMENT_DEFAULT_MAX_FILES } from '@entities/modules/entity/prospect/prospect.constants'

vi.mock('@entities/services/conformity-documents')
vi.mock('@pulse/toolbox')

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const getSupportingDocumentsMock = vi.mocked(ConformityDocumentsService.getSupportingDocuments)

const emitMock = vi.fn()

const accountIdMock = 602

describe('conformity-documents.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentEntityStoreMock.currentEntityId = accountIdMock
    getSupportingDocumentsMock.mockResolvedValue(getSupportingDocumentsResponseMock())
  })

  describe('initial loading on mount', () => {
    it('should fetch the supporting documents and split them by category', async () => {
      const [result] = withSetup(() => useConformityDocuments(emitMock))

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

      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      expect(getSupportingDocumentsMock).not.toHaveBeenCalled()
      expect(result.isLoading.value).toBe(false)
    })

    it('should leave the lists empty when the fetch fails', async () => {
      getSupportingDocumentsMock.mockRejectedValue(new Error('API Error'))

      const [result] = withSetup(() => useConformityDocuments(emitMock))
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

      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      expect(result.complementaryDocuments.value).toEqual([])
      expect(result.complementaryMaxFiles.value).toBe(PROSPECT_DOCUMENT_DEFAULT_MAX_FILES)
    })
  })

  describe('reload', () => {
    it('should fetch the supporting documents again', async () => {
      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      await result.reload()

      expect(getSupportingDocumentsMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('onSupportingDocumentsChanged', () => {
    it('should reload the documents and ask the parent to refresh the onboarding steps', async () => {
      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      await result.onSupportingDocumentsChanged()

      expect(getSupportingDocumentsMock).toHaveBeenCalledTimes(2)
      expect(emitMock).toHaveBeenCalledWith('refresh-steps')
    })
  })

  describe('display flags', () => {
    it('should hide both sections when the API returns no document', async () => {
      getSupportingDocumentsMock.mockResolvedValue({ documents: [] })

      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(false)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(false)
    })

    it('should display only the complementary section when the API returns only the complementary item', async () => {
      getSupportingDocumentsMock.mockResolvedValue({
        documents: [getSupportingDocumentItemMock({ type: SupportingDocumentType.COMPLEMENTARY })],
      })

      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(false)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should display only the supporting section when the API returns only predefined documents', async () => {
      getSupportingDocumentsMock.mockResolvedValue({
        documents: [getSupportingDocumentItemMock({ type: SupportingDocumentType.KBIS })],
      })

      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(false)
    })

    it('should display both sections when the API returns supporting and complementary documents', async () => {
      getSupportingDocumentsMock.mockResolvedValue(getSupportingDocumentsResponseMock())

      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should keep both sections visible while loading', () => {
      const [result] = withSetup(() => useConformityDocuments(emitMock))

      expect(result.isLoading.value).toBe(true)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })

    it('should keep both sections visible on fetch error so the alert is shown', async () => {
      getSupportingDocumentsMock.mockRejectedValue(new Error('API Error'))

      const [result] = withSetup(() => useConformityDocuments(emitMock))
      await flushPromises()

      expect(result.hasError.value).toBe(true)
      expect(result.shouldDisplaySupportingDocuments.value).toBe(true)
      expect(result.shouldDisplayComplementaryDocuments.value).toBe(true)
    })
  })
})
