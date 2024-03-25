import type { Component } from 'vue'

export interface IUserStatus {
  text: string
  color: '' | 'success' | 'warning' | 'danger' | 'info'
    | 'persian' | 'fuschia' | 'cyan' | 'amethyste' | 'gray-300' | 'gray-500' | 'gray-900'
  icon: Component
}
export interface IUser {
  firstName: string
  lastName: string
  email: string
  isOwner: boolean
  status: string | IUserStatus
  role: string
  firstDateAccess: string
}

export interface IStateUser {
  data: IUser[]
  currentPage: number
  limit: number
  totalPage: number
  totalItems: number
  isLoading: boolean | undefined
}
