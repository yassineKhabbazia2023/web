import type { AccountRow } from '@entities/types'
import type { AccountType } from '@pulse/common/enums'

export interface ResendActivationEmailDrawerProps {
  modelValue: boolean
  selectedAccount: AccountRow
  accountType: AccountType
}
