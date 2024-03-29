type Persona = {
  id: number
  name: string
  description: string
}

export interface IUserFromApi {
  id: number
  firstName: string
  lastName: string
  email: string
  persona: Persona
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
  isDrawerViewDetailsOpened: boolean
  selectedUserId: number
  sort: string | undefined
}
