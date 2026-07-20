import { RouteName, AccountType, AmplitudeFeatureName } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS, ACTION_PERMISSIONS } from '@pulse/common/constants'
import { RouterHelpers } from '@pulse/common/helpers'
import type { NavigationContext, NavigationItemConfig } from '@shared/types'

const PROSPECT_ENTITY_OVERVIEW_CUSTOMER_PERMISSIONS = [
  ACCOUNT_PERMISSIONS.USERS,
  ACTION_PERMISSIONS.ADD_USERS,
  ACTION_PERMISSIONS.DELETE_USER,
  ACTION_PERMISSIONS.MODIFY_RIGHTS_USER,
  ACCOUNT_PERMISSIONS.INFORMATION,
]

function canDisplayProspectEntityOverview(ctx: NavigationContext): boolean {
  if (ctx.isCollab) {
    return true
  }

  return PROSPECT_ENTITY_OVERVIEW_CUSTOMER_PERMISSIONS.some(permission => ctx.hasPermission(permission))
}

export const PROSPECT_ENTITY_NAVIGATION_ITEMS: NavigationItemConfig[] = [
  {
    id: 'prospect-entity-home',
    title: () => 'shared.sidebar.home',
    icon: 'house',
    routeName: RouteName.PROSPECT_HOMEPAGE,
    shouldDisplay: () => true,
    accountType: AccountType.PROSPECT,
    order: 1,
    featureName: AmplitudeFeatureName.HOMEPAGE,
  },
  {
    id: 'prospect-entity-overview',
    title: (ctx) => ctx.isCollab === true ? 'shared.sidebar.folder' : 'shared.sidebar.entity',
    icon: 'building',
    routeName: RouteName.PROSPECT_OVERVIEW,
    shouldDisplay: canDisplayProspectEntityOverview,
    hasSubmenuSelected: (ctx) =>
      RouterHelpers.hasProvidedAncestor({ route: ctx.currentRoute, ancestorName: RouteName.PROSPECT_OVERVIEW }),
    accountType: AccountType.PROSPECT,
    order: 2,
    doNotTrack: true,
  },
  {
    id: 'prospect-entity-conformity',
    title: () => 'shared.sidebar.conformity',
    icon: 'checklist',
    routeName: RouteName.PROSPECT_CONFORMITY,
    shouldDisplay: () => true,
    accountType: AccountType.PROSPECT,
    order: 3,
  },
  {
    id: 'prospect-entity-documents',
    title: () => 'shared.sidebar.documents',
    icon: 'archive',
    routeName: RouteName.PROSPECT_DOCUMENTS,
    shouldDisplay: (ctx) => ctx.isCollab === true || ctx.hasPermission(ACCOUNT_PERMISSIONS.PROSPECT_DOCUMENTS),
    accountType: AccountType.PROSPECT,
    order: 4,
  },
]
