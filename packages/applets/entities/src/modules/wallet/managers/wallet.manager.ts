import type { WalletTabConfig, WalletContext, WalletTabItem } from '../types'
import type { WalletTab } from '../enums'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'

/**
 * Manages wallet tab registration and retrieval
 */
export class WalletManager {
  private static readonly tabs = new Map<WalletTab, WalletTabConfig>()

  /**
   * Register a new wallet tab configuration
   */
  static register(config: WalletTabConfig): void {
    this.tabs.set(config.id, config)
  }

  /**
   * Get a specific wallet tab configuration by id
   */
  static getTab(id: WalletTab): WalletTabConfig | undefined {
    return this.tabs.get(id)
  }

  /**
   * Build context from current user state
   */
  private static buildContext(isCollab: boolean): WalletContext {
    return {
      isCollab,
      hasPermission: (permission) => CurrentUserManager.hasPermission(permission),
      hasFeatureFlag: (flag) => FeatureFlagManager.isFeatureActivated(flag),
    }
  }

  /**
   * Get all wallet tabs for the current context, filtered and sorted
   */
  static getTabs(context: WalletContext): WalletTabItem[] {
    return Array.from(this.tabs.values())
      .filter(tab => tab.isDisplayed(context))
      .sort((a, b) => a.order - b.order)
      .map(tab => ({
        name: tab.id,
        title: tab.title,
        route: tab.route,
        display: true,
        showInMobile: tab.showInMobile?.(context) ?? false,
        count: tab.getCount?.(),
      }))
  }

  /**
   * Get tabs for current user (convenience method)
   * On mobile, only tabs with showInMobile: true are shown, for both collaborators and customers
   */
  static getTabsForUser(isCollab: boolean, isMobile: boolean = false): WalletTabItem[] {
    const context = this.buildContext(isCollab)
    const tabs = this.getTabs(context)

    if (isMobile === true) {
      return tabs.filter(tab => tab.showInMobile === true)
    }

    return tabs
  }

  /**
   * Clear all registered tabs (for testing purposes)
   */
  static clear(): void {
    this.tabs.clear()
  }

  /**
   * Get the number of registered tabs (for testing purposes)
   */
  static getTabCount(): number {
    return this.tabs.size
  }
}
