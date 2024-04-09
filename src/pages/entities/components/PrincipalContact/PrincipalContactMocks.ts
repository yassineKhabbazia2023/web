import type { ClientContact } from './PrincipalContactTypes'

export function getMockedPrincipalContacts(): ClientContact[] {
  const principalContact: ClientContact[] = [
    {
      contactId: 1,
      firstName: 'Corabel',
      lastName: 'Greenall',
      email: 'test_loscos@yopmail.com',
    },
    {
      contactId: 2,
      firstName: 'Jean',
      lastName: 'Levage',
      email: 'test_loscos2@yopmail.com',
    },
  ]

  return principalContact
}
