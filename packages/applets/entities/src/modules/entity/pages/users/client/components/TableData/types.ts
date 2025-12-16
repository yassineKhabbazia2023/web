import type { ExtendedUser } from './../../UsersClientTypes'

export interface Props {
  data: ExtendedUser[]
  // Controls which menu items are enabled (modify rights, remove user)
  isInAnEntityPage?: boolean
  // Hides the "Date added" column when true
  isAccountManagement?: boolean
  // Hides the entire "Options" column when false
  canManageUsers?: boolean
}
