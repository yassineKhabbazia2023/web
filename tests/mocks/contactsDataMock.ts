import type { contactsMockRequest } from './generateContactsMockRequest.ts'
import type { Contact } from '@/common/types'

export const generateContactsMock = (
  request: contactsMockRequest,
): { data: any } => {
  const baseContactData = {
    contactId: 1,
    globalContactId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@testemail.com',
    type: 'Customer',
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
