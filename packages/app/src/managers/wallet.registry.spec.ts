import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'
import { registerWalletTabs } from './wallet.registry'

// Collaborator tabs that don't require permissions
const BASIC_COLLAB_TABS = [
  WalletTab.FOLDERS,
  WalletTab.OFFERS_CATALOG,
]

// Collaborator tabs that require permissions
const PERMISSION_BASED_COLLAB_TABS = [
  WalletTab.FOLDER_MANDATES,
  WalletTab.POWER_BI,
  WalletTab.BI_REPORTS_LIST,
  WalletTab.SUBSCRIPTIONS,
  WalletTab.COLLABORATORS,
  WalletTab.FOLDER_LAUNCHER,
  WalletTab.ACCOUNT_MANAGEMENT,
]

// All collaborator-only tabs
const ALL_COLLAB_TABS = [
  ...BASIC_COLLAB_TABS,
  ...PERMISSION_BASED_COLLAB_TABS,
]

// Customer-only tabs
const CUSTOMER_ONLY_TABS = [
  WalletTab.ENTITY_CLIENT,
  WalletTab.ALL_USERS,
]

describe('registerWalletTabs', () => {
  beforeEach(() => {
    // @ts-expect-error - Accessing private static field for test cleanup
    WalletManager.tabs.clear()
    registerWalletTabs()
  })

  it('should register all 11 wallet tabs', () => {
    // @ts-expect-error - Accessing private static field for test
    expect(WalletManager.tabs.size).toBe(11)
  })

  it.each([
    { tab: WalletTab.FOLDERS, route: RouteName.FOLDERS },
    { tab: WalletTab.FOLDER_MANDATES, route: RouteName.FOLDER_MANDATES },
    { tab: WalletTab.POWER_BI, route: RouteName.POWER_BI },
    { tab: WalletTab.BI_REPORTS_LIST, route: RouteName.BI_REPORTS_LIST },
    { tab: WalletTab.SUBSCRIPTIONS, route: RouteName.SUBSCRIPTIONS },
    { tab: WalletTab.COLLABORATORS, route: RouteName.COLLABORATORS },
    { tab: WalletTab.FOLDER_LAUNCHER, route: RouteName.FOLDER_LAUNCHER },
    { tab: WalletTab.ACCOUNT_MANAGEMENT, route: RouteName.ACCOUNT_MANAGEMENT },
    { tab: WalletTab.OFFERS_CATALOG, route: RouteName.OFFERS_CATALOG },
    { tab: WalletTab.ENTITY_CLIENT, route: RouteName.ENTITY_CLIENT },
    { tab: WalletTab.ALL_USERS, route: RouteName.ALL_USERS },
  ])('should register $tab tab correctly', ({ tab, route }) => {
    const config = WalletManager.getTab(tab)
    expect(config?.route).toBe(route)
  })

  describe('isDisplayed behavior - Collaborator scenarios', () => {
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

    it('should hide customer tabs for collaborator', () => {
      const context = {
        isCollab: true,
        hasPermission: () => true,
        hasFeatureFlag: () => true,
      }

      CUSTOMER_ONLY_TABS.forEach(tab => {
        const config = WalletManager.getTab(tab)
        expect(config?.isDisplayed(context)).toBe(false)
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

  describe('isDisplayed behavior - Customer scenarios', () => {
    it('should display basic customer tabs', () => {
      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.ENTITY_CLIENT)
      expect(config?.isDisplayed(context)).toBe(true)
    })

    it('should display permission-based customer tabs when permissions granted', () => {
      const context = {
        isCollab: false,
        hasPermission: () => true,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.ALL_USERS)
      expect(config?.isDisplayed(context)).toBe(true)
    })

    it('should hide ALL_USERS tab when customer lacks permissions', () => {
      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.ALL_USERS)
      expect(config?.isDisplayed(context)).toBe(false)
    })

    it('should hide all collaborator tabs for customer', () => {
      const context = {
        isCollab: false,
        hasPermission: () => true,
        hasFeatureFlag: () => true,
      }

      ALL_COLLAB_TABS.forEach(tab => {
        const config = WalletManager.getTab(tab)
        expect(config?.isDisplayed(context)).toBe(false)
      })
    })
  })
})
