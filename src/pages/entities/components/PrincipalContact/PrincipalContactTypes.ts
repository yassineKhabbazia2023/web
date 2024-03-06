export interface User {
  contactId: number
  userId: number
  firstName: string
  lastName: string
  contactEmail: string
}

export type PrincipalContactProps = {
  principalContact: User
}
