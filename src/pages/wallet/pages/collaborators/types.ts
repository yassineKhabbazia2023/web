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

export interface IState {
  data: IExtendedCollab[]
  currentPage: number
  limit: number
  totalPages: number | undefined
  totalItems: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
}
