 
export enum ContactType {
  Collaborator = 'Collaborator',
  Customer = 'Customer'
}
 

export interface Persona {
  id: number
  name: string
  description: string
}

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  landPhone?: string
  mobilePhone: string
  type?: 'Collaborator' | 'Customer'
  office?: string
  persona?: Persona
  createdAt?: string
}

export interface PatchContactPayload {
  firstName?: string
  lastName?: string
  mobilePhone?: string
  landPhone?: string
}
