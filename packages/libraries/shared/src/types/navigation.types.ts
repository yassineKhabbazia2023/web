import type { IconName } from '@pulse/styleguide/types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { RouteName, PennylanePermission } from '@pulse/common/enums'
import type { Permission } from '@pulse/common/types'

/**
 * Represents a menu item configuration for registration
 */
export interface MenuItemConfig {
  id: string
  title: string // i18n key
  icon: IconName
  routeName: RouteName
  shouldDisplay: (context: MenuContext) => boolean
  order: number
  featureName?: string // For Amplitude tracking
  hasSubmenuSelected?: (context: MenuContext) => boolean
  showInMobile?: boolean // Whether to show in mobile bottom navigation
  activeRoutes?: RouteName[] // Routes that should mark this item as active
}

/**
 * Context information needed to evaluate menu items
 */
export interface MenuContext {
  entityId: number
  isCollab: boolean
  currentRoute: RouteLocationNormalizedLoaded
  /** Check if user has a specific permission (uses ACCOUNT_PERMISSIONS or GLOBAL_PERMISSIONS constants) */
  hasPermission: (permission: Permission[]) => boolean
  /** Check Pennylane-specific permissions */
  hasPennylanePermission: (type: PennylanePermission) => boolean
  /** Whether to show BI reports (async, pre-computed) */
  shouldShowBIReports: boolean
}

/**
 * Represents a resolved navigation item ready for display (desktop and mobile)
 */
export interface NavigationItem {
  routeName: RouteName
  title: string
  icon: IconName
  featureName?: string
  activeRoutes: RouteName[]
  hasSubmenuSelected?: boolean
  showInMobile?: boolean
}

