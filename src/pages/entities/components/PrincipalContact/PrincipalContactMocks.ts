import type { User } from './PrincipalContactTypes'

export function getMockedPrincipalContacts(): User[] {
  const principalContact: User[] = [
    {
      contactId: 1,
      userId: 5,
      firstName: 'Corabel',
      lastName: 'Greenall',
      contactEmail: 'test_loscos@yopmail.com',
    },
    {
      contactId: 2,
      userId: 6,
      firstName: 'Jean',
      lastName: 'Levage',
      contactEmail: 'test_loscos2@yopmail.com',
    },
  ]

  return principalContact
}
