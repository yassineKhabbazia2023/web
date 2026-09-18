import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'

import { FeatureFlagManager } from '../../managers/feature-flag/feature-flag.manager'
import { InvoicesService } from '../../services/invoices/invoices.service'
import { InvoicesTracking } from '../../services/invoices/invoices.tracking.service'
import { DematMailRoutingCode } from '../../services/invoices/invoices.enums'
import type { DematMailLocalisation } from '../../services/invoices/invoices.enums'
import { useUserStore } from '../user/user.store'
import { useInvoicesAccessStore } from '../invoices-access/invoices-access.store'

const ELIGIBLE_ROUTING_CODES = new Set<string>([
  DematMailRoutingCode.B2C,
  DematMailRoutingCode.B2B_INTERNATIONAL,
])

export const useDematMailStore = defineStore('demat-mail', () => {
  const accountId = ref<number | null>(null)
  const dematMail = ref<string | null>(null)
  const routingCode = ref<string | null>(null)
  const modalClosedAt = ref<string | null>(null)
  const isDialogOpen = ref(false)
  const isSubmitting = ref(false)
  const hasSubmitError = ref(false)
  const hasHubspotSubmission = ref(false)

  // Guards against out-of-order responses when the user switches folders quickly.
  let lastRequestedAccountId: number | null = null

  // externalDematMail lives in invoices-access.store.ts: it is fetched independently (by the
  // navigation guard, not this store's load()), so its accountId guards against reading another
  // account's data still held while its own fetch is in flight.
  function hasFreshAccessData(): boolean {
    const invoicesAccessStore = useInvoicesAccessStore()
    return invoicesAccessStore.accountId === accountId.value
  }

  // Business rule: only B2C and B2B International customers without a demat mail are solicited.
  const isEligible = computed(() => {
    if (accountId.value === null) {
      return false
    }

    if (FeatureFlagManager.isDematMailCollectActivated() === false) {
      return false
    }

    const userStore = useUserStore()
    if (userStore.isCustomer === false) {
      return false
    }

    if (routingCode.value === null || ELIGIBLE_ROUTING_CODES.has(routingCode.value) === false) {
      return false
    }

    if (isNullOrEmpty(dematMail.value) === false) {
      return false
    }

    // A submission already dispatched to HubSpot (see load()) stops the solicitation account-wide,
    // ahead of Akuiteo's propagation into dematMail: same intent as externalDematMail below, from
    // a dedicated dispatch-status check instead of the invoices-access payload.
    if (hasHubspotSubmission.value === true) {
      return false
    }

    // externalDematMail is set account-wide as soon as any contact submits, ahead of Akuiteo's
    // propagation into dematMail: it keeps the dialog/banner hidden across reloads without it.
    if (hasFreshAccessData() === true) {
      const invoicesAccessStore = useInvoicesAccessStore()
      return isNullOrEmpty(invoicesAccessStore.externalDematMail)
    }

    return true
  })

  const shouldShowBanner = computed(() => isEligible.value === true)

  const isDialogDismissed = computed(() => modalClosedAt.value !== null)

  const shouldAutoOpenDialog = computed(() => isEligible.value === true && isDialogDismissed.value === false)

  async function load(entityId: number): Promise<void> {
    // accountId is only assigned once a fetch succeeded: re-entering the same folder (e.g. from
    // the wallet) keeps the loaded state, including the local updates made by submit()/closeDialog().
    if (accountId.value === entityId) {
      return
    }

    reset()

    // The flag is readable synchronously here: OpenFeature is awaited before createApp().
    // Skipping the fetch spares a gateway call per folder switch while the feature is off.
    if (FeatureFlagManager.isDematMailCollectActivated() === false) {
      return
    }

    lastRequestedAccountId = entityId

    try {
      const response = await InvoicesService.fetchDematAccount(entityId)

      // A faster folder switch (or a logout) may have superseded this request.
      if (lastRequestedAccountId !== entityId) {
        return
      }

      let hasSubmission = false

      // Only checked for the accounts the solicitation would otherwise target: the demat account
      // payload has no visibility into whether a HubSpot submission already succeeded (see
      // isEligible). Resolved before assigning any state below: assigning accountId/dematMail
      // first would flip isEligible to true for the whole time this call is in flight, flashing
      // the banner/modal before this check comes back and hides them again.
      if (isNullOrEmpty(response.dematMail) === true
        && response.routingCode !== null
        && ELIGIBLE_ROUTING_CODES.has(response.routingCode) === true) {
        try {
          hasSubmission = await InvoicesService.hasHubspotSubmission(entityId)
        } catch (error) {
          logger.error('Error fetching hubspot submission state :', error)
        }

        // A faster folder switch (or a logout) may have superseded this request while it awaited.
        if (lastRequestedAccountId !== entityId) {
          return
        }
      }

      accountId.value = entityId
      dematMail.value = response.dematMail
      routingCode.value = response.routingCode
      modalClosedAt.value = response.modalClosedAt
      hasHubspotSubmission.value = hasSubmission
    } catch (error) {
      logger.error('Error fetching demat account :', error)
    }
  }

  function openDialog(localisation: DematMailLocalisation): void {
    if (isEligible.value === false || isDialogOpen.value === true) {
      return
    }

    hasSubmitError.value = false
    isDialogOpen.value = true
    InvoicesTracking.trackDialogOpened(localisation)
  }

  // Closing the dialog, whatever the way (cross or "later"), persists the closure so it does not
  // open automatically again for anyone with access to this account. Does not affect the banner
  // (see shouldShowBanner): only an actual submission stops the solicitation.
  function closeDialog(): void {
    isDialogOpen.value = false

    // Idempotency guard: a closure row already exists for this user+account, either
    // persisted earlier this session or already returned by load() (the dialog can be
    // reopened manually from the banner after being dismissed). PDialog also echoes the
    // closing transition through several update:modelValue emissions for a single close
    // action, each re-entering this function — this guard absorbs those too.
    if (accountId.value === null || modalClosedAt.value !== null) {
      return
    }

    // Optimistic: reflects the closure immediately, without waiting for the next folder switch
    // to re-fetch the account (see load()).
    modalClosedAt.value = new Date().toISOString()

    InvoicesService.closeDematModal(accountId.value).catch((error) => {
      logger.error('Error closing demat modal :', error)
    })
  }

  async function submit(email: string): Promise<boolean> {
    if (accountId.value === null) {
      return false
    }

    const userStore = useUserStore()

    isSubmitting.value = true
    hasSubmitError.value = false

    try {
      await InvoicesService.submitDematMail(accountId.value, {
        dematerializationEmail: email,
        requesterEmail: userStore.getUserEmail() ?? '',
      })

      // The mail only comes back from Akuiteo later on: mirroring it locally hides the dialog
      // and banner right away; externalDematMail (persisted server-side by the submission) keeps
      // them hidden across reloads until Akuiteo finally returns the address (see isEligible).
      dematMail.value = email
      isDialogOpen.value = false
      InvoicesTracking.trackSubmissionSuccess()

      return true
    } catch (error) {
      logger.error('Error submitting demat mail :', error)
      hasSubmitError.value = true
      InvoicesTracking.trackSubmissionFail()

      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function reset(): void {
    lastRequestedAccountId = null
    accountId.value = null
    dematMail.value = null
    routingCode.value = null
    modalClosedAt.value = null
    isDialogOpen.value = false
    isSubmitting.value = false
    hasSubmitError.value = false
    hasHubspotSubmission.value = false
  }

  return {
    accountId,
    dematMail,
    routingCode,
    isDialogOpen,
    isSubmitting,
    hasSubmitError,
    hasHubspotSubmission,
    isDialogDismissed,
    isEligible,
    shouldShowBanner,
    shouldAutoOpenDialog,
    load,
    openDialog,
    closeDialog,
    submit,
    reset,
  }
})
