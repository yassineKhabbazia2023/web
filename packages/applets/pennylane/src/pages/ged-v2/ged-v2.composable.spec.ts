import { ref } from 'vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { downloadFile } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import type { PennylaneDocumentsArchive } from '@pulse/common/types'
import { useGedV2DocumentsArchiveDownload } from './ged-v2.composable'

const accountNumberMock = '2025546345'
const accountIdMock = 602
const successMessageMock = 'success-message'
const errorMessageMock = 'error-message'
const archiveContentMock = new ArrayBuffer(8)

function setupArchiveDownload(selectedDocumentIds = [34442317824, 7601833]) {
  const selectedDocumentIdsRef = ref(selectedDocumentIds)

  return {
    selectedDocumentIds: selectedDocumentIdsRef,
    ...useGedV2DocumentsArchiveDownload({
      accountNumber: accountNumberMock,
      accountId: accountIdMock,
      selectedDocumentIds: selectedDocumentIdsRef,
      successMessage: () => successMessageMock,
      errorMessage: () => errorMessageMock,
    }),
  }
}

beforeEach(() => {
  vi.mocked(downloadFile).mockImplementation(() => undefined)
})

describe('ged-v2.composable', () => {
  it('should not be downloading initially', () => {
    const { isDownloadingArchive } = setupArchiveDownload()

    expect(isDownloadingArchive.value).toBe(false)
  })

  it('should download the archive with its file name, clear the selection and notify success', async () => {
    vi.spyOn(PennylaneService, 'getDocumentsArchive').mockResolvedValue({
      content: archiveContentMock,
      contentDisposition: 'attachment; filename=documents-rydge-conseil_17-09-2026.zip',
    })
    const { selectedDocumentIds, isDownloadingArchive, downloadSelectedDocuments } = setupArchiveDownload()

    await downloadSelectedDocuments()

    expect(vi.mocked(PennylaneService.getDocumentsArchive)).toHaveBeenCalledExactlyOnceWith(
      accountNumberMock,
      accountIdMock,
      [34442317824, 7601833],
    )
    expect(vi.mocked(downloadFile))
      .toHaveBeenCalledExactlyOnceWith(archiveContentMock, 'documents-rydge-conseil_17-09-2026.zip')
    expect(selectedDocumentIds.value).toStrictEqual([])
    expect(vi.mocked(displayNotification)).toHaveBeenCalledExactlyOnceWith('success', successMessageMock)
    expect(isDownloadingArchive.value).toBe(false)
  })

  it('should fall back to the default file name when content disposition is missing', async () => {
    vi.spyOn(PennylaneService, 'getDocumentsArchive').mockResolvedValue({
      content: archiveContentMock,
    })
    const { downloadSelectedDocuments } = setupArchiveDownload()

    await downloadSelectedDocuments()

    expect(vi.mocked(downloadFile)).toHaveBeenCalledExactlyOnceWith(archiveContentMock, 'documents.zip')
  })

  it('should be downloading while the archive is being fetched', async () => {
    let resolveArchive: (value: PennylaneDocumentsArchive) => void = () => undefined
    vi.spyOn(PennylaneService, 'getDocumentsArchive').mockReturnValue(new Promise((resolve) => {
      resolveArchive = resolve
    }))
    const { isDownloadingArchive, downloadSelectedDocuments } = setupArchiveDownload()

    const downloadPromise = downloadSelectedDocuments()

    expect(isDownloadingArchive.value).toBe(true)

    resolveArchive({ content: archiveContentMock })
    await downloadPromise

    expect(isDownloadingArchive.value).toBe(false)
  })

  it('should keep documents selected while the archive was being fetched', async () => {
    let resolveArchive: (value: PennylaneDocumentsArchive) => void = () => undefined
    vi.spyOn(PennylaneService, 'getDocumentsArchive').mockReturnValue(new Promise((resolve) => {
      resolveArchive = resolve
    }))
    const { selectedDocumentIds, downloadSelectedDocuments } = setupArchiveDownload([1, 2])

    const downloadPromise = downloadSelectedDocuments()
    selectedDocumentIds.value = [1, 3]
    resolveArchive({ content: archiveContentMock })
    await downloadPromise

    expect(vi.mocked(PennylaneService.getDocumentsArchive))
      .toHaveBeenCalledExactlyOnceWith(accountNumberMock, accountIdMock, [1, 2])
    expect(selectedDocumentIds.value).toStrictEqual([3])
  })

  it('should keep the selection and notify error when the returned archive is empty', async () => {
    vi.spyOn(PennylaneService, 'getDocumentsArchive').mockResolvedValue({
      content: new ArrayBuffer(0),
      contentDisposition: 'attachment; filename=documents-rydge-conseil_17-09-2026.zip',
    })
    const { selectedDocumentIds, isDownloadingArchive, downloadSelectedDocuments } = setupArchiveDownload()

    await downloadSelectedDocuments()

    expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
    expect(vi.mocked(logger.error)).toHaveBeenCalledExactlyOnceWith(
      'Error while downloading pennylane documents archive',
      new Error('The pennylane documents archive is empty'),
    )
    expect(selectedDocumentIds.value).toStrictEqual([34442317824, 7601833])
    expect(vi.mocked(displayNotification)).toHaveBeenCalledExactlyOnceWith('error', errorMessageMock)
    expect(isDownloadingArchive.value).toBe(false)
  })

  it('should log the error, keep the selection and notify error when the download fails', async () => {
    const errorMock = new Error('archive-error')
    vi.spyOn(PennylaneService, 'getDocumentsArchive').mockRejectedValue(errorMock)
    const { selectedDocumentIds, isDownloadingArchive, downloadSelectedDocuments } = setupArchiveDownload()

    await downloadSelectedDocuments()

    expect(vi.mocked(logger.error))
      .toHaveBeenCalledExactlyOnceWith('Error while downloading pennylane documents archive', errorMock)
    expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
    expect(selectedDocumentIds.value).toStrictEqual([34442317824, 7601833])
    expect(vi.mocked(displayNotification)).toHaveBeenCalledExactlyOnceWith('error', errorMessageMock)
    expect(isDownloadingArchive.value).toBe(false)
  })
})
