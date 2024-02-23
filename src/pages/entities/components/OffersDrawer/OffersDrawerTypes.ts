import type { UserInfo } from '@kpmg/common'

/* eslint-disable no-unused-vars */
export enum offerStepperStep {
  SERVICES,
  CUSTOMERS,
  COLLABORATORS,
  INFORMATION
}

export interface SelectedProduct {
  offerId: number
  productConfigurationId: number
  isMandatory?: boolean
}

export interface OffersDrawerProps {
  modelValue: boolean
  selectedCompanyName: string
  accountNumber: string
  accountId: number
  currentUser: UserInfo | null
}
