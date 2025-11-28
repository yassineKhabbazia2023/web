import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'
import { registerCollaboratorWalletTabs } from './collaborator.wallet.registry'

// Collaborator tabs that don't require permissions
const BASIC_COLLAB_TABS = [
  WalletTab.FOLDERS,
  WalletTab.OFFERS_CATALOG,
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
    // @ts-expect-error - Accessing private static field for test cleanup
    WalletManager.tabs.clear()
    registerCollaboratorWalletTabs()
  })

  it('should register all 9 wallet tabs', () => {
    // @ts-expect-error - Accessing private static field for test
    expect(WalletManager.tabs.size).toBe(9)
  })

  it.each([
    { tab: WalletTab.FOLDERS, route: RouteName.FOLDERS },
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

    it('should hide POWER_BI tab when feature flag is disabled', () => {
      const context = {
        isCollab: true,
        hasPermission: () => true,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.POWER_BI)
      expect(config?.isDisplayed(context)).toBe(false)
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
  })
})
