import type { AccountSignatories } from '@entities/services/account/account.type'

export function getClientContactMock(override: Partial<AccountSignatories> = {}) {
  const defaultClientContact: AccountSignatories = {
    contactId: 1,
    contactGlobalUniqueId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@yopmail.com',
    status: 'Connected',
    personaName: 'Customer',
    office: 'Paris',
    creationDate: '2024-03-07',
  }

  return {
    ...defaultClientContact,
    ...override,
  }
}

export function getMockedPrincipalContacts(): AccountSignatories[] {
  const clientContactMock = getClientContactMock()
  const principalContact: AccountSignatories[] = [
    clientContactMock,
    {
      contactId: 2,
      contactGlobalUniqueId: '2bb50d07-f5de-424d-88be-75a5d4b570ed',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@yopmail.com',
      status: 'Connected',
      personaName: 'Customer',
      office: 'Lyon',
      creationDate: '2024-03-07',
    },
  ]

  return principalContact
}
