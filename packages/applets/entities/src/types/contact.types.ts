import type { IconName, PTagProps } from '@pulse/styleguide/types'
import type { RoleLabel } from '@entities/modules/entity/shared/collaborators/types/collaborators.types'

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
  contactFlagPortailFactures?: boolean
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

export interface Collab {
  contactId: number
  globalContactId: string
  firstName: string
  lastName: string
  email: string
  personaName?: string
  office: string
  hasAccess: boolean
  isCustomerRelation: boolean
  actionLevel: number
  labels: RoleLabel[]
  isActive: boolean
}

export interface Role {
  id: number
  name: string
  description: string
}
