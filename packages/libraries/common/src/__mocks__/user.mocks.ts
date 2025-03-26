
import type { UserInfo, UserInfoApi } from '../stores/types'


export const getMockedUser = () => {
  const user: UserInfo = {
    id: 123,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    occupation: 'Consultant Advisory',
    isCollab: true,
    gigyaUserId: 'test',
    officeMobile: 'johnd-mobile-phone',
    oldId: 'johnd-guid',
    entities: {
      favorites: [],
      default: undefined,
    },
    persona: {
      id: 1,
      name: 'Collaborator GS',
      description: '',
    },
  }

  return user
}

export const getMockedUserApi = () => {
  const user: UserInfoApi = {
    id: 123,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    persona: {
      id: 1,
      name: 'Collaborator GS',
      description: '',
    },
    officeMobile: '11223344',
    isCustomer: false,
    officePhone: '',
    oldId: '',
  }
  return user
}

export const getMockedUserPermissions = (): string[] => [
  'COADMI001',
  'COBank001',
  'COCAL001',
  'COEMB001',
  'COEVPO01',
  'COGED0001',
  'COGED0002',
]
