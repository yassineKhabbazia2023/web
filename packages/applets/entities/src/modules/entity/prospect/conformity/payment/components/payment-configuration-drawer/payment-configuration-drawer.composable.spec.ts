import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { usePaymentConfiguration } from './payment-configuration-drawer.composable'
import type { PaymentConfiguration } from './payment-configuration-drawer.composable'
import { PaymentConfigurationStep } from './payment-configuration-drawer.enums'

const generateSepaMandateMock = vi.fn()
const getPaymentPreferenceMock = vi.fn()
const displayNotificationMock = vi.mocked(displayNotification)

const SIGNATURE_URL = 'https://app.getaccept.com/sign/abc123'

const optionsMock = {
  accountId: 602,
  submitErrorMessage: 'submitError',
  notSignedMessage: 'notSigned',
  signatureCheckErrorMessage: 'signatureCheckError',
}

const ribFile = new File(['rib'], 'rib.pdf', { type: 'application/pdf' })

// Brings the general-information step to a submittable state: the step reports its validity up and
// supplies the RIB file, which the drawer reads back on submit.
const makeSubmittable = (result: PaymentConfiguration): void => {
  result.ribFile.value = ribFile
  result.isGeneralInformationValid.value = true
}

describe('payment-configuration-drawer.composable', () => {
  beforeEach(() => {
    vi.spyOn(ConformityPaymentService, 'generateSepaMandate').mockImplementation(generateSepaMandateMock)
    vi.spyOn(ConformityPaymentService, 'getPaymentPreference').mockImplementation(getPaymentPreferenceMock)
    displayNotificationMock.mockImplementation(() => undefined)
    generateSepaMandateMock.mockResolvedValue({ signatureUrl: SIGNATURE_URL })
  })

  describe('address prefill', () => {
    it('should prefill the address fields from the provided office address', () => {
      const [result] = withSetup(() => usePaymentConfiguration({
        ...optionsMock,
        addressPrefill: {
          addressLine1: '2 avenue Gambetta',
          addressLine2: 'Tour Eqho',
          postalCode: '92400',
          city: 'Courbevoie',
          country: 'France',
        },
      }))

      expect(result.bankDetails.addressLine1).toBe('2 avenue Gambetta')
      expect(result.bankDetails.addressLine2).toBe('Tour Eqho')
      expect(result.bankDetails.postalCode).toBe('92400')
      expect(result.bankDetails.city).toBe('Courbevoie')
      expect(result.bankDetails.country).toBe('France')
    })
  })

  describe('isAccuracyConfirmed / onRibFileChanged', () => {
    it('should default the accuracy confirmation to false', () => {
      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))

      expect(result.isAccuracyConfirmed.value).toBe(false)
    })

    it('should store the RIB file and reset the accuracy confirmation when the RIB changes', () => {
      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
      result.isAccuracyConfirmed.value = true

      result.onRibFileChanged(ribFile)

      expect(result.ribFile.value).toBe(ribFile)
      expect(result.isAccuracyConfirmed.value).toBe(false)
    })
  })

  describe('submitGeneralInformation', () => {
    it('should generate the SEPA mandate, store the signing link and advance to the signature step when valid', async () => {
      vi.useFakeTimers()

      try {
        const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
        makeSubmittable(result)

        const submitPromise = result.submitGeneralInformation()
        await vi.advanceTimersByTimeAsync(499)

        expect(generateSepaMandateMock).toHaveBeenCalledWith(expect.objectContaining({ accountId: 602, ribFile }))
        expect(result.signatureUrl.value).toBe('')
        expect(result.currentStep.value).toBe(PaymentConfigurationStep.GeneralInformation)

        await vi.advanceTimersByTimeAsync(1)
        await submitPromise

        expect(result.signatureUrl.value).toBe(SIGNATURE_URL)
        expect(result.currentStep.value).toBe(PaymentConfigurationStep.Signature)
      } finally {
        vi.useRealTimers()
      }
    })

    it('should not call the service when the step is invalid', async () => {
      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))

      await result.submitGeneralInformation()

      expect(generateSepaMandateMock).not.toHaveBeenCalled()
      expect(result.currentStep.value).toBe(PaymentConfigurationStep.GeneralInformation)
    })

    it('should notify and stay on the general information step when the generation fails', async () => {
      generateSepaMandateMock.mockRejectedValueOnce(new Error('boom'))

      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
      makeSubmittable(result)

      await result.submitGeneralInformation()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.submitErrorMessage)
      expect(result.currentStep.value).toBe(PaymentConfigurationStep.GeneralInformation)
    })
  })

  describe('confirmSignature', () => {
    it('should advance to the completed step when the payment preference is MANDATE_SEPA', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.MandateSepa })

      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
      result.currentStep.value = PaymentConfigurationStep.Signature

      await result.confirmSignature()

      expect(getPaymentPreferenceMock).toHaveBeenCalledWith(602)
      expect(result.currentStep.value).toBe(PaymentConfigurationStep.Completed)
    })

    it('should warn and stay on the signature step when the mandate is not signed yet', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: null })

      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
      result.currentStep.value = PaymentConfigurationStep.Signature

      await result.confirmSignature()

      expect(displayNotificationMock).toHaveBeenCalledWith('warning', optionsMock.notSignedMessage)
      expect(result.currentStep.value).toBe(PaymentConfigurationStep.Signature)
    })

    it('should notify an error when the preference check fails', async () => {
      getPaymentPreferenceMock.mockRejectedValueOnce(new Error('boom'))

      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
      result.currentStep.value = PaymentConfigurationStep.Signature

      await result.confirmSignature()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.signatureCheckErrorMessage)
      expect(result.currentStep.value).toBe(PaymentConfigurationStep.Signature)
    })
  })

  describe('checkSignatureOnIframeNavigation', () => {
    it('should advance to the completed step when the mandate is signed', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.MandateSepa })

      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
      result.currentStep.value = PaymentConfigurationStep.Signature

      await result.checkSignatureOnIframeNavigation()

      expect(result.currentStep.value).toBe(PaymentConfigurationStep.Completed)
    })

    it('should stay silent (no toast, no advance) when the mandate is not signed yet', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: null })

      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))
      result.currentStep.value = PaymentConfigurationStep.Signature

      await result.checkSignatureOnIframeNavigation()

      expect(result.currentStep.value).toBe(PaymentConfigurationStep.Signature)
      expect(displayNotificationMock).not.toHaveBeenCalled()
    })

    it('should do nothing when not on the signature step', async () => {
      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))

      await result.checkSignatureOnIframeNavigation()

      expect(getPaymentPreferenceMock).not.toHaveBeenCalled()
    })
  })

  describe('hasUnsavedProgress / reset', () => {
    it('should track progress and clear everything on reset', () => {
      const [result] = withSetup(() => usePaymentConfiguration(optionsMock))

      expect(result.hasUnsavedProgress.value).toBe(false)

      result.onRibFileChanged(ribFile)

      expect(result.hasUnsavedProgress.value).toBe(true)

      result.currentStep.value = PaymentConfigurationStep.Signature
      result.reset()

      expect(result.hasUnsavedProgress.value).toBe(false)
      expect(result.currentStep.value).toBe(PaymentConfigurationStep.GeneralInformation)
    })
  })
})
