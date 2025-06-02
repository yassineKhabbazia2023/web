import type { AccountRow } from '@entities/common/types'

export interface DeclareCustomerRelationDrawerProps {
  modelValue: boolean
  selectedAccount: AccountRow
  isCustomerRelation?: boolean
}
