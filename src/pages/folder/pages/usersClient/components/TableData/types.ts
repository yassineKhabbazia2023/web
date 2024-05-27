import type { IExtendedUser } from './../../types'

/* eslint-disable no-unused-vars */
export enum userActions {
  MODIFY_RIGHTS = 'modifyRights',
  DELETE_USER = 'deleteUser',
  ASSIGN_SIGNATORY = 'assignSignatory',
}
/* eslint-disable no-unused-vars */

export interface Props {
  data: IExtendedUser[]
}
