import { userPermissions } from '@kpmg/common'
import { PERMISSION_CODES } from '@/constants'
import type { TabName, Tab } from './FolderTypes'

const { hasPermission } = userPermissions()

const TAB_NAMES: TabName[] = ['users', 'collab', 'offers', 'info', 'delegationsHistory']

export function getTabAuthorisations(isCollab: boolean): Record<TabName, boolean> {
  return {
    offers: hasPermission(PERMISSION_CODES.ACCOUNT_OFFER),
    info: hasPermission(PERMISSION_CODES.ACCOUNT_INFORMATION),
    users: hasPermission(PERMISSION_CODES.ACCOUNT_USERS),
    collab: isCollab && hasPermission(PERMISSION_CODES.ACCOUNT_COLLABORATORS),
    delegationsHistory: isCollab && hasPermission(PERMISSION_CODES.HISTORY),
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
