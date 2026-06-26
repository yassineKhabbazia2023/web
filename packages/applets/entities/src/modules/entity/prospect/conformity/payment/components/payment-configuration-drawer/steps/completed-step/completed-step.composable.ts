import { ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import type { UseCompletedStepParams } from './completed-step.types'

// Local controller for the completed step: fetches the signed mandate PDF so it can be downloaded.
// Nothing here is consumed by the drawer, so it stays self-contained.
export function useCompletedStep(params: UseCompletedStepParams) {
  const isLoadingSignedMandate = ref(false)
  const signedMandateBlob = ref<Blob | null>(null)

  const fetchSignedMandate = async (): Promise<void> => {
    if (isLoadingSignedMandate.value) {
      return
    }
    isLoadingSignedMandate.value = true
    try {
      signedMandateBlob.value = await ConformityPaymentService.downloadSignedMandate(params.prospectId)
    } catch (error) {
      logger.error('Failed to download the signed SEPA mandate', error)
      displayNotification('error', params.downloadErrorMessage)
    } finally {
      isLoadingSignedMandate.value = false
    }
  }

  return {
    isLoadingSignedMandate,
    signedMandateBlob,
    fetchSignedMandate,
  }
}
