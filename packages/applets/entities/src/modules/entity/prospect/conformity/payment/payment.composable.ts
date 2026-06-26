import { onMounted, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { SIGNED_MANDATE_FILE_NAME } from './payment.consts'
import type { UsePaymentOptions } from './payment.types'

export function usePayment(prospectId: number, options: UsePaymentOptions) {
  // Prospect payment type from the API; `null` means no method has been selected yet.
  const paymentType = ref<ConformityPaymentType | null>(null)
  const isLoading = ref(true)
  const isSaving = ref(false)

  const loadPaymentPreference = async (): Promise<void> => {
    isLoading.value = true
    try {
      const response = await ConformityPaymentService.getPaymentPreference(prospectId)
      paymentType.value = response.paymentType
    } catch (error) {
      logger.error('Error fetching payment preference', error)
    } finally {
      isLoading.value = false
    }
  }

  const selectOtherMethod = async (): Promise<void> => {
    if (isSaving.value) {
      return
    }
    isSaving.value = true
    try {
      await ConformityPaymentService.setOtherPaymentPreference(prospectId)
      paymentType.value = ConformityPaymentType.Other
    } catch (error) {
      logger.error('Error setting OTHER payment preference', error)
      displayNotification('error', options.updateErrorMessage)
    } finally {
      isSaving.value = false
    }
  }

  // Re-read the preference after the configuration drawer completes: the API is the source of truth,
  // so we re-fetch instead of mutating the state locally. No isLoading toggle, to avoid a card flicker.
  const refreshPaymentPreference = async (): Promise<void> => {
    try {
      const response = await ConformityPaymentService.getPaymentPreference(prospectId)
      paymentType.value = response.paymentType
    } catch (error) {
      logger.error('Error refreshing payment preference', error)
    }
  }

  const returnToSepa = async (): Promise<void> => {
    if (isSaving.value) {
      return
    }
    isSaving.value = true
    try {
      await ConformityPaymentService.resetPaymentPreference(prospectId)
      paymentType.value = null
    } catch (error) {
      logger.error('Error resetting payment preference', error)
      displayNotification('error', options.updateErrorMessage)
    } finally {
      isSaving.value = false
    }
  }

  // Fetch the signed mandate PDF and trigger its browser download. Reuses isSaving to disable the
  // footer button while the file is being retrieved, preventing a double download.
  const downloadMandate = async (): Promise<void> => {
    if (isSaving.value) {
      return
    }
    isSaving.value = true
    try {
      const signedMandate = await ConformityPaymentService.downloadSignedMandate(prospectId)
      downloadFile(signedMandate, SIGNED_MANDATE_FILE_NAME)
    } catch (error) {
      logger.error('Error downloading the signed SEPA mandate', error)
      displayNotification('error', options.downloadErrorMessage)
    } finally {
      isSaving.value = false
    }
  }

  onMounted(loadPaymentPreference)

  return {
    paymentType,
    isLoading,
    isSaving,
    selectOtherMethod,
    returnToSepa,
    refreshPaymentPreference,
    downloadMandate,
  }
}
