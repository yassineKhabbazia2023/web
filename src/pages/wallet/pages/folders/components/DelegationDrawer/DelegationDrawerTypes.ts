import type { Entity } from '@kpmg/common'

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

/* eslint-disable no-unused-vars */
export enum DelegationFlowType {
  FULL = 'full',
  SPECIFIC = 'specific'
}
/* eslint-enable no-unused-vars */
