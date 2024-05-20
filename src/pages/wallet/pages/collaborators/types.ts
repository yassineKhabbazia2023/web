import type { PaginationData } from '@/helper/helperTypes'

export interface ICollab {
  id: number
  fullName: string
  firstName: string
  lastName: string
  email: string
  landPhone?: string
  mobilePhone: string
  ibsStatus: string
  role: string
  office: string
}

export interface IExtendedCollab extends ICollab {
  initials: string
}

export interface IState extends PaginationData<IExtendedCollab> {
  totalPages: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
  sort: string | undefined
}
