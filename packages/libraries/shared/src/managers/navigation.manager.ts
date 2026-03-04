import { AccountType } from '@pulse/common/enums'
import type { NavigationItemConfig, NavigationContext, NavigationItem } from '@shared/types/navigation.types'

/**
 * Manages sidebar navigation items registration and retrieval
 */
export class NavigationManager {
  private static readonly navigationItems = new Map<string, NavigationItemConfig>()

  /**
   * Register a new navigation item configuration
   */
  static register(config: NavigationItemConfig): void {
    this.navigationItems.set(config.id, config)
  }

  /**
   * Get all navigation items for the current context, filtered and sorted
   */
  static getNavigationItems(
    context: NavigationContext,
    accountType: AccountType = AccountType.REGULAR,
  ): NavigationItem[] {
    return Array.from(this.navigationItems.values())
      .filter(item => item.shouldDisplay(context) && item.accountType === accountType)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        routeName: item.routeName,
        title: item.title(context),
        icon: item.icon,
        featureName: item.featureName,
        activeRoutes: item.activeRoutes ?? [item.routeName],
        hasSubmenuSelected: item.hasSubmenuSelected?.(context),
        showInMobile: item.showInMobile ?? false,
        doNotTrack: item.doNotTrack,
      }))
  }

  /**
   * Clears all registered navigation items.
   */
  static resetNavigationItems(): void {
    this.navigationItems.clear()
  }
}
