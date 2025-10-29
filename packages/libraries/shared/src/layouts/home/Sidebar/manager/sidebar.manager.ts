import { RouteName } from '@pulse/common/enums'
import type { MenuItemConfig, MenuContext, MenuItem } from './sidebar.types'

/**
 * Manages sidebar menu items registration and retrieval
 */
export class SidebarManager {
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
  static getMenuItems(context: MenuContext): MenuItem[] {
    return Array.from(this.menuItems.values())
      .filter(item => item.shouldDisplay(context))
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        routeName: item.routeName,
        title: item.title,
        iconLeftName: item.icon,
        display: true,
        featureName: item.featureName,
        hasSubmenuSelected: item.hasSubmenuSelected?.(context),
      }))
  }

  /**
   * Get the folder or entity menu item based on context
   * If the user does not have access to the first available submenu, returns the second and so on
   */
  static getEntityOverviewMenuItem(context: MenuContext): MenuItem | null {
    const title = context.isCollab ? 'shared.sidebar.folder' : 'shared.sidebar.entity'

    const menuItems = [
      {
        routeName: RouteName.USERS,
        display: context.permissions.hasUsers,
      },
      {
        routeName: RouteName.COLLAB,
        display: context.isCollab && context.permissions.hasCollaborators,
      },
      {
        routeName: RouteName.OFFERS,
        display: context.permissions.hasOffer,
      },
      {
        routeName: RouteName.INFO,
        display: context.permissions.hasInformation,
      },
      {
        routeName: RouteName.DELEGATIONS_HISTORY,
        display: context.isCollab && context.permissions.hasHistory,
      },
    ]

    const menuItem = menuItems.find((item) => item.display)

    if (menuItem === undefined) {
      return null
    }

    return {
      routeName: menuItem.routeName,
      display: menuItem.display,
      title,
      iconLeftName: 'building',
    }
  }
}
