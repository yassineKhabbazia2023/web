import { computed, ref } from 'vue'
import { VITE_RYDGE_INVOICES_LOGIN_URL } from 'env-vars'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useInvoicesAccessStore, useUserStore } from '@pulse/common/stores'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { INVOICES_ASSISTANCE_FORM_URL } from '../../invoices/invoices.constants'
import { OldRydgeInvoicesTracking } from '../old-rydge-invoices.tracking.service'

export function useOldRydgeInvoicesDialog() {
  const userStore = useUserStore()
  const invoicesAccessStore = useInvoicesAccessStore()

  const isDialogOpen = ref(false)

  // Matches the Ventya coffre-fort contact role: a non-collab user designated
  // as contactWithAccess for the current entity, regardless of the vault's
  // own connection state (this CTA is not tied to the onboarding wizard).
  const isCtaVisible = computed(() => {
    if (FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated() === false) {
      return false
    }

    if (userStore.isCollab === true) {
      return false
    }

    const userEmail = userStore.user?.email ?? ''

    return invoicesAccessStore.contactWithAccess === userEmail
  })

  const loginUrl = computed(() => sanitizeUrl(VITE_RYDGE_INVOICES_LOGIN_URL))

  function openDialog() {
    OldRydgeInvoicesTracking.trackOldInvoicesCtaClick()
    isDialogOpen.value = true
  }

  function handleLoginClick() {
    OldRydgeInvoicesTracking.trackOldInvoicesLoginClick()
  }

  function handleAssistanceClick() {
    OldRydgeInvoicesTracking.trackOldInvoicesAssistanceClick()
    window.open(sanitizeUrl(INVOICES_ASSISTANCE_FORM_URL), '_blank', 'noopener,noreferrer')
  }

  return {
    isCtaVisible,
    isDialogOpen,
    loginUrl,
    openDialog,
    handleLoginClick,
    handleAssistanceClick,
  }
}
