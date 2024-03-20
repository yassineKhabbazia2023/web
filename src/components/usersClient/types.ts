export interface IUser {
  id: string
  initials: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  persona: string
  isLoggedUser: Function
  createdAt: string
}

export interface IState {
  data: IUser[]
  currentPage: number
  limit: number
  totalPages: number | undefined
  totalItems: number | undefined
  search: string | undefined
  isLoading: boolean
}
