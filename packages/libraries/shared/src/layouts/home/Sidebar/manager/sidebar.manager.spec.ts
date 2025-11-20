import { RouteName } from '@pulse/common/enums'
import { SidebarManager } from './sidebar.manager'
import { createMockContext, createMockMenuItem, createContextWithPermissions } from '@shared/layouts/home/Sidebar/__mocks__/sidebar.manager.mocks'

describe('SidebarManager', () => {
  beforeEach(() => {
    // Clear the private Map between tests
    // @ts-expect-error - Accessing private static field for test cleanup
    SidebarManager.menuItems.clear()
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

      SidebarManager.register(menuItem)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        routeName: RouteName.GED,
        title: 'shared.sidebar.test',
        iconLeftName: 'house',
        display: true,
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

      SidebarManager.register(firstItem)
      SidebarManager.register(secondItem)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

      expect(items).toHaveLength(1)
      expect(items[0].title).toBe('shared.sidebar.second')
    })

    it('should allow registering multiple menu items', () => {
      const item1 = createMockMenuItem({ id: 'item-1', order: 1 })
      const item2 = createMockMenuItem({ id: 'item-2', order: 2 })
      const item3 = createMockMenuItem({ id: 'item-3', order: 3 })

      SidebarManager.register(item1)
      SidebarManager.register(item2)
      SidebarManager.register(item3)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

      expect(items).toHaveLength(3)
    })
  })

  describe('getMenuItem()', () => {
    it('should return undefined if menu item does not exist', () => {
      const result = SidebarManager.getMenuItem('non-existent')

      expect(result).toBeUndefined()
    })

    it('should return the menu item configuration by id', () => {
      const menuItem = createMockMenuItem({
        id: 'test-item',
        title: 'shared.sidebar.test',
        icon: 'house',
        order: 1,
      })

      SidebarManager.register(menuItem)

      const result = SidebarManager.getMenuItem('test-item')

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

      SidebarManager.register(item1)
      SidebarManager.register(item2)
      SidebarManager.register(item3)

      const result = SidebarManager.getMenuItem('item-2')

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-2')
      expect(result?.title).toBe('shared.sidebar.second')
    })
  })

  describe('getMenuItems()', () => {
    it('should return an empty array if no items are registered', () => {
      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

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

      SidebarManager.register(visibleItem)
      SidebarManager.register(hiddenItem)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

      expect(items).toHaveLength(1)
    })

    it('should sort items by order in ascending order', () => {
      const item1 = createMockMenuItem({ id: 'item-1', title: 'shared.sidebar.third', order: 3 })
      const item2 = createMockMenuItem({ id: 'item-2', title: 'shared.sidebar.first', order: 1 })
      const item3 = createMockMenuItem({ id: 'item-3', title: 'shared.sidebar.second', order: 2 })

      SidebarManager.register(item1)
      SidebarManager.register(item2)
      SidebarManager.register(item3)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

      expect(items).toHaveLength(3)
      expect(items[0].title).toBe('shared.sidebar.first')
      expect(items[1].title).toBe('shared.sidebar.second')
      expect(items[2].title).toBe('shared.sidebar.third')
    })

    it('should map properties correctly (routeName, title, iconLeftName)', () => {
      const menuItem = createMockMenuItem({
        id: 'test',
        title: 'shared.sidebar.test',
        icon: 'clipboardData',
        routeName: RouteName.GED,
        order: 1,
      })

      SidebarManager.register(menuItem)

      const context = createMockContext({ entityId: 456 })
      const items = SidebarManager.getMenuItems(context)

      expect(items[0]).toMatchObject({
        routeName: RouteName.GED,
        title: 'shared.sidebar.test',
        iconLeftName: 'clipboardData',
      })
    })

    it('should return routeName from the menu item config', () => {
      const menuItem = createMockMenuItem({
        id: 'test',
        routeName: RouteName.GED,
        order: 1,
      })

      SidebarManager.register(menuItem)

      const context = createMockContext({ entityId: 789 })
      const items = SidebarManager.getMenuItems(context)

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

      SidebarManager.register(itemWithFeature)
      SidebarManager.register(itemWithoutFeature)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

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

      SidebarManager.register(itemWithSubmenu)
      SidebarManager.register(itemWithoutSubmenu)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

      expect(hasSubmenuSelectedMock).toHaveBeenCalledWith(context)
      expect(items[0].hasSubmenuSelected).toBe(true)
      expect(items[1].hasSubmenuSelected).toBeUndefined()
    })

    it('should return display: true for all returned items', () => {
      const item1 = createMockMenuItem({ id: 'item-1', order: 1 })
      const item2 = createMockMenuItem({ id: 'item-2', order: 2 })

      SidebarManager.register(item1)
      SidebarManager.register(item2)

      const context = createMockContext()
      const items = SidebarManager.getMenuItems(context)

      expect(items[0].display).toBe(true)
      expect(items[1].display).toBe(true)
    })
  })

  describe('getEntityOverviewMenuItem()', () => {
    it('should return null if no permissions are granted', () => {
      const context = createContextWithPermissions([])

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result).toBeNull()
    })

    it('should return title "shared.sidebar.folder" for collab users', () => {
      const context = createContextWithPermissions(['hasCollaborators'], { isCollab: true })

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.title).toBe('shared.sidebar.folder')
    })

    it('should return title "shared.sidebar.entity" for non-collab users', () => {
      const context = createContextWithPermissions(['hasUsers'], { isCollab: false })

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.title).toBe('shared.sidebar.entity')
    })

    it('should prioritize gestion-utilisateurs route if hasUsers is true', () => {
      const context = createContextWithPermissions(
        ['hasUsers', 'hasCollaborators', 'hasOffer', 'hasInformation', 'hasHistory'],
        { entityId: 123 },
      )

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.USERS)
    })

    it('should prioritize collaborateurs route for collab with hasCollaborators', () => {
      const context = createContextWithPermissions(
        ['hasCollaborators', 'hasOffer', 'hasInformation', 'hasHistory'],
        { entityId: 123, isCollab: true },
      )

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.COLLAB)
    })

    it('should prioritize offres route if hasOffer is true', () => {
      const context = createContextWithPermissions(
        ['hasOffer', 'hasInformation', 'hasHistory'],
        { entityId: 123 },
      )

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.OFFERS)
    })

    it('should prioritize informations route if hasInformation is true', () => {
      const context = createContextWithPermissions(
        ['hasInformation', 'hasHistory'],
        { entityId: 123 },
      )

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.INFO)
    })

    it('should prioritize historique-delegations route for collab with hasHistory', () => {
      const context = createContextWithPermissions(['hasHistory'], { entityId: 123, isCollab: true })

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.DELEGATIONS_HISTORY)
    })

    it('should always have iconLeftName: "building"', () => {
      const context = createContextWithPermissions(['hasUsers'])

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.iconLeftName).toBe('building')
    })

    it('should return routeName from menu configuration', () => {
      const context = createContextWithPermissions(['hasInformation'], { entityId: 999 })

      const result = SidebarManager.getEntityOverviewMenuItem(context)

      expect(result?.routeName).toBe(RouteName.INFO)
    })
  })
})
