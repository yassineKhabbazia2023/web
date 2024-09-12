import type { PaginationData } from '@/helper/helperTypes'

export interface Collab {
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

export interface ExtendedCollab extends Collab {
  initials: string
}

export interface State extends PaginationData<ExtendedCollab> {
  totalPages: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
  sort: string | undefined
}
