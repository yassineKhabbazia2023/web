import type { AccountRow } from '@entities/common/types'


export enum PermissionTypeTabs {
  CLIENT_PERMISSIONS = 'clientPermissions',
  COLLAB_PERMISSIONS = 'collabPermissions',
}


export interface AccountRightsDrawerProps {
  modelValue: boolean
  selectedAccount: AccountRow
}

export interface PermissionTypeTab {
  index: number
  name: `${PermissionTypeTabs}`
  label: string
}
