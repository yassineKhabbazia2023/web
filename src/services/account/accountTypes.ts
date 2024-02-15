export interface Accounting {
  fiscalExerciseStartDate?: string
  fiscalExerciseDuration?: number
  accountingType?: string
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
  legalForm?: string
  legalFormCode?: string
  staffSizeRange?: string
  naf?: Naf[]
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
  street?: string
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
  phone?: string[]
  hub?: Hub
  deploymentPlanning?: Deployment[]
}
