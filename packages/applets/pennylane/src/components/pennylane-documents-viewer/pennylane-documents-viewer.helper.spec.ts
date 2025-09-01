import type { FileExtension } from '@pulse/core/types'
import { getDocumentType, getDocumentPreviewImage } from './pennylane-documents-viewer.helper'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window

describe('pennylane-documents-viewer.helper', () => {
  describe('getDocumentType', () => {
    const tests: {
      fileExtension?: FileExtension
      expectedDocumentType: string
    }[] = [{
      fileExtension: 'pdf',
      expectedDocumentType: 'application/pdf',
    }, {
      fileExtension: 'jpg',
      expectedDocumentType: 'image/jpg',
    }, {
      fileExtension: undefined,
      expectedDocumentType: '',
    }]
    it.each(tests)('should return proper document type', ({
      fileExtension,
      expectedDocumentType,
    }) => {
      const documentType = getDocumentType(fileExtension)

      expect(documentType).toBe(expectedDocumentType)
    })
  })

  describe('getDocumentPreviewImage', () => {
    it('should return return properly', () => {
      const previewImageMock = 'preview-image-mock'
      const expectedPreviewImage = previewImageMock
      const createObjectURLMock = vi.fn()
      window.URL = {
        createObjectURL: createObjectURLMock,
      }
      createObjectURLMock.mockReturnValue(expectedPreviewImage)

      const documentSrcMock = 'document-src-mock'
      const documentTypeMock = 'application/pdf'

      const previewImage = getDocumentPreviewImage(
        documentSrcMock,
        documentTypeMock,
      )

      const blob = new Blob([documentSrcMock], {
        type: documentTypeMock,
      })
      expect(createObjectURLMock).toHaveBeenCalledWith(blob)
      expect(previewImage).toBe(expectedPreviewImage)
    })
  })
})
