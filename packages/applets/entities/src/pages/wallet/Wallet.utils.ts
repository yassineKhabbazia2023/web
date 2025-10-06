import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import { WalletTab } from './Wallet.enums'
import type { WalletTabConfiguration, WalletAvailableTab } from './Wallet.types'
import { COLLAB_TABS_CONFIGURATION, CUSTOMER_TABS_CONFIGURATION } from './Wallet.const'

export function getAvailableTabs(
  allTabs: WalletTabConfiguration[],
  tabLabels: Record<WalletTab, string>,
): WalletAvailableTab[] {
  return allTabs
    .filter(({ permissionCodes, featureFlag }) => {
      if (featureFlag !== undefined && FeatureFlagManager.isFeatureActivated(featureFlag) === false) {
        return false
      }
      const hasPermission = permissionCodes === undefined
        ? true
        : CurrentUserManager.hasPermission(permissionCodes)

      return hasPermission
    })
    .map(({ name }) => ({
      name,
      title: tabLabels[name] ?? '',
    }))
}

export function getTabs(
  tabLabels: Record<WalletTab, string>,
  isCollab: boolean,
): WalletAvailableTab[] {
  const allTabs = isCollab ? COLLAB_TABS_CONFIGURATION : CUSTOMER_TABS_CONFIGURATION

  return getAvailableTabs(allTabs, tabLabels)
}
