import type {
  BeneficiaryDocument,
  ConformityDocument,
  ConformityDocumentsResponse,
  SupportingDocument,
  SupportingDocumentItem,
  SupportingDocumentsResponse,
  UploadedSupportingDocument,
} from '@entities/services/conformity-documents'
import { BeneficiaryDocumentType, SupportingDocumentType } from '@entities/enums'

export const getSupportingDocumentMock = (
  overrides: Partial<SupportingDocument> = {},
): SupportingDocument => ({
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
  documentType: SupportingDocumentType.KBIS,
  fileName: 'kbis_acme.pdf',
  contentType: 'application/pdf',
  uploadedAt: '2026-06-10T14:32:00Z',
  uploadedBy: 'marie.dupont@rydge.fr',
  ...overrides,
})

// A free-form complementary document is a supporting document of type COMPLEMENTARY.
export const getComplementaryDocumentMock = (
  overrides: Partial<SupportingDocument> = {},
): SupportingDocument => ({
  id: '8c93d2b9-6728-5673-c4gd-3d074g77bgb0',
  documentType: SupportingDocumentType.COMPLEMENTARY,
  fileName: 'contrat_location.pdf',
  contentType: 'application/pdf',
  uploadedAt: '2026-06-12T10:00:00Z',
  uploadedBy: 'marie.dupont@rydge.fr',
  ...overrides,
})

export const getBeneficiaryDocumentMock = (
  overrides: Partial<BeneficiaryDocument> = {},
): BeneficiaryDocument => ({
  id: 'd4e5f6a7-b890-1234-cdef-567890abcdef',
  beneficiaryId: '148cf2c3-ccfa-44d0-addd-1b46a4a6f2f9',
  documentType: BeneficiaryDocumentType.CNI,
  fileOrder: 1,
  fileName: 'cni_recto.jpg',
  contentType: 'image/jpeg',
  uploadedAt: '2026-06-09T11:00:00Z',
  uploadedBy: 'jean.martin@rydge.fr',
  ...overrides,
})

export const getConformityDocumentMock = (
  overrides: Partial<ConformityDocument> = {},
): ConformityDocument => ({
  id: '3fa85f64-5717-4562-b3fc-2c963f66afb0',
  fileName: 'proposition_commerciale_acme.pdf',
  contentType: 'application/pdf',
  uploadedAt: '2026-06-11T09:00:00Z',
  uploadedBy: 'jean.martin@rydge.fr',
  ...overrides,
})

export const getConformityDocumentsResponseMock = (
  overrides: Partial<ConformityDocumentsResponse> = {},
): ConformityDocumentsResponse => ({
  prospectId: 602,
  supportingDocuments: [getSupportingDocumentMock(), getComplementaryDocumentMock()],
  beneficiaryDocuments: [getBeneficiaryDocumentMock()],
  commercialProposal: getConformityDocumentMock(),
  engagementLetter: getConformityDocumentMock({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afb2',
    fileName: 'lettre_mission_acme.pdf',
  }),
  ...overrides,
})

// Dedicated /supporting-documents endpoint: each type paired with its uploaded documents.
export const getUploadedSupportingDocumentMock = (
  overrides: Partial<UploadedSupportingDocument> = {},
): UploadedSupportingDocument => ({
  id: 123,
  fileName: 'kbis_acme.pdf',
  ...overrides,
})

export const getSupportingDocumentItemMock = (
  overrides: Partial<SupportingDocumentItem> = {},
): SupportingDocumentItem => ({
  type: SupportingDocumentType.KBIS,
  documents: [],
  maxFiles: 1,
  ...overrides,
})

export const getSupportingDocumentsResponseMock = (
  overrides: Partial<SupportingDocumentsResponse> = {},
): SupportingDocumentsResponse => ({
  documents: [
    getSupportingDocumentItemMock({
      type: SupportingDocumentType.KBIS,
      documents: [getUploadedSupportingDocumentMock()],
      maxFiles: 1,
    }),
    getSupportingDocumentItemMock({ type: SupportingDocumentType.STATUTS, documents: [], maxFiles: 2 }),
    getSupportingDocumentItemMock({
      type: SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION,
      documents: [],
      maxFiles: 1,
    }),
    getSupportingDocumentItemMock({ type: SupportingDocumentType.PREFECTURE_DECLARATION, documents: [], maxFiles: 1 }),
    getSupportingDocumentItemMock({
      type: SupportingDocumentType.COMPLEMENTARY,
      documents: [getUploadedSupportingDocumentMock({ id: 200, fileName: 'contrat_location.pdf' })],
      maxFiles: 10,
    }),
  ],
  ...overrides,
})
