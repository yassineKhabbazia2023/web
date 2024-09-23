import type { UserInfo } from '@pulse/Common'

export const getMockedUser = (): UserInfo => {
  const user: UserInfo = {
    id: 123,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    occupation: 'Consultant Advisory',
    isCollab: true,
    gigyaUserId: 'test',
    entities: {
      favorites: [],
      default: undefined,
    },
  }

  return user
}
