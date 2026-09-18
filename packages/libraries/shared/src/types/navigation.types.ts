import type { IconName } from '@pulse/styleguide/types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { RouteName, PennylanePermission, AccountType } from '@pulse/common/enums'
import type { Permission } from '@pulse/common/types'

/**
 * Represents a navigation item configuration for registration
 */
export interface NavigationItemConfig {
  id: string
  accountType: AccountType
  title: (context: NavigationContext) => string
  icon: IconName
  routeName: RouteName
  shouldDisplay: (context: NavigationContext) => boolean
  order: number
  featureName?: string // For Amplitude tracking
  hasSubmenuSelected?: (context: NavigationContext) => boolean
  showInMobile?: boolean // Whether to show in mobile bottom navigation
  activeRoutes?: RouteName[] // Routes that should mark this item as active
  doNotTrack?: boolean // Whether to skip Amplitude tracking for this item
}

/**
 * Context information needed to evaluate navigation items
 */
export interface NavigationContext {
  entityId: number
  isCollab: boolean
  currentRoute: RouteLocationNormalizedLoaded
  /** Check if user has a specific permission (uses ACCOUNT_PERMISSIONS or GLOBAL_PERMISSIONS constants) */
  hasPermission: (permission: Permission[]) => boolean
  /** Check Pennylane-specific permissions */
  hasPennylanePermission: (type: PennylanePermission) => boolean
  /** Whether to show BI reports (async, pre-computed) */
  shouldShowBIReports: boolean
  /**
   * Whether the key moments entry belongs in the navigation (async,
   * pre-computed). More than the flag for a customer: the entry only appears
   * once the account has a published key moment to read.
   */
  shouldShowKeyMoments: boolean
  /** Whether to show the Rydge invoices tab for the current entity */
  shouldShowRydgeInvoicesTab: boolean
  /** Whether the Seres invoices feature is enabled and granted for the current entity */
  shouldShowSeresInvoices: boolean
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
  doNotTrack?: boolean
}

