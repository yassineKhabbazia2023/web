import { CurrentUserManager } from '@pulse/common/managers'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import { PROSPECT_OVERVIEW_TAB_ROUTE_NAMES } from './prospect-overview.const'
import type { ProspectTabName, ProspectTab } from './prospect-overview.type'

export function getProspectTabAuthorizations(isCollab: boolean): Record<ProspectTabName, boolean> {
  return {
    [RouteName.PROSPECT_USERS]: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.USERS),
    [RouteName.PROSPECT_COLLAB]: isCollab && CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.COLLABORATORS),
    [RouteName.PROSPECT_INFO]: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.INFORMATION),
  }
}

export function getProspectTabs(
  tabAuthorizations: Record<ProspectTabName, boolean>,
  titles: Record<ProspectTabName, string>,
): ProspectTab[] {
  return PROSPECT_OVERVIEW_TAB_ROUTE_NAMES
    .filter(name => tabAuthorizations[name])
    .map(name => ({
      name,
      title: titles[name],
    }))
}
