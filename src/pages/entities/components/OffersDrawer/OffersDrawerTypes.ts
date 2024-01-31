/* eslint-disable no-unused-vars */
export enum offerStepperStep {
  SERVICES,
  CUSTOMERS,
  COLLABORATORS,
  INFORMATION
}

export interface SelectedProduct {
  offerId: number
  productId: string
  isMandatory?: boolean
}

export interface OffersDrawerProps {
  modelValue: boolean
  selectedCompanyName: string
  accountNumber: string
  accountId: string
  userEmail: string | undefined
}
