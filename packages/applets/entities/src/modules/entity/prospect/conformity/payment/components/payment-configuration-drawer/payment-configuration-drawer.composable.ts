import { computed, reactive, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { PaymentConfigurationStep } from './payment-configuration-drawer.enums'
import type { MandateBankDetails, UsePaymentConfigurationOptions } from './payment-configuration-drawer.types'

const waitBeforeShowingSignatureStep = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 500)
  })

// Drawer-level controller: owns the cross-step state (the bank details + RIB the submit needs, the
// step navigation, the signature verification). The general-information and completed steps own their
// own local state and only surface what the drawer consumes (validity, the RIB file).
export function usePaymentConfiguration(options: UsePaymentConfigurationOptions) {
  // #region Shared state
  // The form starts with empty bank coordinates and the office address prefilled.
  const createInitialBankDetails = (): MandateBankDetails => ({
    holder: '',
    addressLine1: options.addressPrefill?.addressLine1 ?? '',
    addressLine2: options.addressPrefill?.addressLine2 ?? '',
    postalCode: options.addressPrefill?.postalCode ?? '',
    city: options.addressPrefill?.city ?? '',
    country: options.addressPrefill?.country ?? '',
    iban: '',
    bic: '',
  })

  // Shared with step 1 via v-model and read by the submit; the office address stays editable.
  const bankDetails = reactive<MandateBankDetails>(createInitialBankDetails())
  const ribFile = ref<File | null>(null)
  const currentStep = ref<PaymentConfigurationStep>(PaymentConfigurationStep.GeneralInformation)

  // The prefilled address is not counted as progress, so opening then closing does not warn.
  const hasUnsavedProgress = computed(() =>
    ribFile.value !== null
    || isNotNullNorEmpty(bankDetails.holder)
    || isNotNullNorEmpty(bankDetails.iban)
    || isNotNullNorEmpty(bankDetails.bic),
  )
  // #endregion

  // #region General information step
  // Step 1's overall validity, reported up by the step so the footer "Continue" button can gate on it.
  const isGeneralInformationValid = ref(false)
  const isSubmitting = ref(false)
  // GetAccept signing link returned by the SEPA generation endpoint, embedded in the signature step.
  const signatureUrl = ref('')

  const submitGeneralInformation = async (): Promise<void> => {
    if (isSubmitting.value || isGeneralInformationValid.value === false || ribFile.value === null) {
      return
    }
    isSubmitting.value = true
    try {
      const { signatureUrl: generatedSignatureUrl } = await ConformityPaymentService.generateSepaMandate({
        prospectId: options.prospectId,
        ribFile: ribFile.value,
        bankDetails: { ...bankDetails },
      })
      await waitBeforeShowingSignatureStep()
      signatureUrl.value = generatedSignatureUrl
      currentStep.value = PaymentConfigurationStep.Signature
    } catch (error) {
      logger.error('Failed to generate SEPA mandate', error)
      displayNotification('error', options.submitErrorMessage)
    } finally {
      isSubmitting.value = false
    }
  }
  // #endregion

  // #region Signature step
  // True while the signature is being verified against the payment preference on "Continue".
  const isVerifyingSignature = ref(false)

  // Reads the payment preference and moves to the completion screen when the mandate is signed.
  const advanceIfMandateSigned = async (): Promise<boolean> => {
    const { paymentType } = await ConformityPaymentService.getPaymentPreference(options.prospectId)
    const isSigned = paymentType === ConformityPaymentType.MandateSepa
    if (isSigned) {
      currentStep.value = PaymentConfigurationStep.Completed
    }
    return isSigned
  }

  // A cross-origin GetAccept iframe cannot be observed, so signature is verified by polling the
  // payment preference. Triggered explicitly by the "Continue" button: warns when not signed yet.
  const confirmSignature = async (): Promise<void> => {
    if (isVerifyingSignature.value) {
      return
    }
    isVerifyingSignature.value = true
    try {
      const isSigned = await advanceIfMandateSigned()
      if (isSigned === false) {
        displayNotification('warning', options.notSignedMessage)
      }
    } catch (error) {
      logger.error('Failed to verify the SEPA mandate signature', error)
      displayNotification('error', options.signatureCheckErrorMessage)
    } finally {
      isVerifyingSignature.value = false
    }
  }

  // Re-checked silently on every iframe navigation (load event emitted by the signature step): the
  // prospect signs inside GetAccept, which navigates the iframe, and one of those checks catches the
  // freshly-signed mandate. Stays quiet otherwise so GetAccept's own navigations don't spam toasts.
  const checkSignatureOnIframeNavigation = async (): Promise<void> => {
    if (isVerifyingSignature.value || currentStep.value !== PaymentConfigurationStep.Signature) {
      return
    }
    try {
      await advanceIfMandateSigned()
    } catch (error) {
      logger.error('Failed to verify the SEPA mandate signature on iframe navigation', error)
    }
  }
  // #endregion

  // #region Form events & reset
  // Confirms the user vouched for the RIB accuracy; reset by any RIB change so they must re-confirm.
  const isAccuracyConfirmed = ref(false)

  // Changing the RIB invalidates a previous accuracy confirmation; the user must re-confirm.
  const onRibFileChanged = (file: File | null): void => {
    ribFile.value = file
    isAccuracyConfirmed.value = false
  }

  const reset = (): void => {
    Object.assign(bankDetails, createInitialBankDetails())
    ribFile.value = null
    isAccuracyConfirmed.value = false
    isGeneralInformationValid.value = false
    currentStep.value = PaymentConfigurationStep.GeneralInformation
    isSubmitting.value = false
    signatureUrl.value = ''
    isVerifyingSignature.value = false
  }
  // #endregion

  return {
    bankDetails,
    ribFile,
    isAccuracyConfirmed,
    isGeneralInformationValid,
    currentStep,
    isSubmitting,
    signatureUrl,
    isVerifyingSignature,
    hasUnsavedProgress,
    submitGeneralInformation,
    confirmSignature,
    checkSignatureOnIframeNavigation,
    onRibFileChanged,
    reset,
  }
}

export type PaymentConfiguration = ReturnType<typeof usePaymentConfiguration>
