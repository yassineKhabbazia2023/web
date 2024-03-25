export interface IUserFromApi {
  id: string
  firstName: string
  lastName: string
  email: string
  persona: string
  createdAt: string
}

export interface IExtendedUser extends IUserFromApi {
  initials: string
  fullName: string
  isLoggedUser: Function
  isOwner: boolean
}

export interface IState {
  data: IExtendedUser[]
  currentPage: number
  limit: number
  totalPages: number | undefined
  totalItems: number | undefined
  search: string | undefined
  isLoading: boolean
}
