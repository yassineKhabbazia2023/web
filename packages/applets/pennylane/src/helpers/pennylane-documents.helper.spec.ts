import { getMockedPennylaneDocument } from '@pulse/common/mocks'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { downloadFile } from '@pulse/common/helpers'

import { getFormattedPennylaneDocuments, downloadDocument } from './pennylane-documents.helper'

const loggerSpy = vi.mocked(logger)
const downloadFileSpy = vi.mocked(downloadFile)
const displayNotificationSpy = vi.mocked(displayNotification)

beforeEach(() => {
  downloadFileSpy.mockImplementation(() => undefined)
})

describe('pennylane-documents.helper', () => {
  describe('getFormattedPennylaneDocuments', () => {
    it('should return formatted documents with the correct path prefix', () => {
      const pathPrefix = 'PennylanePrefix'
      const pennylaneDocument = getMockedPennylaneDocument()
      const pennylaneDocuments = [
        pennylaneDocument,
      ]
      const expectedFormattedDocuments = [{
        ...pennylaneDocument,
        iconName: 'filetypePng',
        path: `${pathPrefix}${pennylaneDocument.path}`,
      }]

      const formattedDocuments = getFormattedPennylaneDocuments(pennylaneDocuments, pathPrefix)

      expect(formattedDocuments).toStrictEqual(expectedFormattedDocuments)
    })
  })

  describe('downloadDocument', () => {
    const documentSrc = 'document-src-mock'
    const documentName = 'document-name'
    const successMessage = 'success-message'
    const errorMessage = 'error-message'

    it('should call downloadFile with the correct parameters and display a success notification', () => {
      downloadDocument({
        documentSrc,
        documentName,
        successMessage,
        errorMessage,
      })

      expect(downloadFileSpy).toHaveBeenCalledExactlyOnceWith(documentSrc, documentName)

      expect(displayNotificationSpy).toHaveBeenCalledExactlyOnceWith('success', successMessage)

      expect(loggerSpy.error).not.toHaveBeenCalled()
    })

    it('should display an error notification if downloadFile throws an error', () => {

      const errorMessageMock = new Error('download-error-mock')
      downloadFileSpy.mockImplementation(() => {
        throw errorMessageMock
      })
      const expectedErrorMessage = [
        'Something wrong occurred',
        errorMessageMock,
      ]

      downloadDocument({
        documentSrc,
        documentName,
        successMessage,
        errorMessage,
      })

      expect(downloadFileSpy).toHaveBeenCalledOnce()

      expect(displayNotificationSpy).toHaveBeenCalledExactlyOnceWith('error', errorMessage)

      expect(loggerSpy.error).toHaveBeenCalledExactlyOnceWith(...expectedErrorMessage)
    })
  })
})
