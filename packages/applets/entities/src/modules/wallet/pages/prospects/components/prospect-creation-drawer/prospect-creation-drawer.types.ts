export interface ProspectSignatory {
  title: string
  lastName: string
  firstName: string
  jobTitle: string
  department: string
  companyRole: string
  contactTypes: string
  email: string
  mobilePhone: string
}

export interface ProspectFormData {
  siret: string
  legalForm: string
  legalStructure: string
  caseManagerContactId: string
  accountManagerContactId: string
  signatory: ProspectSignatory
}
