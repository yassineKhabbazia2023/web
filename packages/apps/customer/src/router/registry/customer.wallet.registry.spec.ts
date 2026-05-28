import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'
import { registerCustomerWalletTabs } from './customer.wallet.registry'

const userStoreMock = getStoreMock(useUserStore)

describe('registerCustomerWalletTabs', () => {
  beforeEach(() => {
    WalletManager.clear()
  })

  it('should register 2 wallet tab', () => {
    registerCustomerWalletTabs()
    expect(WalletManager.getTabCount()).toBe(2)
  })

  it('should register CUSTOMER_ENTITIES tab correctly', () => {
    registerCustomerWalletTabs()
    const config = WalletManager.getTab(WalletTab.CUSTOMER_ENTITIES)
    expect(config?.route).toBe(RouteName.CUSTOMER_ENTITIES)
  })

  it('should register prospects tab correctly', () => {
    registerCustomerWalletTabs()
    const config = WalletManager.getTab(WalletTab.PROSPECTS)
    expect(config?.route).toBe(RouteName.CUSTOMER_PROSPECTS)
  })

  describe('isDisplayed behavior - CUSTOMER_ENTITIES tab', () => {
    it('should display CUSTOMER_ENTITIES tab when regular entities exist', () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
      registerCustomerWalletTabs()

      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.CUSTOMER_ENTITIES)
      expect(config?.isDisplayed(context)).toBe(true)
    })

    it('should hide CUSTOMER_ENTITIES tab when no regular entities exist', () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
      registerCustomerWalletTabs()

      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.CUSTOMER_ENTITIES)
      expect(config?.isDisplayed(context)).toBe(false)
    })
  })

  describe('isDisplayed behavior - PROSPECTS tab', () => {
    it('should display PROSPECTS tab when feature flag is enabled and prospects exist', () => {
      userStoreMock.getProspectEntitiesCount.mockReturnValue(3)
      registerCustomerWalletTabs()

      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => true,
      }

      const config = WalletManager.getTab(WalletTab.PROSPECTS)
      expect(config?.isDisplayed(context)).toBe(true)
    })

    it('should hide PROSPECTS tab when feature flag is disabled', () => {
      userStoreMock.getProspectEntitiesCount.mockReturnValue(3)
      registerCustomerWalletTabs()

      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => false,
      }

      const config = WalletManager.getTab(WalletTab.PROSPECTS)
      expect(config?.isDisplayed(context)).toBe(false)
    })

    it('should hide PROSPECTS tab when no prospect entities exist', () => {
      userStoreMock.getProspectEntitiesCount.mockReturnValue(0)
      registerCustomerWalletTabs()

      const context = {
        isCollab: false,
        hasPermission: () => false,
        hasFeatureFlag: () => true,
      }

      const config = WalletManager.getTab(WalletTab.PROSPECTS)
      expect(config?.isDisplayed(context)).toBe(false)
    })
  })
})
