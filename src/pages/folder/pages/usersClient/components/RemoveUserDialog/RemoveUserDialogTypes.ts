import type { IExtendedUser } from '../../types'

interface UserToRemoveInfo {
  initials: IExtendedUser['initials']
  fullName: IExtendedUser['fullName']
  email: IExtendedUser['email']
  contactId: IExtendedUser['contactId']
}

export interface RemoveUserDialogProps {
  modelValue: boolean
  userToRemove: UserToRemoveInfo
}
