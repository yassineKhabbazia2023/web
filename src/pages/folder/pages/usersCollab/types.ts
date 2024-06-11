import type { PaginationData } from '@/helper/helperTypes'
import type { Component } from 'vue'

/**
 * 🛠️ TODO: don't use the 'I' prefix on new types as this is against our conventions.
 */

/* eslint-disable no-unused-vars */
export enum userActions {
  MODIFY_RIGHTS = 'modifyRights',
  DELETE_USER = 'deleteUser',
  ASSIGN_SIGNATORY = 'assignSignatory',
}
/* eslint-disable no-unused-vars */

export interface IUserStatus {
  text: string
  color:
    | ''
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'persian'
    | 'fuschia'
    | 'cyan'
    | 'amethyste'
    | 'gray-300'
    | 'gray-500'
    | 'gray-900'
  icon: Component
}

export interface IUserFromApi {
  contactId: number
  globalContactId: string
  firstName: string
  lastName: string
  email: string
  type: string
  status: string
  personaName: string
  creationDate: string
}

export interface IUser {
  contactId: number
  initials: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  isOwner: boolean
  role?: string
  status?: string | IUserStatus
  firstDateAccess?: string
}

export interface IStateUser extends PaginationData<IUser> {
  currentPage: number
  limit: number
  totalItems: number | undefined
  totalPage: number | undefined
  isLoading: boolean | undefined
  sort: string | undefined
  order: string | undefined
  search: string | undefined
}
