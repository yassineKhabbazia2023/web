import { NavigationManager, PROSPECT_ENTITY_NAVIGATION_ITEMS, REGULAR_ENTITY_NAVIGATION_ITEMS } from '@pulse/shared/managers'
import { RouteName } from '@pulse/common/enums'
import type { NavigationItemConfig } from '@pulse/shared/types'

const MOBILE_ROUTE_NAMES = new Set([
  RouteName.HOMEPAGE,
  RouteName.ENTITY_OVERVIEW,
  RouteName.GED,
  RouteName.PENNYLANE_GED_V2,
  RouteName.PENNYLANE_GED_LEGACY,
])

const regularEntityNavigationItems: NavigationItemConfig[] = REGULAR_ENTITY_NAVIGATION_ITEMS.map(config => ({
  ...config,
  showInMobile: MOBILE_ROUTE_NAMES.has(config.routeName),
}))

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
export function registerCollaboratorNavigationItems() {
  registerRegularEntity()
  registerProspectEntity()
}
