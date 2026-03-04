import { NavigationManager, PROSPECT_ENTITY_NAVIGATION_ITEMS, REGULAR_ENTITY_NAVIGATION_ITEMS } from '@pulse/shared/managers'

function registerRegularEntity() {
  REGULAR_ENTITY_NAVIGATION_ITEMS
    .forEach(config => NavigationManager.register(config))
}

function registerProspectEntity() {
  PROSPECT_ENTITY_NAVIGATION_ITEMS
    .forEach(config => NavigationManager.register(config))
}

/**
 * Register all navigation menu items for this app
 */
export function registerCollaboratorNavigationItems() {
  registerRegularEntity()
  registerProspectEntity()
}
