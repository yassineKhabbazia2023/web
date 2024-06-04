export interface IUserFromApi {
  contactId: number
  firstName: string
  lastName: string
  email: string
  personaName: string
  creationDate: string
}

export interface IExtendedUser extends IUserFromApi {
  initials: string
  fullName: string
  isLoggedUser: boolean
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
  isManageRightsDrawerOpened: boolean
  isRemoveUserDialogOpened: boolean
  userToRemove: IExtendedUser | undefined
  selectedUserId: number
  sort: string | undefined
}
