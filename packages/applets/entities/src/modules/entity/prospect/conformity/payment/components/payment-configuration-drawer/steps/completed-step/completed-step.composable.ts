import { ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import type { UseCompletedStepParams } from './completed-step.types'

// Local controller for the completed step: fetches the signed mandate PDF on demand and opens it in a new tab.
// Nothing here is consumed by the drawer, so it stays self-contained.
export function useCompletedStep(params: UseCompletedStepParams) {
  const isLoadingSignedMandate = ref(false)

  const openSignedMandate = async (): Promise<void> => {
    if (isLoadingSignedMandate.value) {
      return
    }
    isLoadingSignedMandate.value = true
    try {
      const hasOpened = await openDocumentInNewTab(() =>
        ConformityPaymentService.downloadSignedMandate(params.accountId),
      )
      if (hasOpened === false) {
        displayNotification('error', params.downloadErrorMessage)
      }
    } catch (error) {
      logger.error('Failed to download the signed SEPA mandate', error)
      displayNotification('error', params.downloadErrorMessage)
    } finally {
      isLoadingSignedMandate.value = false
    }
  }

  return {
    isLoadingSignedMandate,
    openSignedMandate,
  }
}
