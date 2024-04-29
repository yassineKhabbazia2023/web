import type { Contact } from '@/services/contact/contactTypes'
import type { Legal } from '@/services/account/accountTypes'

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
