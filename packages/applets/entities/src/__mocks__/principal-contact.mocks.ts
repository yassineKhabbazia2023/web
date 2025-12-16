import type { ClientContact } from '@entities/types'

export function getClientContactMock(override: Partial<ClientContact> = {}) {
  const defaultClientContact: ClientContact = {
    contactId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@yopmail.com',
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
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@yopmail.com',
    },
  ]

  return principalContact
}
