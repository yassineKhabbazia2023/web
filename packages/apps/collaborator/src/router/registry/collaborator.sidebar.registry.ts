import { SidebarManager } from '@pulse/shared/manager'
import { RouteName } from '@pulse/common/enums'

export function registerCollaboratorSidebarItems() {
  SidebarManager.register({
    id: 'bi-reports',
    title: 'shared.sidebar.biReports',
    icon: 'clipboardData',
    routeName: RouteName.REPORTS,
    shouldDisplay: (ctx) => ctx.permissions.shouldShowBIReports,
    order: 1,
  })

  SidebarManager.register({
    id: 'documents-legacy',
    title: 'shared.sidebar.documents',
    icon: 'folder',
    routeName: RouteName.GED,
    shouldDisplay: (ctx) =>
      ctx.permissions.hasGed &&
      !ctx.permissions.hasPennylaneAccounting &&
      !ctx.permissions.hasSocialManagementV2,
    order: 2,
  })

  SidebarManager.register({
    id: 'pennylane-accounting-v2',
    title: 'shared.sidebar.pennylaneAccounting',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_GED_V2,
    shouldDisplay: (ctx) =>
      ctx.permissions.hasPennylaneAccounting &&
      ctx.permissions.hasPennylaneAccountingGedV2,
    hasSubmenuSelected: (ctx) => ctx.currentRoute.path === ctx.legacyGedPath,
    featureName: 'documents comptables',
    order: 3,
  })

  SidebarManager.register({
    id: 'pennylane-accounting-legacy',
    title: 'shared.sidebar.pennylaneAccounting',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_GED_LEGACY,
    shouldDisplay: (ctx) =>
      ctx.permissions.hasPennylaneAccounting &&
      !ctx.permissions.hasPennylaneAccountingGedV2 &&
      ctx.permissions.hasPennylaneAccountingGedLegacy,
    featureName: 'documents comptables',
    order: 4,
  })

  SidebarManager.register({
    id: 'social-management',
    title: 'shared.sidebar.pennylaneSocialManagement',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_SOCIAL_MANAGEMENT,
    shouldDisplay: (ctx) => ctx.permissions.hasSocialManagementV2,
    featureName: 'documents gestion sociale',
    order: 5,
  })
}
