import type { MenuContext, MenuItemConfig } from '../manager/sidebar.types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

/**
 * Factory to create a mock MenuContext with customizable overrides
 */
export function createMockContext(overrides?: Partial<MenuContext>): MenuContext {
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
    legacyGedPath: '/dossier/123/ged/legacy',
    permissions: {
      shouldShowBIReports: false,
      hasPennylaneAccounting: false,
      hasPennylaneAccountingGedV2: false,
      hasPennylaneAccountingGedLegacy: false,
      hasSocialManagementV2: false,
      hasGed: false,
      hasBank: false,
      hasIndicators: false,
      hasApps: false,
      hasUsers: false,
      hasCollaborators: false,
      hasOffer: false,
      hasInformation: false,
      hasHistory: false,
    },
  }

  return {
    ...defaultContext,
    ...overrides,
    permissions: {
      ...defaultContext.permissions,
      ...overrides?.permissions,
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

/**
 * Default mock MenuContext instance
 */
export const mockMenuContext = createMockContext()

/**
 * Default mock MenuItem instance
 */
export const mockMenuItem = createMockMenuItem()

/**
 * Constant with all permissions set to false
 */
export const NO_PERMISSIONS: MenuContext['permissions'] = {
  shouldShowBIReports: false,
  hasPennylaneAccounting: false,
  hasPennylaneAccountingGedV2: false,
  hasPennylaneAccountingGedLegacy: false,
  hasSocialManagementV2: false,
  hasGed: false,
  hasBank: false,
  hasIndicators: false,
  hasApps: false,
  hasUsers: false,
  hasCollaborators: false,
  hasOffer: false,
  hasInformation: false,
  hasHistory: false,
}

/**
 * Factory to create a mock MenuContext with specific permissions enabled
 * @param permissionsToEnable - Array of permission keys to set to true
 * @param overrides - Additional context overrides
 */
export function createContextWithPermissions(
  permissionsToEnable: Array<keyof MenuContext['permissions']>,
  overrides?: Partial<Omit<MenuContext, 'permissions'>>,
): MenuContext {
  const permissions = { ...NO_PERMISSIONS }
  permissionsToEnable.forEach(key => {
    permissions[key] = true
  })

  return createMockContext({
    ...overrides,
    permissions,
  })
}
