import { onMounted, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
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

  onMounted(loadPaymentPreference)

  return {
    paymentType,
    isLoading,
    isSaving,
    selectOtherMethod,
    returnToSepa,
  }
}
