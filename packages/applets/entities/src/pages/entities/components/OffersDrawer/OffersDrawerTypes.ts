import type { UserInfo } from '@pulse/common'

 
export enum offerStepperStep {
  SERVICES,
  CUSTOMERS,
  COLLABORATORS,
  INFORMATION
}

export interface OffersDrawerProps {
  modelValue: boolean
  selectedCompanyName: string
  accountNumber: string
  accountId: number
  currentUser: UserInfo | null
}
