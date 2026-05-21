import type { ContactType } from '@pulse/common/enums'

export interface ContactLabel {
  code: string
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
