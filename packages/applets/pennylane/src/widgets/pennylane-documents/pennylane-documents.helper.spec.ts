import { getMockedPennylaneDocument } from '@pulse/common/mocks'
import { getFormattedPennylaneDocuments } from './pennylane-documents.helper'

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
        path: `${pathPrefix}${pennylaneDocument.path}`,
      }]

      const formattedDocuments = getFormattedPennylaneDocuments(pennylaneDocuments, pathPrefix)

      expect(formattedDocuments).toStrictEqual(expectedFormattedDocuments)
    })
  })
})
