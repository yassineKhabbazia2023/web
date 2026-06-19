import type { Entity } from '@pulse/common/types'
import type { DelegationTab } from '@entities/modules/wallet/enums'

export interface SelectedFolder {
  accountNumber: Entity['accountNumber']
  id: Entity['accountId']
  name: Entity['legalName']
  avatarColor: Entity['color']
}

export interface DelegationDrawerProps {
  modelValue: boolean
  selectedFolders: SelectedFolder[]
  numberOfFoldersInPortfolio: number
  /** Opens the drawer directly on the given tab (full flow only). */
  initialTab?: DelegationTab
}
