import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import { ACCOUNT_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'
import type { TabName, Tab } from './types'

const TAB_NAMES: TabName[] = ['users', 'collab', 'offers', 'invoices', 'info', 'history', 'delegationsHistory']

const canAccessInvoices = (isCollab: boolean, isSignatory: boolean): boolean => {
  const isFeatureActive = FeatureFlagManager.isFeatureActivated(Feature.RYDGE_INVOICES)
  if (isFeatureActive === false) {
    return false
  }

  if (isCollab === true) {
    return true
  }

  return isSignatory
}

export function getTabAuthorisations(isCollab: boolean, isSignatory: boolean): Record<TabName, boolean> {
  const hasInvoicesAccess = canAccessInvoices(isCollab, isSignatory)

  return {
    offers: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.OFFER),
    info: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.INFORMATION),
    users: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.USERS),
    collab: isCollab && CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.COLLABORATORS),
    history: isCollab,
    delegationsHistory: isCollab && CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.HISTORY),
    invoices: hasInvoicesAccess,
  }
}

export function getTabs(
  tabAuthorisations: Record<TabName, boolean>,
  titles: Record<TabName, string>,
): Tab[] {
  return TAB_NAMES
    .filter(name => tabAuthorisations[name])
    .map(name => ({
      name,
      title: titles[name],
    }))
}
