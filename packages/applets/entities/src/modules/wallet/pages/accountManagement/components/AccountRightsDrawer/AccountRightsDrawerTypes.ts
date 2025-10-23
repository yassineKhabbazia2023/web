import type { AccountRow } from '@entities/types'

export type PermissionType = 'clientPermissions' | 'collabPermissions'

export interface AccountRightsDrawerProps {
  modelValue: boolean
  selectedAccount: AccountRow
}

export interface PermissionTypeTab {
  index: number
  name: PermissionType
  label: string
}
