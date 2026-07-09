import type { PermanentDelegationDelegatee } from '@entities/services/account/account.type'

export interface PermanentDelegationItem {
  delegationId: number
  startDate: string
  delegatee: PermanentDelegationDelegatee
}
