import type { Contact } from '@/services/contact/contactTypes'

export type Delegate = {
  id: Contact['id']
  firstName: Contact['firstName']
  lastName: Contact['lastName']
  email: Contact['email']
}

export type DelegationDetails = {
  delegate: Delegate
  isAutomaticallyDelegated: boolean
}
