import type { UserInfo } from '@pulse/common/types'

export const getMockedUser = (): UserInfo => {
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
  }

  return user
}
