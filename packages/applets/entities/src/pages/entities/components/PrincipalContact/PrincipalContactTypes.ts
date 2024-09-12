export interface ClientContact {
  contactId: number
  globalContactId?: string
  firstName: string
  lastName: string
  email: string
  creationDate?: string
  personaName?: string
  status?: string
}

export type PrincipalContactProps = {
  principalContact: ClientContact
}
