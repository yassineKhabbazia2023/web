import type { FileExtension } from '@pulse/toolbox/types'
import { getDocumentType, getDocumentPreviewImage } from './pennylane-documents-viewer.helper'

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
      // Spy the static method on the real URL: replacing the constructor
      // would break the import-time `new URL(...)` of files collected while
      // this test runs (collection is pipelined on a shared worker).
      const createObjectURLMock = vi.spyOn(URL, 'createObjectURL').mockReturnValue(expectedPreviewImage)

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
