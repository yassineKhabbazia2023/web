import type { contactsMockRequest } from './generateContactsMockRequest.ts'
import type { IUserFromApi } from '@/common/components/UsersClient/types'

export const generateContactsMock = (
  request: contactsMockRequest,
): { data: any } => {
  const baseContactData = {
    contactId: 1,
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@testemail.com',
    personaName: 'Customer',
    creationDate: '2024-03-07',
  }

  const contactsDataArray: IUserFromApi[] = []

  for (let i = 0; i < request.numberOfContactsToReturn; i++) {
    contactsDataArray.push({
      ...baseContactData,
      contactId: baseContactData.contactId + 1,
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
