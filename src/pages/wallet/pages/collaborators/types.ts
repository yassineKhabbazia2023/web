export interface ICollab {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  ibsStatus: string
  role: string
  office: string
  hasAccess: boolean
}

export interface IState {
  data: ICollab[]
  currentPage: number
  limit: number
  totalPages: number | undefined
  totalItems: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
}
