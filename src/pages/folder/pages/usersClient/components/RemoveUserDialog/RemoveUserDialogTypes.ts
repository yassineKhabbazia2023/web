import type { IExtendedUser } from '../../types'

export interface RemoveUserDialogProps {
  modelValue: boolean
  userToRemove: IExtendedUser | undefined
}
