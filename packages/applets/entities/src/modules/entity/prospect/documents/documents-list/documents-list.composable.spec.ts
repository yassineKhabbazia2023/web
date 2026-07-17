import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { downloadFile } from '@pulse/common/helpers'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { EntitySummary } from '@pulse/common/types'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import { getConformityDocumentMock } from '@entities/__mocks__'
import { formatDateToLocale } from '@entities/helpers'
import { useDocumentsList } from './documents-list.composable'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setCurrentEntity = (accountId: number | undefined): void => {
  currentEntityStoreMock.currentEntity = accountId === undefined
    ? undefined
    : { accountId } as EntitySummary
}

describe('useDocumentsList', () => {
  beforeEach(() => {
    vi.spyOn(ConformityDocumentsService, 'getConformityDocuments').mockResolvedValue([])
    vi.spyOn(ConformityDocumentsService, 'getConformityDocumentContent').mockResolvedValue(undefined as unknown as Blob)
    vi.mocked(downloadFile).mockImplementation(() => undefined)
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

  it('should map the documents to the DocumentsListItem shape with the depositor initials', async () => {
    setCurrentEntity(1971)
    const first = getConformityDocumentMock({
      id: '1',
      fileName: 'first.pdf',
      uploadedAt: '2026-06-10T14:32:00Z',
      uploadedBy: 'Marie Dupont',
    })
    const second = getConformityDocumentMock({
      id: '2',
      fileName: 'second.pdf',
      uploadedAt: '2026-06-11T09:00:00Z',
      uploadedBy: 'Jean Martin',
    })
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValueOnce([first, second])

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.documentsListItems.value).toEqual([
      {
        documentId: '1',
        documentName: 'first.pdf',
        documentDepositDate: formatDateToLocale('2026-06-10T14:32:00Z'),
        documentDepositedBy: 'Marie Dupont',
        documentDepositedByInitials: 'MD',
      },
      {
        documentId: '2',
        documentName: 'second.pdf',
        documentDepositDate: formatDateToLocale('2026-06-11T09:00:00Z'),
        documentDepositedBy: 'Jean Martin',
        documentDepositedByInitials: 'JM',
      },
    ])
  })

  it('should derive a single initial when the depositor is an email', async () => {
    setCurrentEntity(1971)
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValueOnce([
      getConformityDocumentMock({ id: '1', uploadedBy: 'jean.martin@rydge.fr' }),
    ])

    const [result] = withSetup(() => useDocumentsList())
    await flushPromises()

    expect(result.documentsListItems.value[0].documentDepositedByInitials).toBe('J')
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
    it('should fetch the matching document content and trigger the download', async () => {
      setCurrentEntity(1971)
      const document = getConformityDocumentMock({ id: 'doc-1', fileName: 'contract.pdf' })
      vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValueOnce([document])
      const blob = new Blob(['binary'])
      vi.mocked(ConformityDocumentsService.getConformityDocumentContent).mockResolvedValueOnce(blob)

      const [result] = withSetup(() => useDocumentsList())
      await flushPromises()

      await result.downloadDocument(document.id)

      expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledWith(1971, document.id)
      expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(blob, document.fileName)
    })

    it('should do nothing when the document id is unknown', async () => {
      setCurrentEntity(1971)

      const [result] = withSetup(() => useDocumentsList())
      await flushPromises()

      await result.downloadDocument('unknown-id')

      expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).not.toHaveBeenCalled()
      expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
    })
  })
})
