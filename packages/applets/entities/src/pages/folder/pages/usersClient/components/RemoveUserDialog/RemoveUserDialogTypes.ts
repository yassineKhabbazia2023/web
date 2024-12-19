import type { ExtendedUser } from '../../UsersClientTypes'
interface UserToRemoveInfo {
  initials: ExtendedUser['initials']
  fullName: ExtendedUser['fullName']
  email: ExtendedUser['email']
  contactId: ExtendedUser['contactId']
}

export interface RemoveUserDialogProps {
  modelValue: boolean
  userToRemove: UserToRemoveInfo | undefined
  isCollab?: boolean
}
