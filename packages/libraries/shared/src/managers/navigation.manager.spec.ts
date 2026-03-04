import { RouteName, AccountType } from '@pulse/common/enums'
import { NavigationManager } from './navigation.manager'
import { createMockNavigationContext, createMockNavigationItemConfig } from '@shared/__mocks__/navigation.mocks'

describe('NavigationManager', () => {
  beforeEach(() => {
    NavigationManager.resetNavigationItems()
  })

  describe('register()', () => {
    it('should register a menu item with all properties', () => {
      const menuItem = createMockNavigationItemConfig({
        id: 'test-item',
        title: () => 'shared.sidebar.test',
        icon: 'house',
        routeName: RouteName.GED,
        order: 1,
        featureName: 'test feature',
      })

      NavigationManager.register(menuItem)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        routeName: RouteName.GED,
        title: 'shared.sidebar.test',
        icon: 'house',
        featureName: 'test feature',
      })
    })

    it('should overwrite an existing menu item with the same id', () => {
      const firstItem = createMockNavigationItemConfig({
        id: 'same-id',
        title: () => 'shared.sidebar.first',
        order: 1,
      })

      const secondItem = createMockNavigationItemConfig({
        id: 'same-id',
        title: () => 'shared.sidebar.second',
        order: 2,
      })

      NavigationManager.register(firstItem)
      NavigationManager.register(secondItem)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items).toHaveLength(1)
      expect(items[0].title).toBe('shared.sidebar.second')
    })

    it('should allow registering multiple menu items', () => {
      const item1 = createMockNavigationItemConfig({ id: 'item-1', order: 1 })
      const item2 = createMockNavigationItemConfig({ id: 'item-2', order: 2 })
      const item3 = createMockNavigationItemConfig({ id: 'item-3', order: 3 })

      NavigationManager.register(item1)
      NavigationManager.register(item2)
      NavigationManager.register(item3)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items).toHaveLength(3)
    })
  })

  describe('getNavigationItems()', () => {
    it('should return an empty array if no items are registered', () => {
      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items).toEqual([])
    })

    it('should filter items based on shouldDisplay()', () => {
      const visibleItem = createMockNavigationItemConfig({
        id: 'visible',
        routeName: RouteName.GED,
        shouldDisplay: () => true,
        order: 1,
      })

      const hiddenItem = createMockNavigationItemConfig({
        id: 'hidden',
        shouldDisplay: () => false,
        order: 2,
      })

      NavigationManager.register(visibleItem)
      NavigationManager.register(hiddenItem)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items).toHaveLength(1)
    })

    it('should sort items by order in ascending order', () => {
      const item1 = createMockNavigationItemConfig({ id: 'item-1', title: () => 'shared.sidebar.third', order: 3 })
      const item2 = createMockNavigationItemConfig({ id: 'item-2', title: () => 'shared.sidebar.first', order: 1 })
      const item3 = createMockNavigationItemConfig({ id: 'item-3', title: () => 'shared.sidebar.second', order: 2 })

      NavigationManager.register(item1)
      NavigationManager.register(item2)
      NavigationManager.register(item3)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items).toHaveLength(3)
      expect(items[0].title).toBe('shared.sidebar.first')
      expect(items[1].title).toBe('shared.sidebar.second')
      expect(items[2].title).toBe('shared.sidebar.third')
    })

    it('should map properties correctly (routeName, title, icon)', () => {
      const menuItem = createMockNavigationItemConfig({
        id: 'test',
        title: () => 'shared.sidebar.test',
        icon: 'clipboardData',
        routeName: RouteName.GED,
        order: 1,
      })

      NavigationManager.register(menuItem)

      const context = createMockNavigationContext({ entityId: 456 })
      const items = NavigationManager.getNavigationItems(context)

      expect(items[0]).toMatchObject({
        routeName: RouteName.GED,
        title: 'shared.sidebar.test',
        icon: 'clipboardData',
      })
    })

    it('should return routeName from the menu item config', () => {
      const menuItem = createMockNavigationItemConfig({
        id: 'test',
        routeName: RouteName.GED,
        order: 1,
      })

      NavigationManager.register(menuItem)

      const context = createMockNavigationContext({ entityId: 789 })
      const items = NavigationManager.getNavigationItems(context)

      expect(items[0].routeName).toBe(RouteName.GED)
    })

    it('should handle optional featureName', () => {
      const itemWithFeature = createMockNavigationItemConfig({
        id: 'with-feature',
        featureName: 'my feature',
        order: 1,
      })

      const itemWithoutFeature = createMockNavigationItemConfig({
        id: 'without-feature',
        order: 2,
      })

      NavigationManager.register(itemWithFeature)
      NavigationManager.register(itemWithoutFeature)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items[0].featureName).toBe('my feature')
      expect(items[1].featureName).toBeUndefined()
    })

    it('should call hasSubmenuSelected() if provided, otherwise undefined', () => {
      const hasSubmenuSelectedMock = vi.fn(() => true)

      const itemWithSubmenu = createMockNavigationItemConfig({
        id: 'with-submenu',
        hasSubmenuSelected: hasSubmenuSelectedMock,
        order: 1,
      })

      const itemWithoutSubmenu = createMockNavigationItemConfig({
        id: 'without-submenu',
        order: 2,
      })

      NavigationManager.register(itemWithSubmenu)
      NavigationManager.register(itemWithoutSubmenu)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(hasSubmenuSelectedMock).toHaveBeenCalledWith(context)
      expect(items[0].hasSubmenuSelected).toBe(true)
      expect(items[1].hasSubmenuSelected).toBeUndefined()
    })

    it('should include showInMobile property based on config', () => {
      const mobileItem = createMockNavigationItemConfig({ id: 'item-1', showInMobile: true, order: 1 })
      const desktopItem = createMockNavigationItemConfig({ id: 'item-2', showInMobile: false, order: 2 })

      NavigationManager.register(mobileItem)
      NavigationManager.register(desktopItem)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items[0].showInMobile).toBe(true)
      expect(items[1].showInMobile).toBe(false)
    })

    it('should default activeRoutes to [routeName] when not specified', () => {
      const item = createMockNavigationItemConfig({
        id: 'test',
        routeName: RouteName.GED,
        order: 1,
      })

      NavigationManager.register(item)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items[0].activeRoutes).toEqual([RouteName.GED])
    })

    it('should filter items by accountType', () => {
      const regularItem = createMockNavigationItemConfig({ id: 'regular', accountType: AccountType.REGULAR, order: 1 })
      const prospectItem = createMockNavigationItemConfig({ id: 'prospect', accountType: AccountType.PROSPECT, order: 2 })

      NavigationManager.register(regularItem)
      NavigationManager.register(prospectItem)

      const context = createMockNavigationContext()
      const regularItems = NavigationManager.getNavigationItems(context, AccountType.REGULAR)
      const prospectItems = NavigationManager.getNavigationItems(context, AccountType.PROSPECT)

      expect(regularItems).toHaveLength(1)
      expect(regularItems[0].title).toBe('shared.sidebar.testItem')
      expect(prospectItems).toHaveLength(1)
      expect(prospectItems[0].title).toBe('shared.sidebar.testItem')
    })

    it('should use provided activeRoutes when specified', () => {
      const item = createMockNavigationItemConfig({
        id: 'test',
        routeName: RouteName.GED,
        activeRoutes: [RouteName.GED, RouteName.PENNYLANE_GED_V2],
        order: 1,
      })

      NavigationManager.register(item)

      const context = createMockNavigationContext()
      const items = NavigationManager.getNavigationItems(context)

      expect(items[0].activeRoutes).toEqual([RouteName.GED, RouteName.PENNYLANE_GED_V2])
    })
  })
})
