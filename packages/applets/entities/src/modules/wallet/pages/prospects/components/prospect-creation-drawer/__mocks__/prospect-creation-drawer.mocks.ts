import { ref } from 'vue'
import type { FormInstance } from '@pulse/styleguide/types'
import type { CreationDropdownContent } from '@entities/services/creation-referential'
import type {
  CollaboratorTargetRole,
  ProspectEntitySearchResult,
  ProspectFormData,
} from '@entities/modules/wallet/types'
import type { ProspectCreationStepInformationValidationParams } from '../components/prospect-creation-step-information/prospect-creation-step-information.types'

export function getProspectFormDataMock(overrides: Partial<ProspectFormData> = {}): ProspectFormData {
  return {
    legalName: '',
    siret: '',
    siren: '',
    address: '',
    country: '',
    region: '',
    department: '',
    zipCode: '',
    city: '',
    nafCode: '',
    legalForm: '',
    legalStructure: '',
    interlocutors: [],
    interlocutorRoles: {},
    signatory: {
      title: '',
      lastName: '',
      firstName: '',
      jobTitle: '',
      department: '',
      companyRole: '',
      contactTypes: [],
      email: '',
      mobilePhone: '',
    },
    ...overrides,
  }
}

export function getProspectEntitySearchResultMock(
  overrides: Partial<ProspectEntitySearchResult> = {},
): ProspectEntitySearchResult {
  return {
    legalName: 'ACME Corp',
    siret: '12345678900001',
    siren: '123456789',
    zipCode: '75001',
    address: '1 rue de Paris',
    country: 'France',
    region: 'Île-de-France',
    department: 'Paris',
    city: 'Paris',
    legalForm: 'SAS',
    nafCode: '6201Z',
    shareCapital: 10000,
    beneficiaries: [],
    ...overrides,
  }
}

export function getDropdownsContentMock(
  overrides: Partial<CreationDropdownContent> = {},
): CreationDropdownContent {
  return {
    contactTitle: { M: 'Monsieur' },
    contactService: { DG: 'Direction générale' },
    contactHierarchicalLevel: { Autre: 'Autre' },
    contactType: { isMandateSignatory: 'Signataire' },
    legalForm: { SAS: 'SAS' },
    legalStructure: { PersonneMorale: 'Personne morale' },
    ...overrides,
  }
}

export function getCollaboratorTargetRolesMock(
  overrides: Partial<CollaboratorTargetRole>[] = [],
): CollaboratorTargetRole[] {
  const defaults: CollaboratorTargetRole[] = [
    { id: 1, labelKey: 'principal', label: 'Principal', isMandatory: true },
    { id: 2, labelKey: 'secondary', label: 'Secondaire', isMandatory: false },
  ]
  return overrides.length === 0
    ? defaults
    : defaults.map((role, index) => ({ ...role, ...overrides[index] }))
}

export function getEmptyDropdownsContentMock(): CreationDropdownContent {
  return {
    contactTitle: {},
    contactService: {},
    contactHierarchicalLevel: {},
    contactType: {},
    legalForm: {},
    legalStructure: {},
  }
}

export function getValidationParamsMock(
  overrides: Partial<ProspectCreationStepInformationValidationParams> = {},
): ProspectCreationStepInformationValidationParams {
  return {
    prospectFormData: ref(getProspectFormDataMock()),
    formRef: ref<FormInstance | null>(null),
    validateEntitySelection: vi.fn(() => true),
    checkEntityEligibility: vi.fn(() => Promise.resolve({ ok: true, errorMessageKey: null })),
    ...overrides,
  }
}
