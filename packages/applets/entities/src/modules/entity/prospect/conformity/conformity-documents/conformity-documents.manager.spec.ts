import { getPendingRequiredDocumentMock, getRequiredDocumentMock } from '@entities/__mocks__'
import { ConformityDocumentType } from '@entities/enums'
import { ConformityDocumentsManager } from './conformity-documents.manager'

const fileMock = new File(['content'], 'kbis.pdf', { type: 'application/pdf' })

describe('ConformityDocumentsManager', () => {
  describe('isUploaded', () => {
    it('should return true when a file has been uploaded', () => {
      expect(ConformityDocumentsManager.isUploaded(getRequiredDocumentMock())).toBe(true)
    })

    it('should return false when no file has been uploaded', () => {
      expect(ConformityDocumentsManager.isUploaded(getPendingRequiredDocumentMock())).toBe(false)
    })
  })

  describe('getPendingUploads', () => {
    it('should keep only the entries that hold a File and map them to type/file pairs', () => {
      const result = ConformityDocumentsManager.getPendingUploads({
        [ConformityDocumentType.KBIS]: fileMock,
        [ConformityDocumentType.DECLARATION_BENEFICIAIRES_EFFECTIFS]: undefined,
      })

      expect(result).toEqual([{ type: ConformityDocumentType.KBIS, file: fileMock }])
    })

    it('should return an empty array when no file is selected', () => {
      expect(ConformityDocumentsManager.getPendingUploads({ [ConformityDocumentType.KBIS]: undefined })).toEqual([])
    })
  })

  describe('hasPendingUploads', () => {
    it('should return true when at least one file is selected', () => {
      expect(ConformityDocumentsManager.hasPendingUploads({ [ConformityDocumentType.KBIS]: fileMock })).toBe(true)
    })

    it('should return false when no file is selected', () => {
      expect(ConformityDocumentsManager.hasPendingUploads({ [ConformityDocumentType.KBIS]: undefined })).toBe(false)
    })
  })

  describe('areAllDocumentsUploaded', () => {
    it('should return true when every required document has an uploaded file', () => {
      expect(ConformityDocumentsManager.areAllDocumentsUploaded([
        getRequiredDocumentMock(),
        getRequiredDocumentMock({ type: ConformityDocumentType.STATUTS }),
      ])).toBe(true)
    })

    it('should return false when one required document is still pending', () => {
      expect(ConformityDocumentsManager.areAllDocumentsUploaded([
        getRequiredDocumentMock(),
        getPendingRequiredDocumentMock(),
      ])).toBe(false)
    })

    it('should return false when there is no required document', () => {
      expect(ConformityDocumentsManager.areAllDocumentsUploaded([])).toBe(false)
    })
  })

  describe('canMarkCompleted', () => {
    it('should return true when the section is not complete yet and all documents are uploaded', () => {
      expect(ConformityDocumentsManager.canMarkCompleted(false, [getRequiredDocumentMock()])).toBe(true)
    })

    it('should return false when the section is already complete', () => {
      expect(ConformityDocumentsManager.canMarkCompleted(true, [getRequiredDocumentMock()])).toBe(false)
    })

    it('should return false when a document is still pending', () => {
      expect(ConformityDocumentsManager.canMarkCompleted(false, [getPendingRequiredDocumentMock()])).toBe(false)
    })
  })
})
