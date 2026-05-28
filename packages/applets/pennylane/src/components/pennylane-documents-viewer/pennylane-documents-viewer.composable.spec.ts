import { PennylaneService } from '@pulse/common/services/pennylane'
import { usePennylaneDocumentViewer } from './pennylane-documents-viewer.composable'
import { APICallStatus } from '@pulse/common/enums'
import { getDocumentType, getDocumentPreviewImage } from './pennylane-documents-viewer.helper'
import { logger, getFileExtension } from '@pulse/toolbox'
import { HTTP_RESPONSES } from '@pulse/common/constants'

vi.mock('@pulse/common/services/pennylane')
vi.mock('@pulse/toolbox')
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
    vi.mocked(PennylaneService.getDocumentContent).mockResolvedValue(documentContentMock)
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

  const tests = [{
    errorMock: 'error-mock',
    expectedErrorStatus: undefined,
    description: 'any error occurred',
  }, {
    errorMock: {
      status: HTTP_RESPONSES.NOT_FOUND,
    },
    expectedErrorStatus: HTTP_RESPONSES.NOT_FOUND,
    description: 'a 404 error occurred',
  }, {
    errorMock: {
      status: HTTP_RESPONSES.CONFLICT,
    },
    expectedErrorStatus: HTTP_RESPONSES.CONFLICT,
    description: 'any http error occurred',
  }]
  it.each(tests)('should handle error properly when $description', async ({
    errorMock,
    expectedErrorStatus,
  }) => {
    const expectedErrorMessage = 'Error while loading document content:'
    const {
      apiCallStatus,
      iconName,
      previewImage,
      fileExtension,
      errorStatus,
      loadDocument,
    } = usePennylaneDocumentViewer(technicalErrorMessageMock)

    vi.mocked(PennylaneService.getDocumentContent).mockRejectedValue(errorMock)

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
    expect(errorStatus.value).toBe(expectedErrorStatus)
    expect(vi.mocked(logger).error).toHaveBeenCalledWith(expectedErrorMessage, errorMock)
  })
})
