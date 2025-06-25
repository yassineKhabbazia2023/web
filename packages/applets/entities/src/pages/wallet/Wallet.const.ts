import { WalletTab } from './Wallet.enums'
import { PERMISSION_GLOBAL } from '@pulse/common/constants'
import type { WalletTabConfiguration } from './Wallet.types'
import { Feature } from '@pulse/core/enums'
import { RouteName } from '@pulse/common/enums'

export const COLLAB_TABS_CONFIGURATION: WalletTabConfiguration[] = [{
  name: WalletTab.FOLDERS,
}, {
  name: WalletTab.FOLDER_MANDATES,
  permissionCode: PERMISSION_GLOBAL.MANDATE,
}, {
  name: WalletTab.POWER_BI,
  permissionCode: PERMISSION_GLOBAL.POWERBI_REPORT,
}, {
  name: WalletTab.BI_REPORTS_LIST,
  permissionCode: PERMISSION_GLOBAL.POWERBI_REPORT,
}, {
  name: WalletTab.SUBSCRIPTIONS,
  permissionCode: PERMISSION_GLOBAL.SUBSCRIPTIONS,
}, {
  name: WalletTab.COLLABORATORS,
  permissionCode: PERMISSION_GLOBAL.COLLABORATORS,
}, {
  name: WalletTab.FOLDER_LAUNCHER,
  permissionCode: PERMISSION_GLOBAL.LAUNCHER,
}, {
  name: WalletTab.ACCOUNT_MANAGEMENT,
  permissionCode: PERMISSION_GLOBAL.ACCOUNT_MANAGEMENT,
}, {
  name: WalletTab.OFFERS_CATALOG,
  featureFlag: Feature.COLLAB_OFFERS_CATALOG,
}]

export const CUSTOMER_TABS_CONFIGURATION: WalletTabConfiguration[] = [{
  name: WalletTab.ENTITY_CLIENT,
}, {
  name: WalletTab.ALL_USERS,
  permissionCode: PERMISSION_GLOBAL.USERS,
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
