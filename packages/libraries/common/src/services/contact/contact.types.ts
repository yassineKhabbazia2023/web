import type { ContactType } from '@pulse/common/enums'

export interface ContactLabel {
  code: string
  collaboratorLabel?: string
  customerLabel?: string
}

export interface ContactResponseItem {
  firstName: string
  lastName: string
  email: string
  mobilePhone?: string
  landPhone?: string
  type?: ContactType
  personaName?: string
  office?: string
  isCustomerRelation?: boolean
  labels?: ContactLabel[]
}

export interface EntityContact {
  firstname: string
  lastname: string
  role: string
  phoneNumber: string
  email: string
}

// A contact paired with the prospect label (CLP or AM) that qualified it.
export interface ProspectEntry {
  item: ContactResponseItem
  prospectLabels: ContactLabel[]
}
