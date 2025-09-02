import { getMockedPennylaneDocument } from '@pulse/common/mocks'
import { getFileExtension, logger } from '@pulse/core'
import { getIconFileName, displayNotification } from '@pulse/styleguide'
import { downloadFile } from '@pulse/common/helpers'
import type { IconName } from '@pulse/styleguide/types'

import { getFormattedPennylaneDocuments, downloadDocument } from './pennylane-documents.helper'

vi.mock('@pulse/core')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/common/helpers')

const loggerSpy = vi.mocked(logger)
const getFileExtensionSpy = vi.mocked(getFileExtension)
const getIconFileNameSpy = vi.mocked(getIconFileName)
const downloadFileSpy = vi.mocked(downloadFile)
const displayNotificationSpy = vi.mocked(displayNotification)

const fileExtensionMock = 'pdf'
const iconNameMock: IconName = 'bell'

describe('pennylane-documents.helper', () => {
  describe('getFormattedPennylaneDocuments', () => {
    it('should return formatted documents with the correct path prefix', () => {
      getFileExtensionSpy.mockReturnValue(fileExtensionMock)
      getIconFileNameSpy.mockReturnValue(iconNameMock)

      const pathPrefix = 'PennylanePrefix'
      const pennylaneDocument = getMockedPennylaneDocument()
      const pennylaneDocuments = [
        pennylaneDocument,
      ]
      const expectedFormattedDocuments = [{
        ...pennylaneDocument,
        iconName: iconNameMock,
        path: `${pathPrefix}${pennylaneDocument.path}`,
      }]

      const formattedDocuments = getFormattedPennylaneDocuments(pennylaneDocuments, pathPrefix)

      expect(formattedDocuments).toStrictEqual(expectedFormattedDocuments)

      expect(getFileExtensionSpy).toHaveBeenCalledWith(pennylaneDocument.name)
      expect(getIconFileNameSpy).toHaveBeenCalledWith(fileExtensionMock, 'filetypeTxt')
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

      expect(downloadFileSpy).toHaveBeenCalledOnce()
      expect(downloadFileSpy).toHaveBeenCalledWith(documentSrc, documentName)

      expect(displayNotificationSpy).toHaveBeenCalledOnce()
      expect(displayNotificationSpy).toHaveBeenCalledWith('success', successMessage)

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

      expect(displayNotificationSpy).toHaveBeenCalledOnce()
      expect(displayNotificationSpy).toHaveBeenCalledWith('error', errorMessage)

      expect(loggerSpy.error).toHaveBeenCalledOnce()
      expect(loggerSpy.error).toHaveBeenCalledWith(...expectedErrorMessage)
    })
  })
})
