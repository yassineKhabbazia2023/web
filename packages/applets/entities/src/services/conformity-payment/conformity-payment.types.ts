import type { ConformityPaymentType } from '@entities/enums'

export interface PaymentPreferenceResponse {
  // `null` means the prospect has not selected any payment method yet.
  paymentType: ConformityPaymentType | null
}
