import type { ExtendedUser } from '@entities/types'

export interface UsersListProps {
  data: ExtendedUser[]
  // Controls which menu items are enabled (modify rights, remove user)
  isInAnEntityPage?: boolean
  // Hides the "Date added" column when true
  isAccountManagement?: boolean
  // Hides the entire "Options" column when false
  canManageUsers?: boolean
  // Hides the "Remove user" action on signatory rows when false (defaults to true)
  canRemoveSignatoryUsers?: boolean
}
