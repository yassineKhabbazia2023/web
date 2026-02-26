import type { Contact, UserStatus } from './contact.types'

export interface User {
  contactId: number
  initials: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  isOwner: boolean
  role?: string
  status?: string | UserStatus
  firstDateAccess?: string
}

export interface ExtendedUser extends Contact {
  initials: string
  fullName: string
  isLoggedUser: boolean
  isOwner: boolean
  isSignatory: boolean
  statusTag?: UserStatus
}
