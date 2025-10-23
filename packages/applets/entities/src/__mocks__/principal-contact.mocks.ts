import type { ClientContact } from '@entities/types'

export function getClientContactMock(override: Partial<ClientContact> = {}) {
  const defaultClientContact: ClientContact = {
    contactId: 1,
    firstName: 'Corabel',
    lastName: 'Greenall',
    email: 'test_loscos@yopmail.com',
  }

  return {
    ...defaultClientContact,
    ...override,
  }
}

export function getMockedPrincipalContacts(): ClientContact[] {
  const clientContactMock = getClientContactMock()
  const principalContact: ClientContact[] = [
    clientContactMock,
    {
      contactId: 2,
      firstName: 'Jean',
      lastName: 'Levage',
      email: 'test_loscos2@yopmail.com',
    },
  ]

  return principalContact
}
