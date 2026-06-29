import type { Ref, WritableComputedRef } from 'vue'
import type { SearchAccountItem } from '@entities/services/account/account.type'
import type { Collab } from '@entities/types'

export type RequestDelegationRef = {
  canGoNext: boolean
  selectedAccount: SearchAccountItem | null
  selectedCollaborators: Collab[]
  initiallySelectedCollaborators: Collab[] | null
}

export interface UseRequestDelegationParams {
  requestDelegationStep: Ref<number>
  requestDelegationRef: Ref<RequestDelegationRef | null>
  isDelegationDrawerOpened: WritableComputedRef<boolean>
}
