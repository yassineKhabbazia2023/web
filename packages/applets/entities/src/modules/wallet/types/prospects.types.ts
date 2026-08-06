import type { Contact } from '@entities/services/contact/contactTypes'

export interface ProspectSignatory {
  title: string
  lastName: string
  firstName: string
  jobTitle: string
  department: string
  companyRole: string
  contactTypes: string[]
  email: string
  mobilePhone: string
}

export interface ProspectFormData {
  legalName: string
  siret: string
  siren: string
  address: string
  country: string
  region: string
  department: string
  zipCode: string
  city: string
  nafCode: string
  legalForm: string
  legalStructure: string
  interlocutors: Contact[]
  interlocutorRoles: Record<Contact['id'], number[]>
  signatory: ProspectSignatory
}

export interface ProspectCreationPayload {
  siret: string
  legalForm: string
  legalStructure: string
  caseManagerContactId: number | null
  accountManagerContactId: number | null
  department: string
  region: string
  country: string
  signatory: ProspectSignatory
}

export interface ProspectEntityBeneficiary {
  firstName: string
  lastName: string
  birthDate: string
  nationality: string
  sharePercentage: number
}

export interface CollaboratorTargetRole {
  id: number
  labelKey: string
  label: string
  isMandatory: boolean
}

export interface ProspectEntitySearchResult {
  legalName: string
  siret: string
  siren: string
  zipCode: string
  address: string
  country: string
  region: string
  department: string
  city: string
  legalForm: string
  nafCode: string
  shareCapital: number
  beneficiaries: ProspectEntityBeneficiary[]
}
