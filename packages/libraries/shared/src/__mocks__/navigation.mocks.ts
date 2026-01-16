import type { MenuContext, MenuItemConfig } from '../types/navigation.types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { PennylanePermission } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import type { Permission } from '@pulse/common/types'

/**
 * Factory to create a mock MenuContext with customizable overrides
 */
export function createMockMenuContext(overrides?: Partial<MenuContext>): MenuContext {
  const defaultContext: MenuContext = {
    entityId: 123,
    isCollab: false,
    currentRoute: {
      path: '/dossier/123',
      fullPath: '/dossier/123',
      name: 'homepage',
      params: { entityId: '123' },
      query: {},
      hash: '',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    } as RouteLocationNormalizedLoaded,
    hasPermission: () => false,
    hasPennylanePermission: () => false,
    shouldShowBIReports: false,
  }

  return {
    ...defaultContext,
    ...overrides,
  }
}

/**
 * Factory to create a mock MenuContext with customizable permission functions
 */
export function createMockMenuContextWithPermissions(options: {
  entityId?: number
  isCollab?: boolean
  hasPermission?: (permission: Permission[]) => boolean
  hasPennylanePermission?: (type: PennylanePermission) => boolean
  shouldShowBIReports?: boolean
}): MenuContext {
  return createMockMenuContext({
    entityId: options.entityId,
    isCollab: options.isCollab,
    hasPermission: options.hasPermission ?? (() => false),
    hasPennylanePermission: options.hasPennylanePermission ?? (() => false),
    shouldShowBIReports: options.shouldShowBIReports ?? false,
  })
}

/**
 * Factory to create a mock MenuContext with boolean permission flags
 * Useful for navigation registry tests
 */
export function createNavigationContext(options: {
  shouldShowBIReports?: boolean
  hasGed?: boolean
  hasPennylaneAccounting?: boolean
  hasPennylaneAccountingGedV2?: boolean
  hasPennylaneAccountingGedLegacy?: boolean
  hasSocialManagementV2?: boolean
  hasApps?: boolean
}): Partial<MenuContext> {
  return {
    shouldShowBIReports: options.shouldShowBIReports ?? false,
    hasPermission: (permission) => {
      if (permission === ACCOUNT_PERMISSIONS.GED) {
        return options.hasGed ?? false
      }
      if (permission === ACCOUNT_PERMISSIONS.APPS) {
        return options.hasApps ?? false
      }
      return false
    },
    hasPennylanePermission: (type: PennylanePermission) => {
      switch (type) {
        case PennylanePermission.ACCOUNTING: return options.hasPennylaneAccounting ?? false
        case PennylanePermission.GED_V2: return options.hasPennylaneAccountingGedV2 ?? false
        case PennylanePermission.GED_LEGACY: return options.hasPennylaneAccountingGedLegacy ?? false
        case PennylanePermission.SOCIAL_V2: return options.hasSocialManagementV2 ?? false
      }
    },
  }
}

/**
 * Factory to create a mock MenuItemConfig with customizable overrides
 */
export function createMockMenuItem(overrides?: Partial<MenuItemConfig>): MenuItemConfig {
  const defaultItem: MenuItemConfig = {
    id: 'test-item',
    title: 'shared.sidebar.testItem',
    icon: 'house',
    routeName: 'homepage' as any, // Default test route name
    shouldDisplay: () => true,
    order: 1,
  }

  return {
    ...defaultItem,
    ...overrides,
  }
}
