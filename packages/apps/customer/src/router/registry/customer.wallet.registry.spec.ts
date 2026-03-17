import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'
import { registerCustomerWalletTabs } from './customer.wallet.registry'

describe('registerCustomerWalletTabs', () => {
  beforeEach(() => {
    WalletManager.clear()
    registerCustomerWalletTabs()
  })

  it('should register 2 wallet tab', () => {
    expect(WalletManager.getTabCount()).toBe(2)
  })

  it('should register CUSTOMER_ENTITIES tab correctly', () => {
    const config = WalletManager.getTab(WalletTab.CUSTOMER_ENTITIES)
    expect(config?.route).toBe(RouteName.CUSTOMER_ENTITIES)
  })

  it('should register prospects tab correctly', () => {
    const config = WalletManager.getTab(WalletTab.PROSPECTS)
    expect(config?.route).toBe(RouteName.CUSTOMER_PROSPECTS)
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

  describe('isDisplayed behavior - PROSPECTS tab', () => {
    it('should display PROSPECTS tab when feature flag is enabled', () => {
      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => true,
      }

      const config = WalletManager.getTab(WalletTab.PROSPECTS)
      expect(config?.isDisplayed(context)).toBe(true)
    })

    it('should hide PROSPECTS tab when feature flag is disabled', () => {
      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.PROSPECTS)
      expect(config?.isDisplayed(context)).toBe(false)
    })
  })
})
