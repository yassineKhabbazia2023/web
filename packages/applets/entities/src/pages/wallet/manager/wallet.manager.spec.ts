import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WalletManager } from './wallet.manager'
import { createMockWalletContext, createMockWalletTabConfig } from '../__mocks__/wallet.manager.mocks'
import { WalletTab } from '../Wallet.enums'
import { RouteName } from '@pulse/common/enums'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'

describe('WalletManager', () => {
  beforeEach(() => {
    // Clear the private Map between tests
    // @ts-expect-error - Accessing private static field for test cleanup
    WalletManager.tabs.clear()
  })

  describe('register()', () => {
    it('should register a wallet tab with all properties', () => {
      const tabConfig = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        title: 'entities.wallet.folders',
        route: RouteName.FOLDERS,
        order: 1,
      })

      WalletManager.register(tabConfig)

      const context = createMockWalletContext({ isCollab: true })
      const tabs = WalletManager.getTabs(context)

      expect(tabs).toHaveLength(1)
      expect(tabs[0]).toMatchObject({
        name: WalletTab.FOLDERS,
        title: 'entities.wallet.folders',
        route: RouteName.FOLDERS,
        display: true,
      })
    })

    it('should overwrite an existing tab with the same id', () => {
      const firstConfig = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        title: 'entities.wallet.first',
        order: 1,
      })

      const secondConfig = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        title: 'entities.wallet.second',
        order: 2,
      })

      WalletManager.register(firstConfig)
      WalletManager.register(secondConfig)

      const context = createMockWalletContext()
      const tabs = WalletManager.getTabs(context)

      expect(tabs).toHaveLength(1)
      expect(tabs[0].title).toBe('entities.wallet.second')
    })

    it('should allow registering multiple tabs', () => {
      const tab1 = createMockWalletTabConfig({ id: WalletTab.FOLDERS, order: 1 })
      const tab2 = createMockWalletTabConfig({ id: WalletTab.COLLABORATORS, order: 2 })
      const tab3 = createMockWalletTabConfig({ id: WalletTab.ALL_USERS, order: 3 })

      WalletManager.register(tab1)
      WalletManager.register(tab2)
      WalletManager.register(tab3)

      const context = createMockWalletContext()
      const tabs = WalletManager.getTabs(context)

      expect(tabs).toHaveLength(3)
    })
  })

  describe('getTabs()', () => {
    it('should return an empty array if no tabs are registered', () => {
      const context = createMockWalletContext()
      const tabs = WalletManager.getTabs(context)

      expect(tabs).toEqual([])
    })

    it('should filter tabs based on isDisplayed()', () => {
      const visibleTab = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        isDisplayed: () => true,
        order: 1,
      })

      const hiddenTab = createMockWalletTabConfig({
        id: WalletTab.COLLABORATORS,
        isDisplayed: () => false,
        order: 2,
      })

      WalletManager.register(visibleTab)
      WalletManager.register(hiddenTab)

      const context = createMockWalletContext()
      const tabs = WalletManager.getTabs(context)

      expect(tabs).toHaveLength(1)
      expect(tabs[0].name).toBe(WalletTab.FOLDERS)
    })

    it('should sort tabs by order in ascending order', () => {
      const tab1 = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        title: 'entities.wallet.third',
        order: 3,
      })
      const tab2 = createMockWalletTabConfig({
        id: WalletTab.COLLABORATORS,
        title: 'entities.wallet.first',
        order: 1,
      })
      const tab3 = createMockWalletTabConfig({
        id: WalletTab.ALL_USERS,
        title: 'entities.wallet.second',
        order: 2,
      })

      WalletManager.register(tab1)
      WalletManager.register(tab2)
      WalletManager.register(tab3)

      const context = createMockWalletContext()
      const tabs = WalletManager.getTabs(context)

      expect(tabs).toHaveLength(3)
      expect(tabs[0].title).toBe('entities.wallet.first')
      expect(tabs[1].title).toBe('entities.wallet.second')
      expect(tabs[2].title).toBe('entities.wallet.third')
    })

    it('should map properties correctly (name, title, route)', () => {
      const tabConfig = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        title: 'entities.wallet.folders',
        route: RouteName.FOLDERS,
        order: 1,
      })

      WalletManager.register(tabConfig)

      const context = createMockWalletContext()
      const tabs = WalletManager.getTabs(context)

      expect(tabs[0]).toMatchObject({
        name: WalletTab.FOLDERS,
        title: 'entities.wallet.folders',
        route: RouteName.FOLDERS,
      })
    })

    it('should call isDisplayed() with context', () => {
      const isDisplayedMock = vi.fn(() => true)

      const tabConfig = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        isDisplayed: isDisplayedMock,
        order: 1,
      })

      WalletManager.register(tabConfig)

      const context = createMockWalletContext({ isCollab: true })
      WalletManager.getTabs(context)

      expect(isDisplayedMock).toHaveBeenCalledWith(context)
    })

    it('should return display: true for all returned tabs', () => {
      const tab1 = createMockWalletTabConfig({ id: WalletTab.FOLDERS, order: 1 })
      const tab2 = createMockWalletTabConfig({ id: WalletTab.COLLABORATORS, order: 2 })

      WalletManager.register(tab1)
      WalletManager.register(tab2)

      const context = createMockWalletContext()
      const tabs = WalletManager.getTabs(context)

      expect(tabs[0].display).toBe(true)
      expect(tabs[1].display).toBe(true)
    })

    it('should filter collab tabs correctly', () => {
      const collabTab = createMockWalletTabConfig({
        id: WalletTab.FOLDERS,
        isDisplayed: (context) => context.isCollab,
        order: 1,
      })

      const customerTab = createMockWalletTabConfig({
        id: WalletTab.ENTITY_CLIENT,
        isDisplayed: (context) => !context.isCollab,
        order: 2,
      })

      WalletManager.register(collabTab)
      WalletManager.register(customerTab)

      const collabContext = createMockWalletContext({ isCollab: true })
      const collabTabs = WalletManager.getTabs(collabContext)

      expect(collabTabs).toHaveLength(1)
      expect(collabTabs[0].name).toBe(WalletTab.FOLDERS)

      const customerContext = createMockWalletContext({ isCollab: false })
      const customerTabs = WalletManager.getTabs(customerContext)

      expect(customerTabs).toHaveLength(1)
      expect(customerTabs[0].name).toBe(WalletTab.ENTITY_CLIENT)
    })

    it('should filter tabs based on permissions', () => {
      const tabWithPermission = createMockWalletTabConfig({
        id: WalletTab.COLLABORATORS,
        isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.COLLABORATORS),
        order: 1,
      })

      WalletManager.register(tabWithPermission)

      const contextWithoutPermission = createMockWalletContext({
        hasPermission: () => false,
      })
      const tabsWithoutPermission = WalletManager.getTabs(contextWithoutPermission)

      expect(tabsWithoutPermission).toHaveLength(0)

      const contextWithPermission = createMockWalletContext({
        hasPermission: () => true,
      })
      const tabsWithPermission = WalletManager.getTabs(contextWithPermission)

      expect(tabsWithPermission).toHaveLength(1)
      expect(tabsWithPermission[0].name).toBe(WalletTab.COLLABORATORS)
    })

    it('should filter tabs based on feature flags', () => {
      const tabWithFeatureFlag = createMockWalletTabConfig({
        id: WalletTab.POWER_BI,
        isDisplayed: (context) => context.hasFeatureFlag('TEST_FEATURE' as any),
        order: 1,
      })

      WalletManager.register(tabWithFeatureFlag)

      const contextWithoutFeature = createMockWalletContext({
        hasFeatureFlag: () => false,
      })
      const tabsWithoutFeature = WalletManager.getTabs(contextWithoutFeature)

      expect(tabsWithoutFeature).toHaveLength(0)

      const contextWithFeature = createMockWalletContext({
        hasFeatureFlag: () => true,
      })
      const tabsWithFeature = WalletManager.getTabs(contextWithFeature)

      expect(tabsWithFeature).toHaveLength(1)
      expect(tabsWithFeature[0].name).toBe(WalletTab.POWER_BI)
    })
  })
})
