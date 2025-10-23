import type { WalletTabConfig, WalletContext, WalletTabItem } from './wallet.types'
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
      }))
  }

  /**
   * Get tabs for current user (convenience method)
   */
  static getTabsForUser(isCollab: boolean): WalletTabItem[] {
    const context = this.buildContext(isCollab)
    return this.getTabs(context)
  }
}
