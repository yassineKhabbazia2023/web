import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from './conformity-payment.service'
import type { PaymentPreferenceResponse } from './conformity-payment.types'

vi.mock('@pulse/common/api')

const prospectId = 602
const onboardingBasePath = `${API_PREFIXES.PROSPECT}/onboarding/${prospectId}`

describe('ConformityPaymentService', () => {
  describe('getPaymentPreference', () => {
    it('should GET the payment preferences of the prospect and return the data', async () => {
      const responseData: PaymentPreferenceResponse = { paymentType: ConformityPaymentType.MandateSepa }
      vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: responseData })

      const result = await ConformityPaymentService.getPaymentPreference(prospectId)

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith(`${onboardingBasePath}/payment-preferences`)
      expect(result).toEqual(responseData)
    })

    it('should return a null payment type when no method has been selected', async () => {
      const responseData: PaymentPreferenceResponse = { paymentType: null }
      vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: responseData })

      const result = await ConformityPaymentService.getPaymentPreference(prospectId)

      expect(result).toEqual(responseData)
    })
  })

  describe('resetPaymentPreference', () => {
    it('should DELETE the payment preferences of the prospect', async () => {
      await ConformityPaymentService.resetPaymentPreference(prospectId)

      expect(vi.mocked(api.gateway.delete)).toHaveBeenCalledWith(`${onboardingBasePath}/payment-preferences`)
    })
  })

  describe('setOtherPaymentPreference', () => {
    it('should POST the OTHER payment preference of the prospect', async () => {
      await ConformityPaymentService.setOtherPaymentPreference(prospectId)

      expect(vi.mocked(api.gateway.post)).toHaveBeenCalledWith(`${onboardingBasePath}/payment-preferences/other`)
    })
  })
})
