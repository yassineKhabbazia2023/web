import type { UserInfo } from '../types/user.type'

export const getMockedUserInfo = (overridden: Partial<UserInfo> = {}): UserInfo => {
  const user: UserInfo = {
    id: 123,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    occupation: 'Consultant Advisory',
    isCollab: false,
    gigyaUserId: 'test',
    officeMobile: 'johnd-mobile-phone',
    oldId: 'johnd-guid',
    entities: {
      default: undefined,
    },
  }

  return {
    ...user,
    ...overridden,
  }
}
