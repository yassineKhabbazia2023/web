import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { EntitySummary } from '@pulse/common/types'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import { MOCKED_CONFORMITY_DOCUMENTS } from '@entities/__mocks__'
import { useDocumentsList } from './documents-list.composable'

vi.mock('@entities/services/conformity-documents')

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setCurrentEntity = (accountId: number | undefined): void => {
  currentEntityStoreMock.currentEntity = accountId === undefined
    ? undefined
    : { accountId } as EntitySummary
}

describe('useDocumentsList', () => {
  beforeEach(() => {
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValue(MOCKED_CONFORMITY_DOCUMENTS)
  })

  it('should fetch documents on mount for the current entity', async () => {
    setCurrentEntity(1971)

    withSetup(() => useDocumentsList())
    await flushPromises()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocuments)).toHaveBeenCalledWith(1971)
  })

  it('should not call the service when no entity is selected', async () => {
    setCurrentEntity(undefined)

    withSetup(() => useDocumentsList())
    await flushPromises()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocuments)).not.toHaveBeenCalled()
  })

  it('should map fetched documents to the DocumentsListItem shape', async () => {
    setCurrentEntity(1971)

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.documentsListItems.value).toEqual(
      MOCKED_CONFORMITY_DOCUMENTS.map((document) => ({
        documentId: document.id,
        documentName: document.name,
        documentDepositDate: document.depositDate,
        documentDepositedBy: `${document.depositedBy.firstName} ${document.depositedBy.lastName}`,
      })),
    )
  })

  it('should expose a loading flag that resolves to false once loaded', async () => {
    setCurrentEntity(1971)

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.isLoading.value).toBe(false)
  })

  it('should reset the loading flag when the service rejects', async () => {
    setCurrentEntity(1971)
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockRejectedValueOnce(new Error('network error'))

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.isLoading.value).toBe(false)
    expect(result.documentsListItems.value).toEqual([])
  })

  describe('downloadDocument', () => {
    const windowOpenSpy = vi.fn()

    beforeEach(() => {
      windowOpenSpy.mockClear()
      vi.stubGlobal('open', windowOpenSpy)
    })

    it('should open the downloadUrl of the matching document', async () => {
      setCurrentEntity(1971)

      const [result] = withSetup(() => useDocumentsList())
      await flushPromises()

      const target = MOCKED_CONFORMITY_DOCUMENTS[0]
      result.downloadDocument(target.id)

      expect(windowOpenSpy).toHaveBeenCalledWith(target.downloadUrl, '_blank', 'noopener,noreferrer')
    })

    it('should do nothing when the document id is unknown', async () => {
      setCurrentEntity(1971)

      const [result] = withSetup(() => useDocumentsList())
      await flushPromises()

      result.downloadDocument('unknown-id')

      expect(windowOpenSpy).not.toHaveBeenCalled()
    })
  })
})
