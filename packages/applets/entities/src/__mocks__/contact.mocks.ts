import { ContactType } from '@pulse/common/enums'
import type { Contact, contactsRequest } from '@entities/common/types'

export const mockedContactId = 25
export const mockedContactType = ContactType.COLLABORATOR

export const getMockedCustomersCollab = () => {
  return [
    {
      contactId: 188,
      contactGlobalUniqueId: '00000000-0000-0000-0000-000000000000',
      firstName: 'Test 1',
      lastName: 'Test 1 last',
      email: 'test1@test.fr',
      status: 'Invited',
      personaName: 'ADMIN/Dirigeant',
      creationDate: '4/16/2024',
    },
    {
      contactId: 189,
      contactGlobalUniqueId: '00000000-0000-0000-0000-000000000000',
      firstName: 'Test 2',
      lastName: 'Test 2 last',
      email: 'test2@test.fr',
      status: 'Declared',
      personaName: 'ADMIN/Dirigeant',
      creationDate: '4/16/2024',
    },
  ]
}


export const generateContactsMock = (
  request: contactsRequest,
): { data: any } => {
  const baseContactData = {
    contactId: 1,
    globalContactId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@testemail.com',
    type: ContactType.CUSTOMER,
    status: 'Declared',
    personaName: 'Customer',
    creationDate: '2024-03-07',
  }

  const contactsDataArray: Contact[] = []

  for (let i = 0; i < request.numberOfContactsToReturn; i++) {
    contactsDataArray.push({
      ...baseContactData,
      contactId: baseContactData.contactId + i,
      firstName: baseContactData.firstName + i,
      email: baseContactData.email + i,
    })
  }

  return {
    data: {
      items: contactsDataArray,
      totalItems: request.contactsTotalCount,
      totalPages: request.numberOfPages,
      currentPage: request.currentPage,
    },
  }
}
