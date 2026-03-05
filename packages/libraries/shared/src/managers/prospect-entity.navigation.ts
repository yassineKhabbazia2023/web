import { RouteName, AccountType, AmplitudeFeatureName } from '@pulse/common/enums'
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
    id: 'prospect-entity-stepper',
    title: () => 'shared.sidebar.stepper',
    icon: 'checklist',
    routeName: RouteName.PROSPECT_STEPPER,
    shouldDisplay: () => true,
    accountType: AccountType.PROSPECT,
    order: 2,
  },
]
