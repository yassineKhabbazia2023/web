import type { UserInfo } from '@pulse/common/types'

const baseUserInformation: Partial<UserInfo> = {
  id: 1234,
  firstName: 'John',
  lastName: 'Doe',
  occupation: 'idk',
  email: 'john@doe.fr',
}

export const collabUserMock: Partial<UserInfo> = {
  ...baseUserInformation,
  isCollab: true,
}

export const customerUserMock: Partial<UserInfo> = {
  ...baseUserInformation,
  isCollab: false,
}