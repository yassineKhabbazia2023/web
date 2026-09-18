import { RouteName, PennylanePermission, AccountType, AmplitudeFeatureName } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { RouterHelpers } from '@pulse/common/helpers'
import type { NavigationContext, NavigationItemConfig } from '@shared/types'

const REGULAR_ENTITY_OVERVIEW_CUSTOMER_PERMISSIONS = [
  ACCOUNT_PERMISSIONS.USERS,
  ACCOUNT_PERMISSIONS.OFFER,
  ACCOUNT_PERMISSIONS.INFORMATION,
]

function canDisplayRegularEntityOverview(ctx: NavigationContext): boolean {
  if (ctx.isCollab) {
    return true
  }

  return REGULAR_ENTITY_OVERVIEW_CUSTOMER_PERMISSIONS.some(permission => ctx.hasPermission(permission)) ||
    ctx.shouldShowRydgeInvoicesTab
}

export const REGULAR_ENTITY_NAVIGATION_ITEMS: NavigationItemConfig[] = [
  {
    id: 'regular-entity-home',
    title: () => 'shared.sidebar.home',
    icon: 'house',
    routeName: RouteName.HOMEPAGE,
    shouldDisplay: () => true,
    accountType: AccountType.REGULAR,
    order: 1,
    featureName: AmplitudeFeatureName.HOMEPAGE,
  },
  {
    id: 'regular-entity-overview',
    title: (ctx) => ctx.isCollab ? 'shared.sidebar.folder' : 'shared.sidebar.entity',
    icon: 'building',
    routeName: RouteName.ENTITY_OVERVIEW,
    shouldDisplay: canDisplayRegularEntityOverview,
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
  {
    id: 'regular-entity-seres-invoices',
    title: () => 'shared.sidebar.seresInvoices',
    icon: 'filetypeNone',
    routeName: RouteName.SERES_INVOICES,
    shouldDisplay: (ctx) => ctx.shouldShowSeresInvoices,
    accountType: AccountType.REGULAR,
    featureName: 'factures rydge',
    order: 8,
    activeRoutes: [RouteName.SERES_INVOICES],
  },
  {
    /**
     * Read by both surfaces, which are two different pages under one route
     * name: the firm arbitrates a key moment, the customer reads the one it
     * published. Hence the asymmetry `KeyMomentsManager.canShowKeyMoments`
     * arbitrates: the firm gets the entry as soon as the domain is switched on,
     * the customer only once its account has something published — an entry
     * leading to an empty screen would take a call to understand.
     */
    id: 'regular-entity-key-moments',
    title: () => 'shared.sidebar.keyMoments',
    icon: 'flag',
    routeName: RouteName.KEY_MOMENTS,
    shouldDisplay: (ctx) => ctx.shouldShowKeyMoments,
    accountType: AccountType.REGULAR,
    order: 9,
    // the mirror view the collaborator reads the client page through is the same
    // entry: leaving it out would drop the highlight while the reader is still
    // inside the key moment of the dossier
    activeRoutes: [RouteName.KEY_MOMENTS, RouteName.KEY_MOMENTS_PREVIEW],
  },
]
