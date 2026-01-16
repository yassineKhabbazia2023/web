import { NavigationManager } from '@pulse/shared/managers'
import { RouteName } from '@pulse/common/enums'
import { createNavigationContext } from '@pulse/shared/mocks'
import { registerCollaboratorNavigationItems } from './collaborator.navigation.registry'

// Items that are always available when user has the basic permission
const BASIC_ITEMS = [
  'bi-reports',
]

// Document management items (mutually exclusive based on configuration)
const DOCUMENT_ITEMS = {
  LEGACY_GED: 'documents-legacy',
  PENNYLANE_V2: 'pennylane-accounting-v2',
  PENNYLANE_LEGACY: 'pennylane-accounting-legacy',
  SOCIAL_MANAGEMENT: 'social-management',
}

describe('registerCollaboratorNavigationItems', () => {
  beforeEach(() => {
    NavigationManager.resetMenuItems()
    registerCollaboratorNavigationItems()
  })

  it('should add five sidebar items', () => {
    // @ts-expect-error - Accessing private static field for test
    expect(NavigationManager.menuItems.size).toBe(5)
  })

  it.each([
    { itemKey: 'bi-reports', expectedRouteName: RouteName.REPORTS },
    { itemKey: 'documents-legacy', expectedRouteName: RouteName.GED },
    { itemKey: 'pennylane-accounting-v2', expectedRouteName: RouteName.PENNYLANE_GED_V2 },
    { itemKey: 'pennylane-accounting-legacy', expectedRouteName: RouteName.PENNYLANE_GED_LEGACY },
    { itemKey: 'social-management', expectedRouteName: RouteName.PENNYLANE_SOCIAL_MANAGEMENT },
  ])('should register $itemKey sidebar item with correct routeName', ({ itemKey, expectedRouteName }) => {
    const config = NavigationManager.getMenuItem(itemKey)

    expect(config?.routeName).toBe(expectedRouteName)
  })

  describe('shouldDisplay behavior - User with legacy GED only', () => {
    const context = createNavigationContext({
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
    })

    it('should display basic items and legacy GED', () => {
      const visibleItems = [
        'bi-reports',
        'documents-legacy',
      ]

      visibleItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(true)
      })
    })

    it('should hide Pennylane and Social Management items', () => {
      const hiddenItems = [
        'pennylane-accounting-v2',
        'pennylane-accounting-legacy',
        'social-management',
      ]

      hiddenItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with Pennylane V2', () => {
    const context = createNavigationContext({
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: true,
      hasSocialManagementV2: false,
    })

    it('should display basic items and Pennylane V2', () => {
      const visibleItems = [
        'bi-reports',
        'pennylane-accounting-v2',
      ]

      visibleItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(true)
      })
    })

    it('should hide legacy GED, legacy Pennylane and Social Management', () => {
      const hiddenItems = [
        'documents-legacy',
        'pennylane-accounting-legacy',
        'social-management',
      ]

      hiddenItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with Pennylane legacy', () => {
    const context = createNavigationContext({
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: true,
      hasPennylaneAccountingGedV2: false,
      hasPennylaneAccountingGedLegacy: true,
      hasSocialManagementV2: false,
    })

    it('should display basic items and Pennylane legacy', () => {
      const visibleItems = [
        'bi-reports',
        'pennylane-accounting-legacy',
      ]

      visibleItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(true)
      })
    })

    it('should hide legacy GED, Pennylane V2 and Social Management', () => {
      const hiddenItems = [
        'documents-legacy',
        'pennylane-accounting-v2',
        'social-management',
      ]

      hiddenItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with Social Management V2', () => {
    const context = createNavigationContext({
      shouldShowBIReports: true,
      hasGed: true,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: true,
    })

    it('should display basic items and Social Management', () => {
      const visibleItems = [
        'bi-reports',
        'social-management',
      ]

      visibleItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(true)
      })
    })

    it('should hide legacy GED and Pennylane items', () => {
      const hiddenItems = [
        'documents-legacy',
        'pennylane-accounting-v2',
        'pennylane-accounting-legacy',
      ]

      hiddenItems.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with no permissions', () => {
    const context = createNavigationContext({
      shouldShowBIReports: false,
      hasGed: false,
      hasPennylaneAccounting: false,
      hasSocialManagementV2: false,
    })

    it('should hide all basic items', () => {
      BASIC_ITEMS.forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })

    it('should hide all document items', () => {
      Object.values(DOCUMENT_ITEMS).forEach(itemKey => {
        const config = NavigationManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })
})
