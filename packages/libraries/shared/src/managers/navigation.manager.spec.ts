import { RouteName } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import type { Permission } from '@pulse/common/types'
import { NavigationManager } from './navigation.manager'
import { createMockMenuContext, createMockMenuItem, createMockMenuContextWithPermissions } from '@shared/__mocks__/navigation.mocks'

/**
 * Create a hasPermission function that returns true for specified permission keys
 * Returns true if the requested permission array matches any of the enabled permission constants
 */
function createHasPermission(enabledKeys: string[]) {
  // Build a Set of enabled permission arrays for fast lookup
  const enabledPermArrays = enabledKeys.map(key => {
    const accountPerm = ACCOUNT_PERMISSIONS[key as keyof typeof ACCOUNT_PERMISSIONS]
    const globalPerm = GLOBAL_PERMISSIONS[key as keyof typeof GLOBAL_PERMISSIONS]
    return accountPerm ?? globalPerm
  }).filter(Boolean)

  return (permission: Permission[]) => {
    // Check if the requested permission array matches any enabled permission array
    return enabledPermArrays.some(enabledPerm =>
      permission.length === enabledPerm.length &&
      permission.every(p => enabledPerm.includes(p as Permission)),
    )
  }
}

describe('NavigationManager', () => {
  beforeEach(() => {
    NavigationManager.resetMenuItems()
  })

  describe('register()', () => {
    it('should register a menu item with all properties', () => {
      const menuItem = createMockMenuItem({
        id: 'test-item',
        title: 'shared.sidebar.test',
        icon: 'house',
        routeName: RouteName.GED,
        order: 1,
        featureName: 'test feature',
      })

      NavigationManager.register(menuItem)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        routeName: RouteName.GED,
        title: 'shared.sidebar.test',
        icon: 'house',
        featureName: 'test feature',
      })
    })

    it('should overwrite an existing menu item with the same id', () => {
      const firstItem = createMockMenuItem({
        id: 'same-id',
        title: 'shared.sidebar.first',
        order: 1,
      })

      const secondItem = createMockMenuItem({
        id: 'same-id',
        title: 'shared.sidebar.second',
        order: 2,
      })

      NavigationManager.register(firstItem)
      NavigationManager.register(secondItem)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items).toHaveLength(1)
      expect(items[0].title).toBe('shared.sidebar.second')
    })

    it('should allow registering multiple menu items', () => {
      const item1 = createMockMenuItem({ id: 'item-1', order: 1 })
      const item2 = createMockMenuItem({ id: 'item-2', order: 2 })
      const item3 = createMockMenuItem({ id: 'item-3', order: 3 })

      NavigationManager.register(item1)
      NavigationManager.register(item2)
      NavigationManager.register(item3)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items).toHaveLength(3)
    })
  })

  describe('getMenuItem()', () => {
    it('should return undefined if menu item does not exist', () => {
      const result = NavigationManager.getMenuItem('non-existent')

      expect(result).toBeUndefined()
    })

    it('should return the menu item configuration by id', () => {
      const menuItem = createMockMenuItem({
        id: 'test-item',
        title: 'shared.sidebar.test',
        icon: 'house',
        order: 1,
      })

      NavigationManager.register(menuItem)

      const result = NavigationManager.getMenuItem('test-item')

      expect(result).toBeDefined()
      expect(result?.id).toBe('test-item')
      expect(result?.title).toBe('shared.sidebar.test')
      expect(result?.icon).toBe('house')
      expect(result?.order).toBe(1)
    })

    it('should return the correct menu item when multiple items are registered', () => {
      const item1 = createMockMenuItem({ id: 'item-1', title: 'shared.sidebar.first' })
      const item2 = createMockMenuItem({ id: 'item-2', title: 'shared.sidebar.second' })
      const item3 = createMockMenuItem({ id: 'item-3', title: 'shared.sidebar.third' })

      NavigationManager.register(item1)
      NavigationManager.register(item2)
      NavigationManager.register(item3)

      const result = NavigationManager.getMenuItem('item-2')

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-2')
      expect(result?.title).toBe('shared.sidebar.second')
    })
  })

  describe('getMenuItems()', () => {
    it('should return an empty array if no items are registered', () => {
      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items).toEqual([])
    })

    it('should filter items based on shouldDisplay()', () => {
      const visibleItem = createMockMenuItem({
        id: 'visible',
        routeName: RouteName.GED,
        shouldDisplay: () => true,
        order: 1,
      })

      const hiddenItem = createMockMenuItem({
        id: 'hidden',
        shouldDisplay: () => false,
        order: 2,
      })

      NavigationManager.register(visibleItem)
      NavigationManager.register(hiddenItem)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items).toHaveLength(1)
    })

    it('should sort items by order in ascending order', () => {
      const item1 = createMockMenuItem({ id: 'item-1', title: 'shared.sidebar.third', order: 3 })
      const item2 = createMockMenuItem({ id: 'item-2', title: 'shared.sidebar.first', order: 1 })
      const item3 = createMockMenuItem({ id: 'item-3', title: 'shared.sidebar.second', order: 2 })

      NavigationManager.register(item1)
      NavigationManager.register(item2)
      NavigationManager.register(item3)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items).toHaveLength(3)
      expect(items[0].title).toBe('shared.sidebar.first')
      expect(items[1].title).toBe('shared.sidebar.second')
      expect(items[2].title).toBe('shared.sidebar.third')
    })

    it('should map properties correctly (routeName, title, icon)', () => {
      const menuItem = createMockMenuItem({
        id: 'test',
        title: 'shared.sidebar.test',
        icon: 'clipboardData',
        routeName: RouteName.GED,
        order: 1,
      })

      NavigationManager.register(menuItem)

      const context = createMockMenuContext({ entityId: 456 })
      const items = NavigationManager.getMenuItems(context)

      expect(items[0]).toMatchObject({
        routeName: RouteName.GED,
        title: 'shared.sidebar.test',
        icon: 'clipboardData',
      })
    })

    it('should return routeName from the menu item config', () => {
      const menuItem = createMockMenuItem({
        id: 'test',
        routeName: RouteName.GED,
        order: 1,
      })

      NavigationManager.register(menuItem)

      const context = createMockMenuContext({ entityId: 789 })
      const items = NavigationManager.getMenuItems(context)

      expect(items[0].routeName).toBe(RouteName.GED)
    })

    it('should handle optional featureName', () => {
      const itemWithFeature = createMockMenuItem({
        id: 'with-feature',
        featureName: 'my feature',
        order: 1,
      })

      const itemWithoutFeature = createMockMenuItem({
        id: 'without-feature',
        order: 2,
      })

      NavigationManager.register(itemWithFeature)
      NavigationManager.register(itemWithoutFeature)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items[0].featureName).toBe('my feature')
      expect(items[1].featureName).toBeUndefined()
    })

    it('should call hasSubmenuSelected() if provided, otherwise undefined', () => {
      const hasSubmenuSelectedMock = vi.fn(() => true)

      const itemWithSubmenu = createMockMenuItem({
        id: 'with-submenu',
        hasSubmenuSelected: hasSubmenuSelectedMock,
        order: 1,
      })

      const itemWithoutSubmenu = createMockMenuItem({
        id: 'without-submenu',
        order: 2,
      })

      NavigationManager.register(itemWithSubmenu)
      NavigationManager.register(itemWithoutSubmenu)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(hasSubmenuSelectedMock).toHaveBeenCalledWith(context)
      expect(items[0].hasSubmenuSelected).toBe(true)
      expect(items[1].hasSubmenuSelected).toBeUndefined()
    })

    it('should include showInMobile property based on config', () => {
      const mobileItem = createMockMenuItem({ id: 'item-1', showInMobile: true, order: 1 })
      const desktopItem = createMockMenuItem({ id: 'item-2', showInMobile: false, order: 2 })

      NavigationManager.register(mobileItem)
      NavigationManager.register(desktopItem)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items[0].showInMobile).toBe(true)
      expect(items[1].showInMobile).toBe(false)
    })

    it('should default activeRoutes to [routeName] when not specified', () => {
      const item = createMockMenuItem({
        id: 'test',
        routeName: RouteName.GED,
        order: 1,
      })

      NavigationManager.register(item)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items[0].activeRoutes).toEqual([RouteName.GED])
    })

    it('should use provided activeRoutes when specified', () => {
      const item = createMockMenuItem({
        id: 'test',
        routeName: RouteName.GED,
        activeRoutes: [RouteName.GED, RouteName.PENNYLANE_GED_V2],
        order: 1,
      })

      NavigationManager.register(item)

      const context = createMockMenuContext()
      const items = NavigationManager.getMenuItems(context)

      expect(items[0].activeRoutes).toEqual([RouteName.GED, RouteName.PENNYLANE_GED_V2])
    })
  })

  describe('getEntityOverviewMenuItem()', () => {
    it('should return null if no permissions are granted', () => {
      const context = createMockMenuContextWithPermissions({
        hasPermission: () => false,
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result).toBeNull()
    })

    it('should return title "shared.sidebar.folder" for collab users', () => {
      const context = createMockMenuContextWithPermissions({
        isCollab: true,
        hasPermission: createHasPermission(['COLLABORATORS']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.title).toBe('shared.sidebar.folder')
    })

    it('should return title "shared.sidebar.entity" for non-collab users', () => {
      const context = createMockMenuContextWithPermissions({
        isCollab: false,
        hasPermission: createHasPermission(['USERS']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.title).toBe('shared.sidebar.entity')
    })

    it('should prioritize gestion-utilisateurs route if hasUsers is true', () => {
      const context = createMockMenuContextWithPermissions({
        entityId: 123,
        hasPermission: createHasPermission(['USERS', 'COLLABORATORS', 'OFFER', 'INFORMATION', 'HISTORY']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.USERS)
    })

    it('should prioritize collaborateurs route for collab with hasCollaborators', () => {
      const context = createMockMenuContextWithPermissions({
        entityId: 123,
        isCollab: true,
        hasPermission: createHasPermission(['COLLABORATORS', 'OFFER', 'INFORMATION', 'HISTORY']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.COLLAB)
    })

    it('should prioritize offres route if hasOffer is true', () => {
      const context = createMockMenuContextWithPermissions({
        entityId: 123,
        hasPermission: createHasPermission(['OFFER', 'INFORMATION', 'HISTORY']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.OFFERS)
    })

    it('should prioritize informations route if hasInformation is true', () => {
      const context = createMockMenuContextWithPermissions({
        entityId: 123,
        hasPermission: createHasPermission(['INFORMATION', 'HISTORY']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.INFO)
    })

    it('should prioritize historique-delegations route for collab with hasHistory', () => {
      const context = createMockMenuContextWithPermissions({
        entityId: 123,
        isCollab: true,
        hasPermission: createHasPermission(['HISTORY']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.DELEGATIONS_HISTORY)
    })

    it('should always have icon: "building"', () => {
      const context = createMockMenuContextWithPermissions({
        hasPermission: createHasPermission(['USERS']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.icon).toBe('building')
    })

    it('should include activeRoutes for entity overview', () => {
      const context = createMockMenuContextWithPermissions({
        hasPermission: createHasPermission(['USERS']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.activeRoutes).toContain(RouteName.USERS)
      expect(result?.activeRoutes).toContain(RouteName.COLLAB)
      expect(result?.activeRoutes).toContain(RouteName.OFFERS)
      expect(result?.activeRoutes).toContain(RouteName.INFO)
      expect(result?.activeRoutes).toContain(RouteName.DELEGATIONS_HISTORY)
    })

    it('should return routeName from menu configuration', () => {
      const context = createMockMenuContextWithPermissions({
        entityId: 999,
        hasPermission: createHasPermission(['INFORMATION']),
      })

      const result = NavigationManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.INFO)
    })
  })
})
