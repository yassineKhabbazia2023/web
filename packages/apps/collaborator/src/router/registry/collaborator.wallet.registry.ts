import { WalletManager, WalletCountManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName, Feature } from '@pulse/common/enums'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'

export function registerCollaboratorWalletTabs() {
  // On mobile the collaborator wallet exposes the folders tab, plus the prospects
  // tab when the prospect experience is enabled.
  WalletManager.register({
    id: WalletTab.FOLDERS,
    title: 'entities.wallet.folders',
    route: RouteName.FOLDERS,
    isDisplayed: () => true,
    getCount: () => WalletCountManager.getCount(WalletTab.FOLDERS),
    showInMobile: () => true,
    order: 1,
  })

  WalletManager.register({
    id: WalletTab.PROSPECTS,
    title: 'entities.wallet.prospects',
    route: RouteName.PROSPECTS,
    isDisplayed: (context) => context.hasFeatureFlag(Feature.PROSPECT_EXPERIENCE),
    getCount: () => WalletCountManager.getCount(WalletTab.PROSPECTS),
    // isDisplayed already gates this tab on the flag, it never reaches the mobile filter otherwise
    showInMobile: () => true,
    order: 2,
  })

  WalletManager.register({
    id: WalletTab.MANDATES,
    title: 'entities.wallet.mandate',
    route: RouteName.MANDATES,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.MANDATE),
    order: 3,
  })

  WalletManager.register({
    id: WalletTab.POWER_BI,
    title: 'entities.wallet.uploadPowerBIReport',
    route: RouteName.POWER_BI,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.POWERBI_REPORT_UPLOAD),
    order: 4,
  })

  WalletManager.register({
    id: WalletTab.BI_REPORTS_LIST,
    title: 'entities.wallet.biReportsList',
    route: RouteName.BI_REPORTS_LIST,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.POWERBI_REPORT_ADMIN),
    order: 5,
  })

  WalletManager.register({
    id: WalletTab.SUBSCRIPTIONS,
    title: 'entities.wallet.subscriptions',
    route: RouteName.SUBSCRIPTIONS,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.SUBSCRIPTIONS),
    order: 6,
  })

  WalletManager.register({
    id: WalletTab.COLLABORATORS,
    title: 'entities.wallet.collaborators',
    route: RouteName.COLLABORATORS,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.COLLABORATORS),
    order: 7,
  })

  WalletManager.register({
    id: WalletTab.WALLET_LAUNCHER,
    title: 'entities.wallet.launcher',
    route: RouteName.WALLET_LAUNCHER,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.LAUNCHER),
    order: 8,
  })

  WalletManager.register({
    id: WalletTab.ACCOUNT_MANAGEMENT,
    title: 'entities.wallet.accountManagement',
    route: RouteName.ACCOUNT_MANAGEMENT,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.ACCOUNT_MANAGEMENT),
    order: 9,
  })

  WalletManager.register({
    id: WalletTab.OFFERS_CATALOG,
    title: 'entities.wallet.offersCatalog',
    route: RouteName.OFFERS_CATALOG,
    isDisplayed: () => true,
    order: 10,
  })

  WalletManager.register({
    id: WalletTab.KEY_MOMENTS_SETTINGS,
    title: 'entities.wallet.keyMoments',
    route: RouteName.KEY_MOMENTS_SETTINGS,
    isDisplayed: (context) => context.hasFeatureFlag(Feature.KEY_MOMENTS)
      && context.hasPermission(GLOBAL_PERMISSIONS.KEY_MOMENTS_SETTINGS),
    order: 11,
  })
}
