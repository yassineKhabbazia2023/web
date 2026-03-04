import { RouteName, PennylanePermission, AccountType } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { RouterHelpers } from '@pulse/common/helpers'
import type { NavigationItemConfig } from '@shared/types'

export const REGULAR_ENTITY_NAVIGATION_ITEMS: NavigationItemConfig[] = [
  {
    id: 'regular-entity-home',
    title: () => 'shared.sidebar.home',
    icon: 'house',
    routeName: RouteName.HOMEPAGE,
    shouldDisplay: () => true,
    accountType: AccountType.REGULAR,
    order: 1,
    doNotTrack: true, // track is in onMounted of the homepage
  },
  {
    id: 'regular-entity-overview',
    title: (ctx) => ctx.isCollab ? 'shared.sidebar.folder' : 'shared.sidebar.entity',
    icon: 'building',
    routeName: RouteName.ENTITY_OVERVIEW,
    shouldDisplay: () => true,
    hasSubmenuSelected: (ctx) =>
      RouterHelpers.hasProvidedAncestor({ route: ctx.currentRoute, ancestorName: RouteName.ENTITY_OVERVIEW }),
    accountType: AccountType.REGULAR,
    order: 2,
    doNotTrack: true, // track is handled in each tabs
  },
  {
    id: 'regular-entity-bi-reports',
    title: () => 'shared.sidebar.biReports',
    icon: 'clipboardData',
    routeName: RouteName.REPORTS,
    shouldDisplay: (ctx) => ctx.shouldShowBIReports,
    accountType: AccountType.REGULAR,
    order: 3,
  },
  {
    id: 'regular-entity-documents-legacy',
    title: () => 'shared.sidebar.documents',
    icon: 'folder',
    routeName: RouteName.GED,
    shouldDisplay: (ctx) =>
      ctx.hasPermission(ACCOUNT_PERMISSIONS.GED) &&
      !ctx.hasPennylanePermission(PennylanePermission.ACCOUNTING) &&
      !ctx.hasPennylanePermission(PennylanePermission.SOCIAL_V2),
    accountType: AccountType.REGULAR,
    order: 4,
    activeRoutes: [
      RouteName.GED,
      RouteName.PENNYLANE_GED_V2,
      RouteName.PENNYLANE_GED_LEGACY,
      RouteName.PENNYLANE_SOCIAL_MANAGEMENT,
    ],
  },
  {
    id: 'regular-entity-pennylane-accounting-v2',
    title: () => 'shared.sidebar.pennylaneAccounting',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_GED_V2,
    shouldDisplay: (ctx) =>
      ctx.hasPennylanePermission(PennylanePermission.ACCOUNTING) &&
      ctx.hasPennylanePermission(PennylanePermission.GED_V2),
    hasSubmenuSelected: (ctx) => ctx.currentRoute.name === RouteName.PENNYLANE_GED_LEGACY,
    accountType: AccountType.REGULAR,
    featureName: 'documents comptables',
    order: 5,
    activeRoutes: [RouteName.PENNYLANE_GED_V2, RouteName.PENNYLANE_GED_LEGACY],
  },
  {
    id: 'regular-entity-pennylane-accounting-legacy',
    title: () => 'shared.sidebar.pennylaneAccounting',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_GED_LEGACY,
    shouldDisplay: (ctx) =>
      ctx.hasPennylanePermission(PennylanePermission.ACCOUNTING) &&
      !ctx.hasPennylanePermission(PennylanePermission.GED_V2) &&
      ctx.hasPennylanePermission(PennylanePermission.GED_LEGACY),
    accountType: AccountType.REGULAR,
    featureName: 'documents comptables',
    order: 6,
    activeRoutes: [RouteName.PENNYLANE_GED_LEGACY],
  },
  {
    id: 'regular-entity-social-management',
    title: () => 'shared.sidebar.pennylaneSocialManagement',
    icon: 'archive',
    routeName: RouteName.PENNYLANE_SOCIAL_MANAGEMENT,
    shouldDisplay: (ctx) => ctx.hasPennylanePermission(PennylanePermission.SOCIAL_V2),
    accountType: AccountType.REGULAR,
    featureName: 'documents gestion sociale',
    order: 7,
    activeRoutes: [RouteName.PENNYLANE_SOCIAL_MANAGEMENT],
  },
]
