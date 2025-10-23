import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import widgetsLibrary from '@pulse/widgets'
import { SidebarManager } from '@pulse/shared/manager'
import { i18n } from '@pulse/common/i18n'
import { RouteName, Feature } from '@pulse/common/enums'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { WalletManager } from './modules/wallet/manager'
import { WalletTab } from './modules/wallet/enums'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

import { entityRoutes } from './router/entity.routes'
import { walletRoutes } from './router/wallet.routes'

export default {
  install(app: App, options: any) {
    const { router } = options

    // Add entity routes to the entity section
    RoutesManager.addRoutesToEntity(router, entityRoutes)
    // Add wallet routes directly to the authenticated section
    RoutesManager.addRoutesToAuthenticated(router, walletRoutes)
    // install widgets
    app.use(widgetsLibrary, {})

    // Register i18n translations
    i18n.global.mergeLocaleMessage('fr-FR', frFR)
    i18n.global.mergeLocaleMessage('en-US', enUS)

    // Register sidebar menu items
    SidebarManager.register({
      id: 'bank',
      title: 'shared.sidebar.bank',
      icon: 'piggyBank',
      route: (entityId) => `/dossier/${entityId}/banque`,
      shouldDisplay: (ctx) => ctx.permissions.hasBank,
      order: 6,
    })

    SidebarManager.register({
      id: 'indicators',
      title: 'shared.sidebar.indicators',
      icon: 'speedometer2',
      route: (entityId) => `/dossier/${entityId}/indicateurs`,
      shouldDisplay: (ctx) => ctx.permissions.hasIndicators,
      order: 7,
    })

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
  },
}
