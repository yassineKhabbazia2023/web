import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { Feature, RouteName } from '@pulse/common/enums'
import type { TabName, Tab } from '../types'
import { ENTITY_OVERVIEW_TAB_ROUTE_NAMES } from '../constants/entity-overview.constants'

const canAccessInvoices = (isInvoicesTabVisible: boolean): boolean => {
  const isFeatureActive = FeatureFlagManager.isFeatureActivated(Feature.RYDGE_INVOICES)
  if (isFeatureActive === false) {
    return false
  }

  return isInvoicesTabVisible
}

export function getTabAuthorizations(isCollab: boolean, isInvoicesTabVisible: boolean): Record<TabName, boolean> {
  const hasInvoicesAccess = canAccessInvoices(isInvoicesTabVisible)

  return {
    [RouteName.OFFERS]: CurrentUserManager.hasCurrentEntityPermission(ACCOUNT_PERMISSIONS.OFFER),
    [RouteName.INFO]: CurrentUserManager.hasCurrentEntityPermission(ACCOUNT_PERMISSIONS.INFORMATION),
    [RouteName.USERS]: CurrentUserManager.hasCurrentEntityPermission(ACCOUNT_PERMISSIONS.USERS),
    [RouteName.COLLAB]: isCollab && CurrentUserManager.hasCurrentEntityPermission(ACCOUNT_PERMISSIONS.COLLABORATORS),
    [RouteName.FOLDER_HISTORY]: isCollab,
    [RouteName.RYDGE_INVOICES]: hasInvoicesAccess,
  }
}

export function getTabs(
  tabAuthorizations: Record<TabName, boolean>,
  titles: Record<TabName, string>,
): Tab[] {
  return ENTITY_OVERVIEW_TAB_ROUTE_NAMES
    .filter(name => tabAuthorizations[name])
    .map(name => ({
      name,
      title: titles[name],
    }))
}
