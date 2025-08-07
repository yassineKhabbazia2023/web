import type { UserInfo, UserInfoApi, UserContextInfo } from '../stores/types'


export const getMockedUser = (override: Partial<UserInfo> = {}) => {
  const defaultUser: UserInfo = {
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
      default: undefined,
    },
    persona: {
      id: 1,
      name: 'Collaborator GS',
      description: '',
    },
  }
  const user = {
    ...defaultUser,
    ...override,
  }

  return user
}

export const getMockedUserContext = (override: Partial<UserContextInfo> = {}) => {
  const defaultUser: UserContextInfo = {
    contact: {

      id: 123,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isCollab: true,
      gigyaUserId: '',
      occupation: '',
      officeMobile: 'johnd-mobile-phone',
      oldId: 'johnd-guid',
      persona: {
        id: 1,
        description: '',
        name: 'Collaborator GS',
      },
      entities: {
        default: undefined,
      },
    },
    permissions: ['AUT001', 'AUT002'],
    favoriteEntities: [],
  }
  const user = {
    ...defaultUser,
    ...override,
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
