export interface Persona {
  id: number
  name: string
}

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  landPhone?: string
  mobilePhone?: string
  type?: 'collaborateur' | 'client'
  office?: string
  persona?: Persona
}
