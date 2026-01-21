import { NavigationManager } from '@pulse/shared/managers'
import { RouteName, PennylanePermission } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'

/**
 * Register all navigation menu items for this app
 */
export function registerCustomerNavigationItems() {
  NavigationManager.register({
    id: 'bi-reports',
    title: 'shared.sidebar.biReports',
    icon: 'clipboardData',
    routeName: RouteName.REPORTS,
    shouldDisplay: (ctx) => ctx.shouldShowBIReports,
    showInMobile: false,
    order: 1,
  })

  NavigationManager.register({
    id: 'documents-legacy',
    title: 'shared.sidebar.documents',
    icon: 'folder',
    routeName: RouteName.GED,
    shouldDisplay: (ctx) =>
      ctx.hasPermission(ACCOUNT_PERMISSIONS.GED) &&
      !ctx.hasPennylanePermission(PennylanePermission.ACCOUNTING) &&
      !ctx.hasPennylanePermission(PennylanePermission.SOCIAL_V2),
    order: 2,
    showInMobile: true,
    activeRoutes: [
      RouteName.GED,
      RouteName.PENNYLANE_GED_V2,
      RouteName.PENNYLANE_GED_LEGACY,
      RouteName.PENNYLANE_SOCIAL_MANAGEMENT,
    ],
  })

  NavigationManager.register({
    id: 'pennylane-accounting-v2',
    title: 'shared.sidebar.pennylaneAccounting',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_GED_V2,
    shouldDisplay: (ctx) =>
      ctx.hasPennylanePermission(PennylanePermission.ACCOUNTING) &&
      ctx.hasPennylanePermission(PennylanePermission.GED_V2),
    hasSubmenuSelected: (ctx) => ctx.currentRoute.name === RouteName.PENNYLANE_GED_LEGACY,
    featureName: 'documents comptables',
    order: 3,
    showInMobile: true,
    activeRoutes: [RouteName.PENNYLANE_GED_V2, RouteName.PENNYLANE_GED_LEGACY],
  })

  NavigationManager.register({
    id: 'pennylane-accounting-legacy',
    title: 'shared.sidebar.pennylaneAccounting',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_GED_LEGACY,
    shouldDisplay: (ctx) =>
      ctx.hasPennylanePermission(PennylanePermission.ACCOUNTING) &&
      !ctx.hasPennylanePermission(PennylanePermission.GED_V2) &&
      ctx.hasPennylanePermission(PennylanePermission.GED_LEGACY),
    featureName: 'documents comptables',
    order: 4,
    showInMobile: true,
    activeRoutes: [RouteName.PENNYLANE_GED_LEGACY],
  })

  NavigationManager.register({
    id: 'social-management',
    title: 'shared.sidebar.pennylaneSocialManagement',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_SOCIAL_MANAGEMENT,
    shouldDisplay: (ctx) => ctx.hasPennylanePermission(PennylanePermission.SOCIAL_V2),
    featureName: 'documents gestion sociale',
    order: 5,
    showInMobile: false,
    activeRoutes: [RouteName.PENNYLANE_SOCIAL_MANAGEMENT],
  })

  NavigationManager.register({
    id: 'apps',
    title: 'shared.sidebar.apps',
    icon: 'grid',
    routeName: RouteName.LAUNCHER,
    shouldDisplay: (ctx) => ctx.hasPermission(ACCOUNT_PERMISSIONS.APPS),
    showInMobile: false,
    order: 8,
  })
}
