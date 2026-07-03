import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import type {
  GenerateSepaMandateParams,
  GenerateSepaMandateResponse,
  PaymentPreferenceResponse,
} from './conformity-payment.types'

const onboardingBasePath = (accountId: number): string =>
  `${API_PREFIXES.PROSPECT}/onboarding/${accountId}`

export class ConformityPaymentService {
  // Retrieve the current payment preference (MANDATE_SEPA, OTHER or null when not selected yet).
  static async getPaymentPreference(accountId: number): Promise<PaymentPreferenceResponse> {
    const response = await api.gateway.get<PaymentPreferenceResponse>(
      `${onboardingBasePath(accountId)}/payment-preferences`,
    )
    return response.data
  }

  // Reset the payment preference to null (unselected) and the PAYMENT_METHOD onboarding step
  static resetPaymentPreference(accountId: number): Promise<void> {
    return api.gateway.delete(`${onboardingBasePath(accountId)}/payment-preferences`)
  }

  // Set the payment preference to OTHER (alternative payment method).
  static setOtherPaymentPreference(accountId: number): Promise<void> {
    return api.gateway.post(`${onboardingBasePath(accountId)}/payment-preferences/other`)
  }

  // Upload the RIB and banking information, generate the SEPA mandate PDF, send it to
  // GetAccept and return the signing link to embed in the signature iframe.
  static async generateSepaMandate(
    { accountId, ribFile, bankDetails }: GenerateSepaMandateParams,
  ): Promise<GenerateSepaMandateResponse> {
    const formData = new FormData()
    formData.append('file', ribFile)
    formData.append('accountHolder', bankDetails.holder)
    formData.append('address', bankDetails.addressLine1)
    if (isNotNullNorEmpty(bankDetails.addressLine2)) {
      formData.append('addressLine2', bankDetails.addressLine2)
    }
    formData.append('city', bankDetails.city)
    formData.append('country', bankDetails.country)
    formData.append('postalCode', bankDetails.postalCode)
    formData.append('iban', bankDetails.iban)
    formData.append('bic', bankDetails.bic)

    const response = await api.gateway.post<GenerateSepaMandateResponse>(
      `${onboardingBasePath(accountId)}/payment-preferences/sepa`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  }

  // Download the signed SEPA mandate once the prospect has signed via GetAccept (Règle n°07 — Étape 2).
  // The endpoint streams the PDF as binary and returns 404 while the mandate has not been signed yet.
  static async downloadSignedMandate(accountId: number): Promise<Blob> {
    const response = await api.gateway.get<Blob>(
      `${onboardingBasePath(accountId)}/payment-preferences/sepa/content`,
      { responseType: 'blob' },
    )
    return response.data
  }
}
