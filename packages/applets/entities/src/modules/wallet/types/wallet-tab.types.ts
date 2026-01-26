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
  order: number
  showInMobile?: boolean // Whether to show in mobile view
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
}
