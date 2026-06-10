import type { ConformityDocumentItem } from '@entities/services/conformity-documents'

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
