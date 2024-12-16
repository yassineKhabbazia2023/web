import type { ExtendedUser } from './../../UsersClientTypes'


export enum userActions {
  MODIFY_RIGHTS = 'modifyRights',
  REMOVE_USER = 'removeUser',
  ASSIGN_SIGNATORY = 'assignSignatory',
  USER_INFORMATION = 'userInformation',
}


export interface Props {
  data: ExtendedUser[]
  isInAnEntityPage?: boolean
  isAccountManagement?: boolean
}
