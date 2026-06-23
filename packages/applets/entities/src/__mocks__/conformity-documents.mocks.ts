import type {
  ConformityDocumentItem,
  ConformityDocumentsResponse,
  RequiredDocument,
} from '@entities/services/conformity-documents'
import { ConformityDocumentType } from '@entities/enums'

export const getRequiredDocumentMock = (
  overrides: Partial<RequiredDocument> = {},
): RequiredDocument => ({
  type: ConformityDocumentType.KBIS,
  label: 'Extrait Kbis',
  fileUploadedId: 42,
  fileName: 'kbis_acme.pdf',
  uploadedAt: '2026-06-10T14:32:00Z',
  depositedBy: { firstName: 'Marie', lastName: 'Dupont' },
  ...overrides,
})

export const getPendingRequiredDocumentMock = (
  overrides: Partial<RequiredDocument> = {},
): RequiredDocument => ({
  type: ConformityDocumentType.DECLARATION_BENEFICIAIRES_EFFECTIFS,
  label: 'Déclaration des bénéficiaires effectifs',
  fileUploadedId: null,
  fileName: null,
  uploadedAt: null,
  depositedBy: null,
  ...overrides,
})

export const getConformityDocumentsResponseMock = (
  overrides: Partial<ConformityDocumentsResponse> = {},
): ConformityDocumentsResponse => ({
  status: 'InProgress',
  isComplete: false,
  requiredDocs: [getRequiredDocumentMock(), getPendingRequiredDocumentMock()],
  ...overrides,
})

export const MOCKED_CONFORMITY_DOCUMENTS: ConformityDocumentItem[] = [
  {
    id: '1',
    name: 'CNI-recto.pdf',
    depositDate: '15/03/2024',
    depositedBy: { firstName: 'Marie', lastName: 'Dupont' },
    downloadUrl: 'https://mocked.local/conformity-documents/1/cni-recto.pdf',
  },
  {
    id: '2',
    name: 'CNI-verso.pdf',
    depositDate: '15/03/2024',
    depositedBy: { firstName: 'Marie', lastName: 'Dupont' },
    downloadUrl: 'https://mocked.local/conformity-documents/2/cni-verso.pdf',
  },
  {
    id: '3',
    name: 'DeclarationBeneficiaires.pdf',
    depositDate: '02/04/2024',
    depositedBy: { firstName: 'Jean', lastName: 'Martin' },
    downloadUrl: 'https://mocked.local/conformity-documents/3/declaration-beneficiaires.pdf',
  },
]
