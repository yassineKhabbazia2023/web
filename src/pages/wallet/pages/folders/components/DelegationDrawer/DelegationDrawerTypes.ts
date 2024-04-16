import type { IEntity } from '@/pages/wallet/types'

export interface SelectedFolder {
  accountNumber: IEntity['accountNumber']
  id: IEntity['id']
  name: IEntity['name']
  avatarColor: IEntity['owner']['avatarColor']
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
