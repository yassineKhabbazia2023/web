import type { IconName } from '@pulse/styleguide/types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

/**
 * Represents a menu item configuration for registration
 */
export interface MenuItemConfig {
  id: string
  title: string // i18n key
  icon: IconName
  route: (entityId: number, context: MenuContext) => string
  shouldDisplay: (context: MenuContext) => boolean
  order: number
  featureName?: string // For Amplitude tracking
  hasSubmenuSelected?: (context: MenuContext) => boolean
}

/**
 * Context information needed to evaluate menu items
 */
export interface MenuContext {
  entityId: number
  isCollab: boolean
  currentRoute: RouteLocationNormalizedLoaded
  legacyGedPath: string // Path resolved from router for legacy GED route
  permissions: {
    shouldShowBIReports: boolean
    hasPennylaneAccounting: boolean
    hasPennylaneAccountingGedV2: boolean
    hasPennylaneAccountingGedLegacy: boolean
    hasSocialManagementV2: boolean
    hasGed: boolean
    hasBank: boolean
    hasIndicators: boolean
    hasApps: boolean
    hasUsers: boolean
    hasCollaborators: boolean
    hasOffer: boolean
    hasInformation: boolean
    hasHistory: boolean
  }
}

/**
 * Represents a resolved menu item ready for display
 */
export interface MenuItem {
  routePath: string
  title: string
  featureName?: string
  display: boolean
  iconLeftName?: IconName
  hasSubmenuSelected?: boolean
}
