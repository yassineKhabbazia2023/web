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
   * Get all menu items for the current context, filtered and sorted
   */
  static getMenuItems(context: MenuContext): MenuItem[] {
    return Array.from(this.menuItems.values())
      .filter(item => item.shouldDisplay(context))
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        routePath: item.route(context.entityId, context),
        title: item.title,
        iconLeftName: item.icon,
        display: true,
        featureName: item.featureName,
        hasSubmenuSelected: item.hasSubmenuSelected?.(context),
      }))
  }

  /**
   * Get the folder or entity menu item based on context
   */
  static getFolderOrEntityMenuItem(context: MenuContext): MenuItem | null {
    const title = context.isCollab ? 'shared.sidebar.folder' : 'shared.sidebar.entity'

    const menuItems = [
      {
        routePath: `/dossier/${context.entityId}/gestion-utilisateurs`,
        display: context.permissions.hasUsers,
      },
      {
        routePath: `/dossier/${context.entityId}/collaborateurs`,
        display: context.isCollab && context.permissions.hasCollaborators,
      },
      {
        routePath: `/dossier/${context.entityId}/offres`,
        display: context.permissions.hasOffer,
      },
      {
        routePath: `/dossier/${context.entityId}/informations`,
        display: context.permissions.hasInformation,
      },
      {
        routePath: `/dossier/${context.entityId}/historique-delegations`,
        display: context.isCollab && context.permissions.hasHistory,
      },
    ]

    const menuItem = menuItems.find((item) => item.display)

    return menuItem
      ? {
        routePath: menuItem.routePath,
        display: menuItem.display,
        title,
        iconLeftName: 'building',
      }
      : null
  }
}
