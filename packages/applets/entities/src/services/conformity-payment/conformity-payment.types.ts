import type { ConformityPaymentType } from '@entities/enums'

export interface PaymentPreferenceResponse {
  // `null` means the prospect has not selected any payment method yet.
  paymentType: ConformityPaymentType | null
}

// Bank details captured in step 1 of the SEPA mandate configuration drawer.
export interface ProspectMandateBankDetails {
  holder: string
  addressLine1: string
  addressLine2: string
  postalCode: string
  city: string
  country: string
  iban: string
  bic: string
}

export interface GenerateSepaMandateParams {
  accountId: number
  ribFile: File
  bankDetails: ProspectMandateBankDetails
}

export interface GenerateSepaMandateResponse {
  // GetAccept signing link, to be embedded in the signature iframe.
  signatureUrl: string
}
