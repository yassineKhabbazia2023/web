import type { UserInfo } from '@kpmg/common'

export const getMockedUser = (): UserInfo => {
  const user: UserInfo = {
    id: '123',
    token: '',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    occupation: 'Consultant Advisory',
    isCollab: true,
    entities: {
      favorites: [],
      default: undefined
    }
  }

  return user
}
