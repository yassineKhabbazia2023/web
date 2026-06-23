import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { PaymentPreferenceResponse } from './conformity-payment.types'

const onboardingBasePath = (prospectId: number): string =>
  `${API_PREFIXES.PROSPECT}/onboarding/${prospectId}`

export class ConformityPaymentService {
  // Retrieve the current payment preference (MANDATE_SEPA, OTHER or null when not selected yet).
  static async getPaymentPreference(prospectId: number): Promise<PaymentPreferenceResponse> {
    const response = await api.gateway.get<PaymentPreferenceResponse>(
      `${onboardingBasePath(prospectId)}/payment-preferences`,
    )
    return response.data
  }

  // Reset the payment preference to null (unselected) and the PAYMENT_METHOD onboarding step to TODO.
  static resetPaymentPreference(prospectId: number): Promise<void> {
    return api.gateway.delete(`${onboardingBasePath(prospectId)}/payment-preferences`)
  }

  // Set the payment preference to OTHER (alternative payment method).
  static setOtherPaymentPreference(prospectId: number): Promise<void> {
    return api.gateway.post(`${onboardingBasePath(prospectId)}/payment-preferences/other`)
  }
}
