import { SupportingDocumentType } from '@entities/enums'
import { getSupportingDocumentItemMock, getUploadedSupportingDocumentMock } from '@entities/__mocks__'
import { SupportingDocumentsManager } from './supporting-documents.manager'

const fileMock = new File(['content'], 'kbis.pdf', { type: 'application/pdf' })

describe('SupportingDocumentsManager', () => {
  describe('getPendingUploads', () => {
    it('should flatten every selected file into type/file pairs', () => {
      const otherFile = new File(['content'], 'kbis-2.pdf', { type: 'application/pdf' })

      const result = SupportingDocumentsManager.getPendingUploads({
        [SupportingDocumentType.KBIS]: [fileMock, otherFile],
        [SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION]: undefined,
      })

      expect(result).toEqual([
        { type: SupportingDocumentType.KBIS, file: fileMock },
        { type: SupportingDocumentType.KBIS, file: otherFile },
      ])
    })

    it('should return an empty array when no file is selected', () => {
      expect(SupportingDocumentsManager.getPendingUploads({ [SupportingDocumentType.KBIS]: [] })).toEqual([])
    })
  })

  describe('hasPendingUploads', () => {
    it('should return true when at least one file is selected', () => {
      expect(SupportingDocumentsManager.hasPendingUploads({ [SupportingDocumentType.KBIS]: [fileMock] })).toBe(true)
    })

    it('should return false when no file is selected', () => {
      expect(SupportingDocumentsManager.hasPendingUploads({ [SupportingDocumentType.KBIS]: [] })).toBe(false)
    })
  })

  describe('areAllRequiredDocumentsProvided', () => {
    const kbisItem = getSupportingDocumentItemMock({ type: SupportingDocumentType.KBIS, documents: [] })
    const beneficialOwnerItem = getSupportingDocumentItemMock({
      type: SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION,
      documents: [],
    })

    it('should return false when a required type has neither a persisted nor a pending document', () => {
      const result = SupportingDocumentsManager.areAllRequiredDocumentsProvided(
        [kbisItem, beneficialOwnerItem],
        { [SupportingDocumentType.KBIS]: [fileMock] },
      )

      expect(result).toBe(false)
    })

    it('should return true when every required type has a pending document', () => {
      const result = SupportingDocumentsManager.areAllRequiredDocumentsProvided(
        [kbisItem, beneficialOwnerItem],
        {
          [SupportingDocumentType.KBIS]: [fileMock],
          [SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION]: [fileMock],
        },
      )

      expect(result).toBe(true)
    })

    it('should count an already persisted document as covering its type', () => {
      const result = SupportingDocumentsManager.areAllRequiredDocumentsProvided(
        [
          getSupportingDocumentItemMock({
            type: SupportingDocumentType.KBIS,
            documents: [getUploadedSupportingDocumentMock()],
          }),
          beneficialOwnerItem,
        ],
        { [SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION]: [fileMock] },
      )

      expect(result).toBe(true)
    })
  })
})
