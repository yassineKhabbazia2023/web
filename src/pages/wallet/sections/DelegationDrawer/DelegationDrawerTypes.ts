import { IEntity } from '@/pages/wallet/types'

export interface DelegationDrawerProps {
  modelValue: boolean
  selectedFolders: IEntity[]
}

/* eslint-disable no-unused-vars */
export enum DelegationFlowType {
  FULL = 'full',
  SPECIFIC = 'specific'
}
/* eslint-enable no-unused-vars */
