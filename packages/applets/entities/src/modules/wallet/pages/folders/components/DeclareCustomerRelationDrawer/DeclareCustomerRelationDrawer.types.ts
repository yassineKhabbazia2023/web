import type { AccountRow } from '@entities/types'

export interface DeclareCustomerRelationDrawerProps {
  modelValue: boolean
  selectedAccount: AccountRow
  isCustomerRelation?: boolean
}
