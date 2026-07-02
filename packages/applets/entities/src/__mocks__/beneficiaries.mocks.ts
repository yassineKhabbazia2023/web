import { BeneficiaryDocumentType } from '../modules/entity/prospect/types'
import type { BeneficiariesResponse, Beneficiary, BeneficiaryDocument } from '../modules/entity/prospect/types'
import type { BeneficiaryFormState } from '../modules/entity/prospect/conformity/beneficiaries/beneficiaries.types'

export const getFileMock = (name: string = 'cni-recto.pdf', sizeInBytes?: number): File =>
  new File(
    [sizeInBytes === undefined ? 'content' : new Uint8Array(sizeInBytes)],
    name,
    { type: 'application/pdf' },
  )

export const getBeneficiaryDocumentMock = (
  overrides: Partial<BeneficiaryDocument> = {},
): BeneficiaryDocument => ({
  id: 'doc-guid-1',
  fileOrder: 0,
  fileName: 'cni-recto.pdf',
  contentType: 'application/pdf',
  uploadedAt: '2026-06-09T11:00:00Z',
  uploadedBy: 'test@rydge.fr',
  ...overrides,
})

export const getBeneficiaryMock = (overrides: Partial<Beneficiary> = {}): Beneficiary => ({
  beneficiaryId: '148cf2c3-ccfa-44d0-addd-1b46a4a6f2f9',
  firstName: 'Jeanne',
  lastName: 'Dupont',
  isComplete: false,
  documentType: null,
  documents: [],
  ...overrides,
})

export const getBeneficiariesResponseMock = (
  overrides: Partial<BeneficiariesResponse> = {},
): BeneficiariesResponse => ({
  prospectId: 602,
  beneficiaries: [getBeneficiaryMock()],
  ...overrides,
})

export const getBeneficiaryFormStateMock = (
  overrides: Partial<BeneficiaryFormState> = {},
): BeneficiaryFormState => ({
  documentType: BeneficiaryDocumentType.CNI,
  firstName: 'Jeanne',
  lastName: 'Dupont',
  files: [getFileMock()],
  ...overrides,
})
