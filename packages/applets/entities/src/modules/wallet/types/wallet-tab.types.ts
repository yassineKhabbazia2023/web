import type { RouteName, Feature } from '@pulse/common/enums'
import type { Permission } from '@pulse/common/types'
import type { WalletTab } from '../enums'

/**
 * Represents a wallet tab configuration for registration
 */
export interface WalletTabConfig {
  id: WalletTab
  title: string // i18n key (e.g., 'entities.wallet.folders')
  route: RouteName
  isDisplayed: (context: WalletContext) => boolean
  getCount?: () => number | string | undefined
  order: number
  // Whether to show in mobile view, resolved at display time so it can depend on
  // the context (permissions, feature flags). Omitted means hidden on mobile.
  showInMobile?: (context: WalletContext) => boolean
}

/**
 * Context information needed to evaluate wallet tabs
 */
export interface WalletContext {
  isCollab: boolean
  hasPermission: (permission: Permission[]) => boolean
  hasFeatureFlag: (flag: Feature) => boolean
}

/**
 * Represents a resolved wallet tab ready for display
 */
export interface WalletTabItem {
  name: WalletTab
  title: string // i18n key
  route: RouteName
  display: boolean
  showInMobile: boolean
  count?: number | string
}
