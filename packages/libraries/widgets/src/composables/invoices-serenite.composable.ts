import { ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { RYDGE_ELECTRONIC_INVOICING_PLATFORM_URL, RYDGE_ELECTRONIC_INVOICING_REFORM_URL } from '@pulse/common/constants'
import { FeatureFlagManager } from '@pulse/common/managers'
import { InvoicesSereniteService } from '@pulse/common/services/invoices-serenite'
import type { InvoicesSereniteResponseResult } from '@pulse/common/services/invoices-serenite'
import { InvoicesSereniteTrackingManager } from '../widgets/gridless/invoices-serenite/invoices-serenite-tracking.manager'

export function useInvoicesSerenite() {
  const isDialogVisible = ref(false)
  // the dialog is marked as seen at most once: "comply" closes the dialog, which also triggers the close event
  let hasBeenSeen = false

  async function checkEligibility(): Promise<void> {
    if (FeatureFlagManager.isSerenityRedirectionModalActivated() === false) {
      return
    }

    try {
      isDialogVisible.value = await InvoicesSereniteService.fetchShouldDisplayModal()
    } catch (error) {
      logger.error('Invoices Serenite eligibility check failed', error)
      isDialogVisible.value = false
    }
  }

  async function markAsSeen(result: InvoicesSereniteResponseResult): Promise<void> {
    if (hasBeenSeen) {
      return
    }

    hasBeenSeen = true
    isDialogVisible.value = false

    // the dialog closes right away, the user doesn't care about this technical call
    // tracking only happens once the modal is actually persisted as seen, otherwise a backend error
    // would display the modal again and track the same user several times
    try {
      await InvoicesSereniteService.markModalAsSeen(result)
      InvoicesSereniteTrackingManager.trackResponse(result)
    } catch (error) {
      logger.error('Invoices Serenite modal could not be marked as seen', error)
    }
  }

  function onComply(): void {
    window.open(RYDGE_ELECTRONIC_INVOICING_PLATFORM_URL, '_blank', 'noopener,noreferrer')
    markAsSeen('yes')
  }

  // purely informative: the modal is not marked as seen and the dialog stays open
  function onUnderstandReform(): void {
    window.open(RYDGE_ELECTRONIC_INVOICING_REFORM_URL, '_blank', 'noopener,noreferrer')
  }

  function onDialogClose(): void {
    markAsSeen('no')
  }

  return {
    isDialogVisible,
    checkEligibility,
    onComply,
    onUnderstandReform,
    onDialogClose,
  }
}
