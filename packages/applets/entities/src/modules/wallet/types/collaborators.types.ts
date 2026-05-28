import type { SortingCriteria, PaginationData } from '@pulse/common/types'

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

export interface CollaboratorsState extends PaginationData<ExtendedCollab> {
  totalPages: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
  sorting: SortingCriteria
}
