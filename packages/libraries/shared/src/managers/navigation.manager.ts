import { RouteName } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import type { MenuItemConfig, MenuContext, NavigationItem } from '@shared/types/navigation.types'

/**
 * Single source of truth for entity overview subpages
 * Each entry defines: route, permission check, and whether it's collab-only
 */
const ENTITY_OVERVIEW_CONFIG = [
  {
    routeName: RouteName.USERS,
    hasAccess: (ctx: MenuContext) => ctx.hasPermission(ACCOUNT_PERMISSIONS.USERS),
  },
  {
    routeName: RouteName.COLLAB,
    hasAccess: (ctx: MenuContext) => ctx.isCollab && ctx.hasPermission(ACCOUNT_PERMISSIONS.COLLABORATORS),
  },
  {
    routeName: RouteName.OFFERS,
    hasAccess: (ctx: MenuContext) => ctx.hasPermission(ACCOUNT_PERMISSIONS.OFFER),
  },
  {
    routeName: RouteName.INFO,
    hasAccess: (ctx: MenuContext) => ctx.hasPermission(ACCOUNT_PERMISSIONS.INFORMATION),
  },
  {
    routeName: RouteName.DELEGATIONS_HISTORY,
    hasAccess: (ctx: MenuContext) => ctx.isCollab && ctx.hasPermission(GLOBAL_PERMISSIONS.HISTORY),
  },
] as const

// Derived from the config - single source of truth
const ENTITY_OVERVIEW_ACTIVE_ROUTES = ENTITY_OVERVIEW_CONFIG.map(c => c.routeName)

/**
 * Manages sidebar menu items registration and retrieval
 */
export class NavigationManager {
  private static readonly menuItems = new Map<string, MenuItemConfig>()

  /**
   * Register a new menu item configuration
   */
  static register(config: MenuItemConfig): void {
    this.menuItems.set(config.id, config)
  }

  /**
   * Get a specific menu item configuration by id
   */
  static getMenuItem(id: string): MenuItemConfig | undefined {
    return this.menuItems.get(id)
  }

  /**
   * Get all menu items for the current context, filtered and sorted
   */
  static getMenuItems(context: MenuContext): NavigationItem[] {
    return Array.from(this.menuItems.values())
      .filter(item => item.shouldDisplay(context))
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        routeName: item.routeName,
        title: item.title,
        icon: item.icon,
        featureName: item.featureName,
        activeRoutes: item.activeRoutes ?? [item.routeName],
        hasSubmenuSelected: item.hasSubmenuSelected?.(context),
        showInMobile: item.showInMobile ?? false,
      }))
  }

  /**
   * Get the folder or entity menu item based on context
   * If the user does not have access to the first available submenu, returns the second and so on
   */
  static getEntityOverviewMenuItem(context: MenuContext): NavigationItem | null {
    const title = context.isCollab ? 'shared.sidebar.folder' : 'shared.sidebar.entity'

    const firstAvailable = ENTITY_OVERVIEW_CONFIG.find(item => item.hasAccess(context))

    if (firstAvailable === undefined) {
      return null
    }

    return {
      routeName: firstAvailable.routeName,
      title,
      icon: 'building',
      activeRoutes: ENTITY_OVERVIEW_ACTIVE_ROUTES,
    }
  }

  /**
   * Get all routes that should mark the entity navigation item as active
   */
  static getEntityOverviewActiveRoutes(): RouteName[] {
    return ENTITY_OVERVIEW_ACTIVE_ROUTES
  }

  /**
   * Clears all registered menu items.
   */
  static resetMenuItems(): void {
    this.menuItems.clear()
  }
}
