import type { AccountRow } from '@entities/common/types'

/* eslint-disable no-unused-vars */
export enum PermissionTypeTabs {
  CLIENT_PERMISSIONS = 'clientPermissions',
  COLLAB_PERMISSIONS = 'collabPermissions',
}
/* eslint-enable no-unused-vars */

export interface AccountRightsDrawerProps {
  modelValue: boolean
  selectedAccount: AccountRow
}

export interface PermissionTypeTab {
  index: number
  name: `${PermissionTypeTabs}`
  label: string
}
