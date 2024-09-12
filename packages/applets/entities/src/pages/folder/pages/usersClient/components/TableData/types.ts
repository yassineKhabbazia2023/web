import type { ExtendedUser } from './../../UsersClientTypes'

/* eslint-disable no-unused-vars */
export enum userActions {
  MODIFY_RIGHTS = 'modifyRights',
  REMOVE_USER = 'removeUser',
  ASSIGN_SIGNATORY = 'assignSignatory',
  USER_INFORMATION = 'userInformation',
}
/* eslint-disable no-unused-vars */

export interface Props {
  data: ExtendedUser[]
  isInAnEntityPage?: boolean
  isAccountManagement?: boolean
}
