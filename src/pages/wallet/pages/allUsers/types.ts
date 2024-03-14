export interface IUser {
  id: string
  initials: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  persona: string
  isOwner: boolean
  isLoggedUser: Function
  createdAt: string
}

export interface IState {
  data: IUser[]
  currentPage: number
  limit: number
  totalPages: number | undefined
  totalItems: number | undefined
  isLoading: boolean
}
