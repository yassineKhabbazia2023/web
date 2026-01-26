import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'
import { registerCustomerWalletTabs } from './customer.wallet.registry'

describe('registerCustomerWalletTabs', () => {
  beforeEach(() => {
    WalletManager.clear()
    registerCustomerWalletTabs()
  })

  it('should register 2 wallet tabs', () => {
    expect(WalletManager.getTabCount()).toBe(2)
  })

  it.each([
    { tab: WalletTab.CUSTOMER_ENTITIES, route: RouteName.CUSTOMER_ENTITIES },
    { tab: WalletTab.ALL_USERS, route: RouteName.ALL_USERS },
  ])('should register $tab tab correctly', ({ tab, route }) => {
    const config = WalletManager.getTab(tab)
    expect(config?.route).toBe(route)
  })

  describe('isDisplayed behavior - CUSTOMER_ENTITIES tab', () => {
    it('should always display CUSTOMER_ENTITIES tab', () => {
      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.CUSTOMER_ENTITIES)
      expect(config?.isDisplayed(context)).toBe(true)
    })
  })

  describe('isDisplayed behavior - ALL_USERS tab', () => {
    it('should display ALL_USERS tab when user has USERS permission', () => {
      const context = {
        isCollab: false,
        hasPermission: () => true,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.ALL_USERS)
      expect(config?.isDisplayed(context)).toBe(true)
    })

    it('should hide ALL_USERS tab when user lacks USERS permission', () => {
      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.ALL_USERS)
      expect(config?.isDisplayed(context)).toBe(false)
    })
  })
})
