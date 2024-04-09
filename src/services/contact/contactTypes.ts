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
  type?: 'collaborateur' | 'client'
  office?: string
  persona?: Persona
}

/* eslint-disable no-unused-vars */
export enum ContactType {
  Collaborator = 'Collaborator',
  Customer = 'Customer'
}
export interface PatchContactPayload {
  firstName?: string
  lastName?: string
  mobilePhone?: string
  landPhone?: string
}
