import type { Entity } from '@pulse/common/types'

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
}


export enum DelegationFlowType {
  FULL = 'full',
  SPECIFIC = 'specific'
}

