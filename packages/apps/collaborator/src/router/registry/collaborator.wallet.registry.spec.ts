import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { registerCollaboratorWalletTabs } from './collaborator.wallet.registry'

// Collaborator tabs that don't require permissions
const BASIC_COLLAB_TABS = [
  WalletTab.FOLDERS,
  WalletTab.OFFERS_CATALOG,
]

// Collaborator tabs that require only a feature flag
const FEATURE_FLAG_COLLAB_TABS = [
  WalletTab.PROSPECTS,
]

// Collaborator tabs that require permissions
const PERMISSION_BASED_COLLAB_TABS = [
  WalletTab.MANDATES,
  WalletTab.POWER_BI,
  WalletTab.BI_REPORTS_LIST,
  WalletTab.SUBSCRIPTIONS,
  WalletTab.COLLABORATORS,
  WalletTab.WALLET_LAUNCHER,
  WalletTab.ACCOUNT_MANAGEMENT,
]

describe('registerCollaboratorWalletTabs', () => {
  beforeEach(() => {
    // Default to prospect experience enabled (folders hidden on mobile)
    vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(true)
    // @ts-expect-error - Accessing private static field for test cleanup
    WalletManager.tabs.clear()
    registerCollaboratorWalletTabs()
  })

  it('should register all 10 wallet tabs', () => {
    // @ts-expect-error - Accessing private static field for test
    expect(WalletManager.tabs.size).toBe(10)
  })

  it.each([
    { tab: WalletTab.FOLDERS, route: RouteName.FOLDERS },
    { tab: WalletTab.PROSPECTS, route: RouteName.PROSPECTS },
    { tab: WalletTab.MANDATES, route: RouteName.MANDATES },
    { tab: WalletTab.POWER_BI, route: RouteName.POWER_BI },
    { tab: WalletTab.BI_REPORTS_LIST, route: RouteName.BI_REPORTS_LIST },
    { tab: WalletTab.SUBSCRIPTIONS, route: RouteName.SUBSCRIPTIONS },
    { tab: WalletTab.COLLABORATORS, route: RouteName.COLLABORATORS },
    { tab: WalletTab.WALLET_LAUNCHER, route: RouteName.WALLET_LAUNCHER },
    { tab: WalletTab.ACCOUNT_MANAGEMENT, route: RouteName.ACCOUNT_MANAGEMENT },
    { tab: WalletTab.OFFERS_CATALOG, route: RouteName.OFFERS_CATALOG },
  ])('should register $tab tab correctly', ({ tab, route }) => {
    const config = WalletManager.getTab(tab)
    expect(config?.route).toBe(route)
  })

  describe('showInMobile behavior', () => {
    it('should show only the PROSPECTS tab on mobile when the prospect experience is enabled', () => {
      expect(WalletManager.getTab(WalletTab.PROSPECTS)?.showInMobile).toBe(true)
      expect(WalletManager.getTab(WalletTab.FOLDERS)?.showInMobile).toBe(false)
    })

    it('should show only the FOLDERS tab on mobile when the prospect experience is disabled', () => {
      vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(false)
      // @ts-expect-error - Accessing private static field for test cleanup
      WalletManager.tabs.clear()
      registerCollaboratorWalletTabs()

      expect(WalletManager.getTab(WalletTab.PROSPECTS)?.showInMobile).toBe(false)
      expect(WalletManager.getTab(WalletTab.FOLDERS)?.showInMobile).toBe(true)
    })

    it('should not flag permission-based or offers tabs as showInMobile', () => {
      PERMISSION_BASED_COLLAB_TABS.forEach(tab => {
        expect(WalletManager.getTab(tab)?.showInMobile).toBeUndefined()
      })
      expect(WalletManager.getTab(WalletTab.OFFERS_CATALOG)?.showInMobile).toBeUndefined()
    })
  })

  describe('isDisplayed behavior', () => {
    it('should display basic tabs for collaborator with no permissions', () => {
      const context = {
        isCollab: true,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      BASIC_COLLAB_TABS.forEach(tab => {
        const config = WalletManager.getTab(tab)
        expect(config?.isDisplayed(context)).toBe(true)
      })
    })

    it('should display permission-based tabs for collaborator with all permissions', () => {
      const context = {
        isCollab: true,
        hasPermission: () => true,
        hasFeatureFlag: () => true,
      }

      PERMISSION_BASED_COLLAB_TABS.forEach(tab => {
        const config = WalletManager.getTab(tab)
        expect(config?.isDisplayed(context)).toBe(true)
      })
    })

    it('should hide permission-based tabs when collaborator lacks permissions', () => {
      const context = {
        isCollab: true,
        hasPermission: () => false,
        hasFeatureFlag: () => true,
      }

      PERMISSION_BASED_COLLAB_TABS.forEach(tab => {
        const config = WalletManager.getTab(tab)
        expect(config?.isDisplayed(context)).toBe(false)
      })
    })

    it('should display feature-flag tabs when feature flag is enabled', () => {
      const context = {
        isCollab: true,
        hasPermission: () => false,
        hasFeatureFlag: () => true,
      }

      FEATURE_FLAG_COLLAB_TABS.forEach(tab => {
        const config = WalletManager.getTab(tab)
        expect(config?.isDisplayed(context)).toBe(true)
      })
    })

    it('should hide feature-flag tabs when feature flag is disabled', () => {
      const context = {
        isCollab: true,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      FEATURE_FLAG_COLLAB_TABS.forEach(tab => {
        const config = WalletManager.getTab(tab)
        expect(config?.isDisplayed(context)).toBe(false)
      })
    })
  })
})
