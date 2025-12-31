import type { UserInfo, Persona } from '@pulse/common/types'
import type { Contact } from '@entities/services/contact/contactTypes'
import { ContactType } from '@pulse/common/enums'
import { getMockSignatory, getMockUsersList, MockEntityId } from '@pulse/common/mocks'

const basicSignatory = getMockSignatory('BASIC')

export const getMockedUser = (override: Partial<UserInfo> = {}): UserInfo => {
  const user: UserInfo = {
    id: basicSignatory.contactId,
    firstName: basicSignatory.firstName,
    lastName: basicSignatory.lastName,
    email: basicSignatory.email,
    occupation: 'Consultant Advisory',
    isCollab: true,
    gigyaUserId: 'test',
    officeMobile: `${basicSignatory.firstName.toLowerCase()}-mobile-phone`,
    oldId: `${basicSignatory.firstName.toLowerCase()}-guid`,
    entities: {
      default: undefined,
    },
  }

  return {
    ...user,
    ...override,
  }
}

export const mockUser: Contact = {
  id: MockEntityId.BASIC,
  firstName: basicSignatory.firstName,
  lastName: basicSignatory.lastName,
  email: basicSignatory.email,
  landPhone: '123-456-7890',
  mobilePhone: '987-654-3210',
  type: ContactType.CUSTOMER,
  office: 'Chalon sur Saône',
  persona: {
    id: 21,
    name: 'MOD Forms',
    description: '',
  } as Persona,
}

// Users client list based on canonical BASIC entity
const basicUsersList = getMockUsersList('BASIC')

export const mockedUsersClient = {
  data: {
    items: basicUsersList.map(user => ({
      contactId: user.contactId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      personaName: user.personaName,
      creationDate: user.creationDate,
    })),
    currentPage: 1,
    totalPages: 1,
    totalItems: basicUsersList.length,
  },
}
