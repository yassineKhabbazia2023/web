import { RouteName, AccountType, AmplitudeFeatureName } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import type { NavigationItemConfig } from '@shared/types'

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
    shouldDisplay: () => true,
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
]
