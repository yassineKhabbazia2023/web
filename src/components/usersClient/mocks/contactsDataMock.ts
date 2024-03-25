import type { contactsMockRequest } from './generateContactsMockRequest.ts'
import type { IUserFromApi } from '../types.ts'

export const generateContactsMock = (
  request: contactsMockRequest,
): { data: any } => {
  const persona = {
    id: 24,
    name: 'Customer',
    description: '',
  }

  const baseContactData = {
    id: 1,
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@testemail.com',
    persona,
    createdAt: '2024-03-07',
  }

  const contactsDataArray: IUserFromApi[] = []

  for (let i = 0; i < request.numberOfContactsToReturn; i++) {
    contactsDataArray.push({
      ...baseContactData,
      id: baseContactData.id + 1,
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
