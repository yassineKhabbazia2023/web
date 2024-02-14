export interface User {
  contactId: number
  userId: number
  firstName: string
  lastName: string
  email: string
}

export type PrincipalContactProps = {
  principalContact: User
}
