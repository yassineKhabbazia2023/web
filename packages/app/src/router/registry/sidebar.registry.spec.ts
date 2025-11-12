import { SidebarManager } from '@pulse/shared/manager'
import { RouteName } from '@pulse/common/enums'
import { registerSidebarItems } from './sidebar.registry'

// Items that are always available when user has the basic permission
const BASIC_ITEMS = [
  'bi-reports',
  'bank',
  'indicators',
]

// Document management items (mutually exclusive based on configuration)
const DOCUMENT_ITEMS = {
  LEGACY_GED: 'documents-legacy',
  PENNYLANE_V2: 'pennylane-accounting-v2',
  PENNYLANE_LEGACY: 'pennylane-accounting-legacy',
  SOCIAL_MANAGEMENT: 'social-management',
}

describe('registerSidebarItems', () => {
  beforeEach(() => {
    // @ts-expect-error - Accessing private static field for test cleanup
    SidebarManager.menuItems.clear()
    registerSidebarItems()
  })

  it('should add eight sidebar items', () => {
    // @ts-expect-error - Accessing private static field for test
    expect(SidebarManager.menuItems.size).toBe(8)
  })

  it.each([
    { itemKey: 'bi-reports', expectedRouteName: RouteName.REPORTS },
    { itemKey: 'documents-legacy', expectedRouteName: RouteName.GED },
    { itemKey: 'pennylane-accounting-v2', expectedRouteName: RouteName.PENNYLANE_GED_V2 },
    { itemKey: 'pennylane-accounting-legacy', expectedRouteName: RouteName.PENNYLANE_GED_LEGACY },
    { itemKey: 'social-management', expectedRouteName: RouteName.PENNYLANE_SOCIAL_MANAGEMENT },
    { itemKey: 'bank', expectedRouteName: RouteName.BANK },
    { itemKey: 'indicators', expectedRouteName: RouteName.INDICATORS },
    { itemKey: 'apps', expectedRouteName: RouteName.LAUNCHER },
  ])('should register $itemKey sidebar item with correct routeName', ({ itemKey, expectedRouteName }) => {
    const config = SidebarManager.getMenuItem(itemKey)

    expect(config?.routeName).toBe(expectedRouteName)
  })

  describe('shouldDisplay behavior - User with legacy GED only', () => {
    const context = {
      permissions: {
        shouldShowBIReports: true,
        hasGed: true,
        hasPennylaneAccounting: false,
        hasSocialManagementV2: false,
        hasBank: true,
        hasIndicators: true,
      },
    }

    it('should display basic items and legacy GED', () => {
      const visibleItems = [
        'bi-reports',
        'documents-legacy',
        'bank',
        'indicators',
      ]

      visibleItems.forEach(itemKey => {
        const config = SidebarManager.getMenuItem(itemKey)
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
        const config = SidebarManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with Pennylane V2', () => {
    const context = {
      permissions: {
        shouldShowBIReports: true,
        hasGed: true,
        hasPennylaneAccounting: true,
        hasPennylaneAccountingGedV2: true,
        hasSocialManagementV2: false,
        hasBank: true,
        hasIndicators: true,
      },
    }

    it('should display basic items and Pennylane V2', () => {
      const visibleItems = [
        'bi-reports',
        'pennylane-accounting-v2',
        'bank',
        'indicators',
      ]

      visibleItems.forEach(itemKey => {
        const config = SidebarManager.getMenuItem(itemKey)
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
        const config = SidebarManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with Pennylane legacy', () => {
    const context = {
      permissions: {
        shouldShowBIReports: true,
        hasGed: true,
        hasPennylaneAccounting: true,
        hasPennylaneAccountingGedV2: false,
        hasPennylaneAccountingGedLegacy: true,
        hasSocialManagementV2: false,
        hasBank: true,
        hasIndicators: true,
      },
    }

    it('should display basic items and Pennylane legacy', () => {
      const visibleItems = [
        'bi-reports',
        'pennylane-accounting-legacy',
        'bank',
        'indicators',
      ]

      visibleItems.forEach(itemKey => {
        const config = SidebarManager.getMenuItem(itemKey)
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
        const config = SidebarManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with Social Management V2', () => {
    const context = {
      permissions: {
        shouldShowBIReports: true,
        hasGed: true,
        hasPennylaneAccounting: false,
        hasSocialManagementV2: true,
        hasBank: true,
        hasIndicators: true,
      },
    }

    it('should display basic items and Social Management', () => {
      const visibleItems = [
        'bi-reports',
        'social-management',
        'bank',
        'indicators',
      ]

      visibleItems.forEach(itemKey => {
        const config = SidebarManager.getMenuItem(itemKey)
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
        const config = SidebarManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - User with no permissions', () => {
    const context = {
      permissions: {
        shouldShowBIReports: false,
        hasGed: false,
        hasPennylaneAccounting: false,
        hasSocialManagementV2: false,
        hasBank: false,
        hasIndicators: false,
      },
    }

    it('should hide all basic items', () => {
      BASIC_ITEMS.forEach(itemKey => {
        const config = SidebarManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })

    it('should hide all document items', () => {
      Object.values(DOCUMENT_ITEMS).forEach(itemKey => {
        const config = SidebarManager.getMenuItem(itemKey)
        expect(config?.shouldDisplay(context as any)).toBe(false)
      })
    })
  })

  describe('shouldDisplay behavior - Customer vs Collaborator', () => {
    it('should display apps for customer with permission', () => {
      const context = {
        isCollab: false,
        permissions: {
          hasApps: true,
        },
      }

      const config = SidebarManager.getMenuItem('apps')
      expect(config?.shouldDisplay(context as any)).toBe(true)
    })

    it('should hide apps for collaborator even with permission', () => {
      const context = {
        isCollab: true,
        permissions: {
          hasApps: true,
        },
      }

      const config = SidebarManager.getMenuItem('apps')
      expect(config?.shouldDisplay(context as any)).toBe(false)
    })

    it('should hide apps for customer without permission', () => {
      const context = {
        isCollab: false,
        permissions: {
          hasApps: false,
        },
      }

      const config = SidebarManager.getMenuItem('apps')
      expect(config?.shouldDisplay(context as any)).toBe(false)
    })
  })
})
