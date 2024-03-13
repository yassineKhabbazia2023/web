export interface Accounting {
  fiscalExerciseStartDate?: string
  fiscalExerciseDuration?: number
  accountingType?: string
  activityType?: string
  fiscalSystem?: string
  taxationSystem?: string
}

export interface Naf {
  nafId: number
  nafCode?: string
  nafLabel?: string
}

export interface Legal {
  legalName?: string
  siren?: string
  siret?: string
  createdAt?: string
  legalForm?: string
  legalFormCode?: string
  staffSizeRange?: string
  naf?: Naf[]
}

export interface Phone {
  phoneId: number,
  phoneNumber?: string,
  type?: string
}

export interface Vat {
  system?: string
  intra?: string
  type?: string
}

export interface Hub {
  hubId: number
  hubName?: string
}

export interface Address {
  addressId: number
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressType?: 'delivery' | 'billing'
  state?: string
  zipCode?: string
  country?: string
  city?: string
}
export interface Deployment {
  deploymentId: number
  deploymentDate?: string
  status: number
}

export interface Account {
  accountId: number
  accountNumber: string
  iconName?: string
  isActive?: boolean
  accountNumberSource?: string
  accountingOffice?: string
  employeeCount?: number
  commercialName?: string
  accounting?: Accounting
  legal?: Legal
  vat?: Vat
  address?: Address[]
  phone?: Phone[]
  email?: string
  hub?: Hub
  deploymentPlanning?: Deployment[]
}
