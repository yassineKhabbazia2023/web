import type { Contact } from '@entities/services/contact/contactTypes'
import type { Legal } from '@entities/services/account/account.type'

interface DelegationContact {
  id: Contact['id']
  firstName: Contact['firstName']
  lastName: Contact['lastName']
  isCurrentUser: boolean
}

export interface Delegation {
  creationDate: string
  accountLegalName: Legal['legalName']
  id: number
  isEnabled: boolean
  delegatee: DelegationContact
  delegator: DelegationContact
}
