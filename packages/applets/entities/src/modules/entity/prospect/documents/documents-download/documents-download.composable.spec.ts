import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { downloadFile } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { EntitySummary } from '@pulse/common/types'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import { getConformityDocumentMock, getDocumentsListItemMock } from '@entities/__mocks__'
import { useDocumentsDownload } from './documents-download.composable'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setCurrentEntity = (accountId: number | undefined): void => {
  currentEntityStoreMock.currentEntity = accountId === undefined
    ? undefined
    : { accountId } as EntitySummary
}

describe('useDocumentsDownload', () => {
  beforeEach(() => {
    vi.spyOn(ConformityDocumentsService, 'getConformityDocuments').mockResolvedValue([])
    vi.spyOn(ConformityDocumentsService, 'getConformityDocumentContent').mockResolvedValue(new Blob(['binary']))
    vi.mocked(downloadFile).mockImplementation(() => undefined)
    vi.mocked(displayNotification).mockImplementation(() => undefined)
  })

  it('downloads only the selected documents when at least one is selected', async () => {
    setCurrentEntity(1971)
    const [result] = withSetup(() => useDocumentsDownload())
    result.selectedDocuments.value = [
      getDocumentsListItemMock({ documentId: 'doc-1', documentName: 'first.pdf' }),
      getDocumentsListItemMock({ documentId: 'doc-2', documentName: 'second.pdf' }),
    ]

    await result.downloadDocuments()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocuments)).not.toHaveBeenCalled()
    expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledWith(1971, 'doc-1')
    expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledWith(1971, 'doc-2')
    expect(vi.mocked(downloadFile)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(expect.any(Blob), 'first.pdf')
    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(expect.any(Blob), 'second.pdf')
  })

  it('downloads every prospect document when nothing is selected', async () => {
    setCurrentEntity(1971)
    vi.mocked(ConformityDocumentsService.getConformityDocuments).mockResolvedValueOnce([
      getConformityDocumentMock({ id: 'all-1', fileName: 'all-first.pdf' }),
      getConformityDocumentMock({ id: 'all-2', fileName: 'all-second.pdf' }),
    ])
    const [result] = withSetup(() => useDocumentsDownload())

    await result.downloadDocuments()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocuments)).toHaveBeenCalledWith(1971)
    expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(expect.any(Blob), 'all-first.pdf')
    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(expect.any(Blob), 'all-second.pdf')
  })

  it('does nothing when no entity is selected', async () => {
    setCurrentEntity(undefined)
    const [result] = withSetup(() => useDocumentsDownload())

    await result.downloadDocuments()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocuments)).not.toHaveBeenCalled()
    expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).not.toHaveBeenCalled()
    expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
  })

  it('toggles the downloading flag during the download', async () => {
    setCurrentEntity(1971)
    const [result] = withSetup(() => useDocumentsDownload())
    result.selectedDocuments.value = [getDocumentsListItemMock()]

    const promise = result.downloadDocuments()
    expect(result.isDownloading.value).toBe(true)

    await promise
    expect(result.isDownloading.value).toBe(false)
  })

  it('notifies and resets the flag when a download fails', async () => {
    setCurrentEntity(1971)
    vi.mocked(ConformityDocumentsService.getConformityDocumentContent).mockRejectedValueOnce(new Error('network error'))
    const [result] = withSetup(() => useDocumentsDownload())
    result.selectedDocuments.value = [getDocumentsListItemMock()]

    await result.downloadDocuments()
    await flushPromises()

    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'entities.prospect.documents.downloadError')
    expect(result.isDownloading.value).toBe(false)
  })

  it('continues downloading the remaining documents when one fails', async () => {
    setCurrentEntity(1971)
    vi.mocked(ConformityDocumentsService.getConformityDocumentContent)
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(new Blob(['binary']))
    const [result] = withSetup(() => useDocumentsDownload())
    result.selectedDocuments.value = [
      getDocumentsListItemMock({ documentId: 'doc-1', documentName: 'first.pdf' }),
      getDocumentsListItemMock({ documentId: 'doc-2', documentName: 'second.pdf' }),
    ]

    await result.downloadDocuments()
    await flushPromises()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(downloadFile)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(expect.any(Blob), 'second.pdf')
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'entities.prospect.documents.downloadError')
  })

  it('ignores re-entrant calls while a download is already in progress', async () => {
    setCurrentEntity(1971)
    const [result] = withSetup(() => useDocumentsDownload())
    result.selectedDocuments.value = [getDocumentsListItemMock()]

    const firstCall = result.downloadDocuments()
    await result.downloadDocuments()

    await firstCall
    await flushPromises()

    expect(vi.mocked(ConformityDocumentsService.getConformityDocumentContent)).toHaveBeenCalledTimes(1)
  })
})
