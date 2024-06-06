import type { IExtendedUser } from './../../types'

/* eslint-disable no-unused-vars */
export enum userActions {
  MODIFY_RIGHTS = 'modifyRights',
  REMOVE_USER = 'removeUser',
  ASSIGN_SIGNATORY = 'assignSignatory',
  USER_INFORMATION = 'userInformation',
}
/* eslint-disable no-unused-vars */

export interface Props {
  data: IExtendedUser[]
  isInAnEntityPage: boolean
}
