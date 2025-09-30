import type { IconName, PTagProps } from '@pulse/styleguide/types'

export interface Contact {
  contactId: number
  globalContactId: string
  firstName: string
  lastName: string
  email: string
  type: string
  status: string
  personaName: string
  creationDate: string
}

export interface UserStatus {
  text: string
  color: PTagProps['pColor']
  iconName: IconName
}

export type contactsRequest = {
  numberOfContactsToReturn: number
  contactsTotalCount: number
  numberOfPages: number
  currentPage: number
}
