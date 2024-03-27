import type { PaginationData } from '@/helper/helperTypes'

export interface ICollab {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  landPhone: string
  mobilePhone: string
  ibsStatus: string
  role: string
  office: string
  hasAccess: boolean
}

export interface IExtendedCollab extends ICollab {
  initials: string
}

export interface IState extends PaginationData<IExtendedCollab> {
  totalPages: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
}
