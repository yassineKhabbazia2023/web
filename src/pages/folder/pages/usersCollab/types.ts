import type { PaginationData } from '@/helper/helperTypes'
import type { Component } from 'vue'

export interface IUserStatus {
  text: string
  color: '' | 'success' | 'warning' | 'danger' | 'info'
    | 'persian' | 'fuschia' | 'cyan' | 'amethyste' | 'gray-300' | 'gray-500' | 'gray-900'
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

export interface IGetAccountRelatedUsersResponse {
  data: IUserFromApi[]
}

export interface IUser {
  initials: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  isOwner: boolean
  status: string | IUserStatus
  role: string
  firstDateAccess: string
}

export interface IStateUser extends PaginationData<IUser> {
  currentPage: number
  limit: number
  totalItems: number
  totalPage: number
  isLoading: boolean | undefined
}
