import { ConformityDocumentsService } from './conformity-documents.service'
import { MOCKED_CONFORMITY_DOCUMENTS } from '@entities/__mocks__'

const prospectEntityId = 1971

describe('ConformityDocumentsService', () => {
  describe('getConformityDocuments', () => {
    it('should resolve with the mocked conformity documents', async () => {
      const documents = await ConformityDocumentsService.getConformityDocuments(prospectEntityId)

      expect(documents).toEqual(MOCKED_CONFORMITY_DOCUMENTS)
    })

    it('should expose every required field on each document', async () => {
      const documents = await ConformityDocumentsService.getConformityDocuments(prospectEntityId)

      expect(documents.length).toBeGreaterThan(0)
      documents.forEach((document) => {
        expect(document.id).toEqual(expect.any(String))
        expect(document.name).toEqual(expect.any(String))
        expect(document.depositDate).toEqual(expect.any(String))
        expect(document.depositedBy.firstName).toEqual(expect.any(String))
        expect(document.depositedBy.lastName).toEqual(expect.any(String))
        expect(document.downloadUrl).toEqual(expect.any(String))
      })
    })
  })
})
