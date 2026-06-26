import type { ProspectMandateBankDetails } from '@entities/services/conformity-payment'

// Form model for the bank details captured in step 1.
export type MandateBankDetails = ProspectMandateBankDetails

export interface MandateAddressPrefill {
  addressLine1?: string
  addressLine2?: string
  postalCode?: string
  city?: string
  country?: string
}

export interface UsePaymentConfigurationOptions {
  prospectId: number
  // Address prefilled from the entity office; every field stays editable.
  addressPrefill?: MandateAddressPrefill
  submitErrorMessage: string
  // Shown when "Continue" is clicked but the mandate has not been signed yet (paymentType ≠ MANDATE_SEPA).
  notSignedMessage: string
  signatureCheckErrorMessage: string
}
