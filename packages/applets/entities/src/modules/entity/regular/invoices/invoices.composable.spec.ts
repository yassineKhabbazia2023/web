import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useInvoicesAccessStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '@pulse/common/managers'
import { InvoicesTabState } from '@pulse/common/services/invoices-access'
import { useInvoicesPage } from './invoices.composable'

const invoicesAccessStoreMock = getStoreMock(useInvoicesAccessStore)

describe('useInvoicesPage', () => {
  beforeEach(() => {
    invoicesAccessStoreMock.tabState = null
    vi.spyOn(FeatureFlagManager, 'isLegacyVentyaInvoicesAccessActivated').mockReturnValue(false)
    vi.spyOn(FeatureFlagManager, 'isSeresInvoicesActivated').mockReturnValue(true)
  })

  describe('shouldShowAccessVaultRedirect', () => {
    it('should return false by default (flag off)', () => {
      invoicesAccessStoreMock.tabState = InvoicesTabState.CONNECTION_READY_UNLOCKED

      const { shouldShowAccessVaultRedirect } = useInvoicesPage()

      expect(shouldShowAccessVaultRedirect.value).toBe(false)
    })

    it('should return true when the flag is on and the vault is unlocked', () => {
      vi.mocked(FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated).mockReturnValue(true)
      invoicesAccessStoreMock.tabState = InvoicesTabState.CONNECTION_READY_UNLOCKED

      const { shouldShowAccessVaultRedirect } = useInvoicesPage()

      expect(shouldShowAccessVaultRedirect.value).toBe(true)
    })

    it('should return true when the flag is on and the vault is locked (e.g. a collab, read-only)', () => {
      vi.mocked(FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated).mockReturnValue(true)
      invoicesAccessStoreMock.tabState = InvoicesTabState.CONNECTION_READY_LOCKED

      const { shouldShowAccessVaultRedirect } = useInvoicesPage()

      expect(shouldShowAccessVaultRedirect.value).toBe(true)
    })

    it('should return false when the flag is on but tabState is not connection-ready', () => {
      vi.mocked(FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated).mockReturnValue(true)
      invoicesAccessStoreMock.tabState = InvoicesTabState.FORM_START

      const { shouldShowAccessVaultRedirect } = useInvoicesPage()

      expect(shouldShowAccessVaultRedirect.value).toBe(false)
    })

    it('should return false when the legacy flag is on but the seres invoices route is not activated', () => {
      vi.mocked(FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated).mockReturnValue(true)
      vi.mocked(FeatureFlagManager.isSeresInvoicesActivated).mockReturnValue(false)
      invoicesAccessStoreMock.tabState = InvoicesTabState.CONNECTION_READY_UNLOCKED

      const { shouldShowAccessVaultRedirect } = useInvoicesPage()

      expect(shouldShowAccessVaultRedirect.value).toBe(false)
    })
  })
})
