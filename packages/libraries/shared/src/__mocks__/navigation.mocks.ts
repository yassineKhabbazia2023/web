import type { NavigationContext, NavigationItemConfig } from '../types/navigation.types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { AccountType, PennylanePermission } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
/**
 * Factory to create a mock NavigationContext with customizable overrides
 */
export function createMockNavigationContext(overrides?: Partial<NavigationContext>): NavigationContext {
  const defaultContext: NavigationContext = {
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
 * Factory to create a mock NavigationContext with boolean permission flags
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
}): NavigationContext {
  return {
    entityId: 601,
    isCollab: false,
    currentRoute: {
      path: '/',
      fullPath: '/',
      name: 'homepage',
      params: {},
      query: {},
      hash: '',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    } as RouteLocationNormalizedLoaded,
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
        default: return false
      }
    },
  }
}

/**
 * Factory to create a mock NavigationItemConfig with customizable overrides
 */
export function createMockNavigationItemConfig(overrides?: Partial<NavigationItemConfig>): NavigationItemConfig {
  const defaultItem: NavigationItemConfig = {
    id: 'test-item',
    accountType: AccountType.REGULAR,
    title: () => 'shared.sidebar.testItem',
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
