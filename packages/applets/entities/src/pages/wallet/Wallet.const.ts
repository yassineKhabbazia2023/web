import { WalletTab } from './Wallet.enums'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import type { WalletTabConfiguration } from './Wallet.types'
import { Feature } from '@pulse/core/enums'
import { RouteName } from '@pulse/common/enums'

export const COLLAB_TABS_CONFIGURATION: WalletTabConfiguration[] = [{
  name: WalletTab.FOLDERS,
}, {
  name: WalletTab.FOLDER_MANDATES,
  permissionCodes: GLOBAL_PERMISSIONS.MANDATE,
}, {
  name: WalletTab.POWER_BI,
  permissionCodes: GLOBAL_PERMISSIONS.POWERBI_REPORT,
  featureFlag: Feature.LEGACY_BI_REPORT_DEPOSIT,
}, {
  name: WalletTab.BI_REPORTS_LIST,
  permissionCodes: GLOBAL_PERMISSIONS.POWERBI_REPORT,
}, {
  name: WalletTab.SUBSCRIPTIONS,
  permissionCodes: GLOBAL_PERMISSIONS.SUBSCRIPTIONS,
}, {
  name: WalletTab.COLLABORATORS,
  permissionCodes: GLOBAL_PERMISSIONS.COLLABORATORS,
}, {
  name: WalletTab.FOLDER_LAUNCHER,
  permissionCodes: GLOBAL_PERMISSIONS.LAUNCHER,
}, {
  name: WalletTab.ACCOUNT_MANAGEMENT,
  permissionCodes: GLOBAL_PERMISSIONS.ACCOUNT_MANAGEMENT,
}, {
  name: WalletTab.OFFERS_CATALOG,
}]

export const CUSTOMER_TABS_CONFIGURATION: WalletTabConfiguration[] = [{
  name: WalletTab.ENTITY_CLIENT,
}, {
  name: WalletTab.ALL_USERS,
  permissionCodes: GLOBAL_PERMISSIONS.USERS,
}]

export const WALLET_TAB_ROUTES: Record<WalletTab, RouteName> = {
  [WalletTab.ACCOUNT_MANAGEMENT]: RouteName.ACCOUNT_MANAGEMENT,
  [WalletTab.ALL_USERS]: RouteName.ALL_USERS,
  [WalletTab.BI_REPORTS_LIST]: RouteName.BI_REPORTS_LIST,
  [WalletTab.COLLABORATORS]: RouteName.COLLABORATORS,
  [WalletTab.ENTITY_CLIENT]: RouteName.ENTITY_CLIENT,
  [WalletTab.FOLDER_LAUNCHER]: RouteName.FOLDER_LAUNCHER,
  [WalletTab.FOLDER_MANDATES]: RouteName.FOLDER_MANDATES,
  [WalletTab.FOLDERS]: RouteName.FOLDERS,
  [WalletTab.OFFERS_CATALOG]: RouteName.OFFERS_CATALOG,
  [WalletTab.POWER_BI]: RouteName.POWER_BI,
  [WalletTab.SUBSCRIPTIONS]: RouteName.SUBSCRIPTIONS,
}
