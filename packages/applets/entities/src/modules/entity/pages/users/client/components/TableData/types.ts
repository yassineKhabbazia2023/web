import type { ExtendedUser } from './../../UsersClientTypes'

export interface Props {
  data: ExtendedUser[]
  isInAnEntityPage?: boolean
  isAccountManagement?: boolean
}
