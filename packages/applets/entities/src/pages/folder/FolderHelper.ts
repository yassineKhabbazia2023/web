import { CurrentUserManager } from '@pulse/common/managers'
import { ACCOUNT_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import type { TabName, Tab } from './FolderTypes'

const TAB_NAMES: TabName[] = ['users', 'collab', 'offers', 'info', 'delegationsHistory']

export function getTabAuthorisations(isCollab: boolean): Record<TabName, boolean> {
  return {
    offers: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.OFFER),
    info: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.INFORMATION),
    users: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.USERS),
    collab: isCollab && CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.COLLABORATORS),
    delegationsHistory: isCollab && CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.HISTORY),
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
