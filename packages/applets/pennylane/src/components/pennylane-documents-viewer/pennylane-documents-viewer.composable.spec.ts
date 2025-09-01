import { PennylaneService } from '@pulse/common/services/pennylane'
import { usePennylaneDocumentViewer } from './pennylane-documents-viewer.composable'
import { APICallStatus } from '@pulse/common/enums'
import { getDocumentType, getDocumentPreviewImage } from './pennylane-documents-viewer.helper'
import { logger, getFileExtension } from '@pulse/core'

vi.mock('@pulse/common/services/pennylane')
vi.mock('@pulse/core')
vi.mock('./pennylane-documents-viewer.helper')

const technicalErrorMessageMock = 'An error occurred while loading the document. Please try again later.'
const documentNameMock = 'example-document.pdf'
const accountNumberMock = '1234567890'
const accountIdMock = 26
const documentIdMock = 12345
const previewImageMock = 'preview-image-mock'
const documentTypeMock = 'document-type-mock'
const fileExtensionMock = 'pdf'

describe('pennylane-documents-viewer.composable', () => {
  it('should return proper initial state', () => {
    const {
      apiCallStatus,
      iconName,
      previewImage,
      fileExtension,
    } = usePennylaneDocumentViewer(technicalErrorMessageMock)

    expect(apiCallStatus.value).toBe(APICallStatus.IDLE)
    expect(iconName.value).toBeUndefined()
    expect(previewImage.value).toBe('')
    expect(fileExtension.value).toBeUndefined()
  })

  it('should load document content properly', async () => {
    const {
      apiCallStatus,
      iconName,
      previewImage,
      fileExtension,
      loadDocument,
    } = usePennylaneDocumentViewer(technicalErrorMessageMock)

    const documentContentMock = 'mocked-document-content'
    vi.mocked(PennylaneService).getDocumentContent.mockResolvedValue(documentContentMock)
    vi.mocked(getFileExtension).mockReturnValue(fileExtensionMock)

    vi.mocked(getDocumentType).mockReturnValue(documentTypeMock)
    vi.mocked(getDocumentPreviewImage).mockReturnValue(previewImageMock)

    await loadDocument({
      documentName: documentNameMock,
      accountNumber: accountNumberMock,
      documentId: documentIdMock,
      accountId: accountIdMock,
    })

    expect(vi.mocked(getDocumentType)).toHaveBeenCalledWith(fileExtensionMock)
    expect(vi.mocked(getDocumentPreviewImage)).toHaveBeenCalledWith(documentContentMock, documentTypeMock)
    expect(apiCallStatus.value).toBe(APICallStatus.SUCCESS)
    expect(iconName.value).toBe('filetypePdf')
    expect(fileExtension.value).toBe(fileExtensionMock)
    expect(previewImage.value).toBe(previewImageMock)
  })

  it('should handle error properly', async () => {
    const errorMock = 'error-mock'
    const expectedErrorMessage = 'Error while loading document content:'
    const {
      apiCallStatus,
      iconName,
      previewImage,
      fileExtension,
      loadDocument,
    } = usePennylaneDocumentViewer(technicalErrorMessageMock)

    vi.mocked(PennylaneService).getDocumentContent.mockRejectedValue(errorMock)

    vi.mocked(getDocumentType).mockReturnValue(documentTypeMock)
    vi.mocked(getDocumentPreviewImage).mockReturnValue(previewImageMock)

    await loadDocument({
      documentName: documentNameMock,
      accountNumber: accountNumberMock,
      documentId: documentIdMock,
      accountId: accountIdMock,
    })

    expect(vi.mocked(getDocumentType)).not.toHaveBeenCalled()
    expect(vi.mocked(getDocumentPreviewImage)).not.toHaveBeenCalled()
    expect(apiCallStatus.value).toBe(APICallStatus.ERROR)
    expect(iconName.value).toBeUndefined()
    expect(previewImage.value).toBe('')
    expect(fileExtension.value).toBeUndefined()
    expect(vi.mocked(logger).error).toHaveBeenCalledWith(expectedErrorMessage, errorMock)
  })
})
