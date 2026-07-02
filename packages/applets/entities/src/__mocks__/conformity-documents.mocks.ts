import type {
  ConformityDocument,
  SupportingDocumentItem,
  SupportingDocumentsResponse,
  UploadedSupportingDocument,
} from '@entities/services/conformity-documents'
import { SupportingDocumentType } from '@entities/enums'

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
