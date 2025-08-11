import type { PennylaneDocument } from '@pulse/common/types'
import { getMockedPennylaneDocument } from '@pulse/common/mocks'
import { getFileExtension } from '@pulse/core'
import { getIconFileName } from '@pulse/styleguide'

import { getInternalPennylaneDocuments } from './pennylane-documents-with-result.utils'

vi.mock('@pulse/core')
vi.mock('@pulse/styleguide')

const getFileExtensionMock = vi.mocked(getFileExtension)
const getIconFileNameMock = vi.mocked(getIconFileName)

const YESTERDAY = '2023-09-01T00:00:00Z'
const TODAY = '2023-10-01T00:00:00Z'
const TOMORROW = '2023-11-01T00:00:00Z'

describe('pennylane-documents-result.utils', () => {
  describe('getInternalPennylaneDocuments', () => {
    it('should return properly', () => {
      const fileExtensionMock = 'pdf'
      const iconNameMock = 'filetypeTxt'

      const pennylaneDocumentMock = getMockedPennylaneDocument()
      const pennylaneDocuments: PennylaneDocument[] = [
        pennylaneDocumentMock,
      ]
      const {
        name,
      } = pennylaneDocumentMock

      const expected = [{
        pennylaneDocument: pennylaneDocumentMock,
        iconName: iconNameMock,
      }]
      getFileExtensionMock.mockReturnValue(fileExtensionMock)
      getIconFileNameMock.mockReturnValue(iconNameMock)

      const internalPennylaneDocuments = getInternalPennylaneDocuments(pennylaneDocuments)

      expect(getFileExtensionMock).toHaveBeenCalledWith(name)
      expect(getIconFileNameMock).toHaveBeenCalledWith(fileExtensionMock, 'filetypeTxt')
      expect(internalPennylaneDocuments).toStrictEqual(expected)
    })

    it('should limit to 4 documents', () => {
      const pennylaneDocuments: PennylaneDocument[] = [
        getMockedPennylaneDocument(),
        getMockedPennylaneDocument(),
        getMockedPennylaneDocument(),
        getMockedPennylaneDocument(),
        getMockedPennylaneDocument(),
      ]
      const expectedLength = 4

      const internalPennylaneDocuments = getInternalPennylaneDocuments(pennylaneDocuments)

      expect(internalPennylaneDocuments).toHaveLength(expectedLength)
    })

    it('should sort documents by updatedAt desc order', () => {
      const pennylaneDocuments: PennylaneDocument[] = [
        getMockedPennylaneDocument({
          name: 'today',
          updatedAt: TODAY,
        }),
        getMockedPennylaneDocument({
          name: 'tomorrow',
          updatedAt: TOMORROW,
        }),
        getMockedPennylaneDocument({
          name: 'yesterday',
          updatedAt: YESTERDAY,
        }),
      ]
      const expectedNames = [
        'tomorrow',
        'today',
        'yesterday',
      ]
      const internalPennylaneDocuments = getInternalPennylaneDocuments(pennylaneDocuments)
      const internalPennylaneDocumentsNames = internalPennylaneDocuments
        .map(({ pennylaneDocument }) => pennylaneDocument.name)

      expect(internalPennylaneDocumentsNames).toStrictEqual(expectedNames)
    })
  })
})
