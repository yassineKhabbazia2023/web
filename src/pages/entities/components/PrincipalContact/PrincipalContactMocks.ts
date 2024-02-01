import type { User } from './PrincipalContactTypes'

export function getMockedPrincipalContact(): User {
  const principalContact: User = {
    globalUserId: '820f0c86-d7ed-46e6-bae9-11363aec8da3',
    firstName: 'Corabel',
    lastName: 'Greenall',
    email: 'test_loscos@yopmail.com'
  }

  return principalContact
}
