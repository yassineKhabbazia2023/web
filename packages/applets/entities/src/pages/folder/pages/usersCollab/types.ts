import type { PaginationData } from '@entities/helper/helperTypes'
import type { UserStatus } from '@entities/common/types'

 
export enum userActions {
  MODIFY_RIGHTS = 'modifyRights',
  DELETE_USER = 'deleteUser',
  ASSIGN_SIGNATORY = 'assignSignatory',
  UNASSIGN_SIGNATORY = 'unassignSignatory'
}
 

export interface User {
  contactId: number
  initials: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  isOwner: boolean
  role?: string
  status?: string | UserStatus
  firstDateAccess?: string
}

export interface StateUser extends PaginationData<User> {
  currentPage: number
  limit: number
  totalItems: number | undefined
  totalPage: number | undefined
  isLoading: boolean | undefined
  sort: string | undefined
  order: string | undefined
  search: string | undefined
}
