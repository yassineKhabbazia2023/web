import { CurrentUserManager } from '@pulse/common/managers'
import { PERMISSION_ACCOUNT, PERMISSION_GLOBAL } from '@pulse/common/constants'
import type { TabName, Tab } from './FolderTypes'

const TAB_NAMES: TabName[] = ['users', 'collab', 'offers', 'info', 'delegationsHistory']

export function getTabAuthorisations(isCollab: boolean): Record<TabName, boolean> {
  return {
    offers: CurrentUserManager.hasPermission(PERMISSION_ACCOUNT.OFFER),
    info: CurrentUserManager.hasPermission(PERMISSION_ACCOUNT.INFORMATION),
    users: CurrentUserManager.hasPermission(PERMISSION_ACCOUNT.USERS),
    collab: isCollab && CurrentUserManager.hasPermission(PERMISSION_ACCOUNT.COLLABORATORS),
    delegationsHistory: isCollab && CurrentUserManager.hasPermission(PERMISSION_GLOBAL.HISTORY),
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
