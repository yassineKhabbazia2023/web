export interface Accounting {
  fiscalExerciceStartDate: string
  fiscalExerciceDuration: number
  accountingMethod: string
  activityType: string
  fiscalSystem: string
  taxationSystem: string
}

export interface Vat {
  system: string
  intra: string
  type: string
}

export interface Account {
  accountId: string
  accountNumber: string
  legalName: string
  legalFormCode: string
  siret: string
  nafCode: string
  staffSizeRange: number
  hubName: string
  accounting: Accounting
  vat: Vat
}
