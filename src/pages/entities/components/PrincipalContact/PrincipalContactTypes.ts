export interface User {
  globalUserId: string
  firstName: string
  lastName: string
  email: string
}

export type PrincipalContactProps = {
  principalContact: User
}
