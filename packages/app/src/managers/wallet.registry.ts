import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName, Feature } from '@pulse/common/enums'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'

/**
 * Register all wallet tabs for this app
 */
export function registerWalletTabs() {
  // Register wallet tabs - COLLAB tabs
  WalletManager.register({
    id: WalletTab.FOLDERS,
    title: 'entities.wallet.folders',
    route: RouteName.FOLDERS,
    isDisplayed: (context) => context.isCollab,
    order: 1,
  })

  WalletManager.register({
    id: WalletTab.FOLDER_MANDATES,
    title: 'entities.wallet.mandate',
    route: RouteName.FOLDER_MANDATES,
    isDisplayed: (context) => context.isCollab && context.hasPermission(GLOBAL_PERMISSIONS.MANDATE),
    order: 2,
  })

  WalletManager.register({
    id: WalletTab.POWER_BI,
    title: 'entities.wallet.uploadPowerBIReport',
    route: RouteName.POWER_BI,
    isDisplayed: (context) =>
      context.isCollab &&
      context.hasPermission(GLOBAL_PERMISSIONS.POWERBI_REPORT) &&
      context.hasFeatureFlag(Feature.LEGACY_BI_REPORT_DEPOSIT),
    order: 3,
  })

  WalletManager.register({
    id: WalletTab.BI_REPORTS_LIST,
    title: 'entities.wallet.biReportsList',
    route: RouteName.BI_REPORTS_LIST,
    isDisplayed: (context) => context.isCollab && context.hasPermission(GLOBAL_PERMISSIONS.POWERBI_REPORT),
    order: 4,
  })

  WalletManager.register({
    id: WalletTab.SUBSCRIPTIONS,
    title: 'entities.wallet.subscriptions',
    route: RouteName.SUBSCRIPTIONS,
    isDisplayed: (context) => context.isCollab && context.hasPermission(GLOBAL_PERMISSIONS.SUBSCRIPTIONS),
    order: 5,
  })

  WalletManager.register({
    id: WalletTab.COLLABORATORS,
    title: 'entities.wallet.collaborators',
    route: RouteName.COLLABORATORS,
    isDisplayed: (context) => context.isCollab && context.hasPermission(GLOBAL_PERMISSIONS.COLLABORATORS),
    order: 6,
  })

  WalletManager.register({
    id: WalletTab.FOLDER_LAUNCHER,
    title: 'entities.wallet.launcher',
    route: RouteName.FOLDER_LAUNCHER,
    isDisplayed: (context) => context.isCollab && context.hasPermission(GLOBAL_PERMISSIONS.LAUNCHER),
    order: 7,
  })

  WalletManager.register({
    id: WalletTab.ACCOUNT_MANAGEMENT,
    title: 'entities.wallet.accountManagement',
    route: RouteName.ACCOUNT_MANAGEMENT,
    isDisplayed: (context) => context.isCollab && context.hasPermission(GLOBAL_PERMISSIONS.ACCOUNT_MANAGEMENT),
    order: 8,
  })

  WalletManager.register({
    id: WalletTab.OFFERS_CATALOG,
    title: 'entities.wallet.offersCatalog',
    route: RouteName.OFFERS_CATALOG,
    isDisplayed: (context) => context.isCollab,
    order: 9,
  })

  // Register wallet tabs - CUSTOMER tabs
  WalletManager.register({
    id: WalletTab.ENTITY_CLIENT,
    title: 'entities.wallet.allEntities',
    route: RouteName.ENTITY_CLIENT,
    isDisplayed: (context) => !context.isCollab,
    order: 10,
  })

  WalletManager.register({
    id: WalletTab.ALL_USERS,
    title: 'entities.wallet.allUsers',
    route: RouteName.ALL_USERS,
    isDisplayed: (context) => !context.isCollab && context.hasPermission(GLOBAL_PERMISSIONS.USERS),
    order: 11,
  })
}
