import { getMockedPennylaneDocument } from '@pulse/common/mocks'
import { getFileExtension } from '@pulse/core'
import { getIconFileName } from '@pulse/styleguide'
import type { IconName } from '@pulse/styleguide/types'

import { getFormattedPennylaneDocuments } from './pennylane-documents.helper'

vi.mock('@pulse/core')
vi.mock('@pulse/styleguide')

const getFileExtensionMock = vi.mocked(getFileExtension)
const getIconFileNameMock = vi.mocked(getIconFileName)

const fileExtensionMock = 'pdf'
const iconNameMock: IconName = 'bell'

describe('pennylane-documents.helper', () => {
  describe('getFormattedPennylaneDocuments', () => {
    it('should return formatted documents with the correct path prefix', () => {
      getFileExtensionMock.mockReturnValue(fileExtensionMock)
      getIconFileNameMock.mockReturnValue(iconNameMock)

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

      expect(getFileExtensionMock).toHaveBeenCalledWith(pennylaneDocument.name)
      expect(getIconFileNameMock).toHaveBeenCalledWith(fileExtensionMock, 'filetypeTxt')
    })
  })
})
