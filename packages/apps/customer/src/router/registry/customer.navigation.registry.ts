import { NavigationManager, PROSPECT_ENTITY_NAVIGATION_ITEMS, REGULAR_ENTITY_NAVIGATION_ITEMS } from '@pulse/shared/managers'
import { RouteName, AccountType } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import type { NavigationItemConfig } from '@pulse/shared/types'

const MOBILE_ROUTE_NAMES = new Set([
  RouteName.HOMEPAGE,
  RouteName.ENTITY_OVERVIEW,
  RouteName.GED,
  RouteName.PENNYLANE_GED_V2,
  RouteName.PENNYLANE_GED_LEGACY,
])

const regularEntityNavigationItems: NavigationItemConfig[] = [
  ...REGULAR_ENTITY_NAVIGATION_ITEMS.map(config => ({
    ...config,
    showInMobile: MOBILE_ROUTE_NAMES.has(config.routeName),
  })),
  {
    id: 'regular-entity-apps',
    title: () => 'shared.sidebar.apps',
    icon: 'grid',
    routeName: RouteName.LAUNCHER,
    shouldDisplay: (ctx) => ctx.hasPermission(ACCOUNT_PERMISSIONS.APPS),
    showInMobile: false,
    order: 8,
    accountType: AccountType.REGULAR,
  },
]

function registerRegularEntity() {
  regularEntityNavigationItems.forEach(config => NavigationManager.register(config))
}

const prospectEntityNavigationItems: NavigationItemConfig[] = PROSPECT_ENTITY_NAVIGATION_ITEMS.map(config => ({
  ...config,
  showInMobile: true,
}))

function registerProspectEntity() {
  prospectEntityNavigationItems.forEach(config => NavigationManager.register(config))
}

/**
 * Register all navigation menu items for this app
 */
export function registerCustomerNavigationItems() {
  registerRegularEntity()
  registerProspectEntity()
}
