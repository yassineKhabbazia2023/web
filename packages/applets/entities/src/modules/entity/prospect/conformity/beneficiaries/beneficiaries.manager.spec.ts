import { BeneficiariesManager } from './beneficiaries.manager'
import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import {
  getBeneficiaryDocumentMock,
  getBeneficiaryFormStateMock,
  getBeneficiaryMock,
  getFileMock,
} from '@entities/__mocks__/beneficiaries.mocks'

describe('beneficiaries.manager', () => {
  describe('buildFormState', () => {
    it('should build a form state prefilled with the beneficiary data', () => {
      const beneficiary = getBeneficiaryMock({
        firstName: 'Marc',
        lastName: 'Martin',
        documentType: BeneficiaryDocumentType.PASSPORT,
      })

      const formState = BeneficiariesManager.buildFormState(beneficiary)

      expect(formState).toEqual({
        documentType: BeneficiaryDocumentType.PASSPORT,
        firstName: 'Marc',
        lastName: 'Martin',
        files: [],
      })
    })
  })

  describe('getSelectedFiles', () => {
    it('should return only the files actually present in the zone slots', () => {
      const file = getFileMock('cni-verso.pdf')
      const formState = getBeneficiaryFormStateMock({ files: [undefined, file] })

      expect(BeneficiariesManager.getSelectedFiles(formState)).toEqual([file])
    })

    it('should return an empty array when the form state is undefined', () => {
      expect(BeneficiariesManager.getSelectedFiles(undefined)).toEqual([])
    })
  })

  describe('getAttachmentsCount', () => {
    it('should add the uploaded documents and the locally selected files', () => {
      const beneficiary = getBeneficiaryMock({ documents: [getBeneficiaryDocumentMock()] })
      const formState = getBeneficiaryFormStateMock({ files: [getFileMock()] })

      expect(BeneficiariesManager.getAttachmentsCount(beneficiary, formState)).toBe(2)
    })

    it('should ignore the empty zone slots left by rejected files', () => {
      const beneficiary = getBeneficiaryMock({ documents: [] })
      const formState = getBeneficiaryFormStateMock({ files: [undefined, getFileMock('cni-verso.pdf')] })

      expect(BeneficiariesManager.getAttachmentsCount(beneficiary, formState)).toBe(1)
    })

    it('should only count the uploaded documents when the form state is undefined', () => {
      const beneficiary = getBeneficiaryMock({ documents: [getBeneficiaryDocumentMock()] })

      expect(BeneficiariesManager.getAttachmentsCount(beneficiary, undefined)).toBe(1)
    })
  })

  describe('isFormStateDirty', () => {
    const beneficiary = getBeneficiaryMock({
      firstName: 'Jeanne',
      lastName: 'Dupont',
      documentType: BeneficiaryDocumentType.CNI,
    })

    const getPristineFormState = () => getBeneficiaryFormStateMock({
      firstName: 'Jeanne',
      lastName: 'Dupont',
      documentType: BeneficiaryDocumentType.CNI,
      files: [],
    })

    it('should return false when nothing changed', () => {
      expect(BeneficiariesManager.isFormStateDirty(beneficiary, getPristineFormState())).toBe(false)
    })

    it.each([
      { change: 'documentType', overrides: { documentType: BeneficiaryDocumentType.PASSPORT } },
      { change: 'firstName', overrides: { firstName: 'Marc' } },
      { change: 'lastName', overrides: { lastName: 'Martin' } },
      { change: 'files', overrides: { files: [getFileMock()] } },
    ])('should return true when $change changed', ({ overrides }) => {
      const formState = { ...getPristineFormState(), ...overrides }

      expect(BeneficiariesManager.isFormStateDirty(beneficiary, formState)).toBe(true)
    })

    it('should return false when the only change is an emptied zone slot', () => {
      const formState = { ...getPristineFormState(), files: [undefined] }

      expect(BeneficiariesManager.isFormStateDirty(beneficiary, formState)).toBe(false)
    })

    it('should return false when the form state is undefined', () => {
      expect(BeneficiariesManager.isFormStateDirty(beneficiary, undefined)).toBe(false)
    })
  })

  describe('hasRequiredFilesCount', () => {
    it.each([
      {
        label: 'a CNI with two attachments in total',
        documentType: BeneficiaryDocumentType.CNI,
        documentsCount: 1,
        filesCount: 1,
        expected: true,
      },
      {
        label: 'a CNI with a single attachment',
        documentType: BeneficiaryDocumentType.CNI,
        documentsCount: 0,
        filesCount: 1,
        expected: false,
      },
      {
        label: 'a passport with a single file',
        documentType: BeneficiaryDocumentType.PASSPORT,
        documentsCount: 0,
        filesCount: 1,
        expected: true,
      },
      {
        label: 'a passport with two attachments',
        documentType: BeneficiaryDocumentType.PASSPORT,
        documentsCount: 1,
        filesCount: 1,
        expected: false,
      },
    ])('should return $expected for $label', ({ documentType, documentsCount, filesCount, expected }) => {
      const beneficiary = getBeneficiaryMock({
        documents: Array.from({ length: documentsCount }, () => getBeneficiaryDocumentMock()),
      })
      const formState = getBeneficiaryFormStateMock({
        documentType,
        files: Array.from({ length: filesCount }, () => getFileMock()),
      })

      expect(BeneficiariesManager.hasRequiredFilesCount(beneficiary, formState)).toBe(expected)
    })

    it('should return false when the form state is undefined', () => {
      expect(BeneficiariesManager.hasRequiredFilesCount(getBeneficiaryMock(), undefined)).toBe(false)
    })
  })

  describe('canSaveDocuments', () => {
    it('should allow saving a CNI when both zones hold a valid file', () => {
      const formState = getBeneficiaryFormStateMock({
        documentType: BeneficiaryDocumentType.CNI,
        files: [getFileMock('cni-recto.pdf'), getFileMock('cni-verso.pdf')],
      })

      expect(BeneficiariesManager.canSaveDocuments(getBeneficiaryMock(), formState)).toBe(true)
    })

    it('should block saving a CNI when a zone slot is empty because its file was rejected', () => {
      const formState = getBeneficiaryFormStateMock({
        documentType: BeneficiaryDocumentType.CNI,
        files: [undefined, getFileMock('cni-verso.pdf')],
      })

      expect(BeneficiariesManager.canSaveDocuments(getBeneficiaryMock(), formState)).toBe(false)
    })

    it('should block saving when no document type is selected', () => {
      const formState = getBeneficiaryFormStateMock({ documentType: null })

      expect(BeneficiariesManager.canSaveDocuments(getBeneficiaryMock(), formState)).toBe(false)
    })
  })

  describe('canAddFiles', () => {
    it('should return true when the attachments count is below the maximum', () => {
      const beneficiary = getBeneficiaryMock({ documents: [getBeneficiaryDocumentMock()] })
      const formState = getBeneficiaryFormStateMock({ files: [] })

      expect(BeneficiariesManager.canAddFiles(beneficiary, formState)).toBe(true)
    })

    it('should return false when the maximum number of attachments is reached', () => {
      const beneficiary = getBeneficiaryMock({ documents: [getBeneficiaryDocumentMock()] })
      const formState = getBeneficiaryFormStateMock({ files: [getFileMock()] })

      expect(BeneficiariesManager.canAddFiles(beneficiary, formState)).toBe(false)
    })
  })

  describe('setFileAtZone', () => {
    it('should place the file at its zone without touching the other slots', () => {
      const recto = getFileMock('cni-recto.pdf')
      const verso = getFileMock('cni-verso.pdf')

      expect(BeneficiariesManager.setFileAtZone([recto], 1, verso)).toEqual([recto, verso])
    })

    it('should fill the skipped zones with undefined so the layout never shifts', () => {
      const verso = getFileMock('cni-verso.pdf')

      expect(BeneficiariesManager.setFileAtZone([], 1, verso)).toEqual([undefined, verso])
    })

    it('should replace the file already held by the targeted zone', () => {
      const oldRecto = getFileMock('old-recto.pdf')
      const newRecto = getFileMock('new-recto.pdf')

      expect(BeneficiariesManager.setFileAtZone([oldRecto], 0, newRecto)).toEqual([newRecto])
    })

    it('should not mutate the original array', () => {
      const files = [getFileMock('cni-recto.pdf')]

      BeneficiariesManager.setFileAtZone(files, 1, getFileMock('cni-verso.pdf'))

      expect(files).toHaveLength(1)
    })
  })

  describe('clearFileAtZone', () => {
    it('should empty the targeted zone without shifting the others', () => {
      const recto = getFileMock('cni-recto.pdf')
      const verso = getFileMock('cni-verso.pdf')

      expect(BeneficiariesManager.clearFileAtZone([recto, verso], 0)).toEqual([undefined, verso])
    })

    it('should not mutate the original array', () => {
      const recto = getFileMock('cni-recto.pdf')
      const files = [recto]

      BeneficiariesManager.clearFileAtZone(files, 0)

      expect(files).toEqual([recto])
    })
  })

  describe('getDocumentForZone', () => {
    it('should return document with matching fileOrder for CNI type', () => {
      const doc1 = getBeneficiaryDocumentMock({ fileOrder: 1 })
      const doc2 = getBeneficiaryDocumentMock({ fileOrder: 2 })
      const beneficiary = getBeneficiaryMock({
        documentType: BeneficiaryDocumentType.CNI,
        documents: [doc1, doc2],
      })

      expect(BeneficiariesManager.getDocumentForZone(beneficiary, 0)).toBe(doc1)
      expect(BeneficiariesManager.getDocumentForZone(beneficiary, 1)).toBe(doc2)
    })

    it('should return document by array index for Passport type', () => {
      const doc1 = getBeneficiaryDocumentMock()
      const beneficiary = getBeneficiaryMock({
        documentType: BeneficiaryDocumentType.PASSPORT,
        documents: [doc1],
      })

      expect(BeneficiariesManager.getDocumentForZone(beneficiary, 0)).toBe(doc1)
    })

    it('should return undefined when no document matches for CNI', () => {
      const beneficiary = getBeneficiaryMock({
        documentType: BeneficiaryDocumentType.CNI,
        documents: [],
      })

      expect(BeneficiariesManager.getDocumentForZone(beneficiary, 0)).toBeUndefined()
    })

    it('should return undefined when zone index out of bounds for Passport', () => {
      const beneficiary = getBeneficiaryMock({
        documentType: BeneficiaryDocumentType.PASSPORT,
        documents: [],
      })

      expect(BeneficiariesManager.getDocumentForZone(beneficiary, 0)).toBeUndefined()
    })
  })
})
