import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from './conformity-payment.service'
import type { PaymentPreferenceResponse, ProspectMandateBankDetails } from './conformity-payment.types'

const accountId = 602
const onboardingBasePath = `${API_PREFIXES.PROSPECT}/onboarding/${accountId}`
const sepaPath = `${onboardingBasePath}/payment-preferences/sepa`
const sepaContentPath = `${onboardingBasePath}/payment-preferences/sepa/content`
const signatureUrl = 'https://app.getaccept.com/sign/abc123'

const ribFile = new File(['rib'], 'rib.pdf', { type: 'application/pdf' })

const bankDetails: ProspectMandateBankDetails = {
  holder: 'Hugo Morel',
  addressLine1: '49 Rue Victor Hugo',
  addressLine2: 'Bâtiment B',
  postalCode: '69002',
  city: 'Lyon',
  country: 'France',
  iban: 'FR1420041010050500013M02606',
  bic: 'BNPAFRPP',
}

describe('ConformityPaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPaymentPreference', () => {
    it('should GET the payment preferences of the prospect and return the data', async () => {
      const responseData: PaymentPreferenceResponse = { paymentType: ConformityPaymentType.MandateSepa }
      apiGatewayMock.get.mockResolvedValueOnce({ data: responseData })

      const result = await ConformityPaymentService.getPaymentPreference(accountId)

      expect(apiGatewayMock.get).toHaveBeenCalledWith(`${onboardingBasePath}/payment-preferences`)
      expect(result).toEqual(responseData)
    })

    it('should return a null payment type when no method has been selected', async () => {
      const responseData: PaymentPreferenceResponse = { paymentType: null }
      apiGatewayMock.get.mockResolvedValueOnce({ data: responseData })

      const result = await ConformityPaymentService.getPaymentPreference(accountId)

      expect(result).toEqual(responseData)
    })
  })

  describe('resetPaymentPreference', () => {
    it('should DELETE the payment preferences of the prospect', async () => {
      await ConformityPaymentService.resetPaymentPreference(accountId)

      expect(apiGatewayMock.delete).toHaveBeenCalledWith(`${onboardingBasePath}/payment-preferences`)
    })
  })

  describe('setOtherPaymentPreference', () => {
    it('should POST the OTHER payment preference of the prospect', async () => {
      await ConformityPaymentService.setOtherPaymentPreference(accountId)

      expect(apiGatewayMock.post).toHaveBeenCalledWith(`${onboardingBasePath}/payment-preferences/other`)
    })
  })

  describe('generateSepaMandate', () => {
    it('should POST a multipart form with the RIB and banking information and return the signing link', async () => {
      apiGatewayMock.post.mockResolvedValueOnce({ data: { signatureUrl } })

      const result = await ConformityPaymentService.generateSepaMandate({ accountId, ribFile, bankDetails })

      expect(apiGatewayMock.post).toHaveBeenCalledWith(
        sepaPath,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const [, formData] = apiGatewayMock.post.mock.calls[0]
      expect(formData.get('file')).toBe(ribFile)
      expect(formData.get('accountHolder')).toBe('Hugo Morel')
      expect(formData.get('address')).toBe('49 Rue Victor Hugo')
      expect(formData.get('addressLine2')).toBe('Bâtiment B')
      expect(formData.get('postalCode')).toBe('69002')
      expect(formData.get('city')).toBe('Lyon')
      expect(formData.get('country')).toBe('France')
      expect(formData.get('iban')).toBe('FR1420041010050500013M02606')
      expect(formData.get('bic')).toBe('BNPAFRPP')
      expect(result).toEqual({ signatureUrl })
    })

    it('should omit the optional second address line when it is empty', async () => {
      apiGatewayMock.post.mockResolvedValueOnce({ data: { signatureUrl } })

      await ConformityPaymentService.generateSepaMandate({
        accountId,
        ribFile,
        bankDetails: { ...bankDetails, addressLine2: '' },
      })

      const [, formData] = apiGatewayMock.post.mock.calls[0]
      expect(formData.get('addressLine2')).toBeNull()
    })
  })

  describe('downloadSignedMandate', () => {
    it('should GET the signed mandate as a blob and return it', async () => {
      const blob = new Blob(['signed mandate'], { type: 'application/pdf' })
      apiGatewayMock.get.mockResolvedValueOnce({ data: blob })

      const result = await ConformityPaymentService.downloadSignedMandate(accountId)

      expect(apiGatewayMock.get).toHaveBeenCalledWith(sepaContentPath, { responseType: 'blob' })
      expect(result).toBe(blob)
    })
  })
})
