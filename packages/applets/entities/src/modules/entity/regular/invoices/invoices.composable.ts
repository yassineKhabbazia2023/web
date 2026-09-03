import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useInvoicesAccessStore } from '@pulse/common/stores'
import { InvoicesTabState } from '@pulse/common/services/invoices-access'

// Same "connection ready" states AccessVault reaches (locked or unlocked) — the
// redirect only points elsewhere, it doesn't require the vault to be unlocked.
const CONNECTION_READY_STATES = new Set<InvoicesTabState>([
  InvoicesTabState.CONNECTION_READY_LOCKED,
  InvoicesTabState.CONNECTION_READY_UNLOCKED,
])

export function useInvoicesPage() {
  const { tabState } = storeToRefs(useInvoicesAccessStore())

  // Ventya's direct access screen is being decommissioned: once the flag is on, the
  // coffre-fort contact is redirected to the new centralized invoices experience
  // instead of logging into Ventya from here.
  // Deliberately no isCollab branching: the AC only covers the client persona, so a
  // collab sees whatever tabState the backend already resolves for them today (as-is)
  // — locked/read-only, same as AccessVault's own behavior when they're not the
  // account holder — just swapped for the new block once the flag is on.
  const shouldShowAccessVaultRedirect = computed(() =>
    tabState.value !== null &&
    CONNECTION_READY_STATES.has(tabState.value) &&
    FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated() === true &&
    FeatureFlagManager.isSeresInvoicesActivated() === true,
  )

  return {
    shouldShowAccessVaultRedirect,
  }
}
