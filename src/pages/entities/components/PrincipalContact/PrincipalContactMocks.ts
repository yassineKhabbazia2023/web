import type { User } from './PrincipalContactTypes'

export function getMockedPrincipalContact(): User {
  const principalContact: User = {
    contactId: 1,
    userId: 5,
    firstName: 'Corabel',
    lastName: 'Greenall',
    email: 'test_loscos@yopmail.com'
  }

  return principalContact
}
