import type { Contact, Persona } from '@entities/services/contact/contactTypes'
export const mockUser: Contact = {
  id: 521,
  firstName: 'jojo',
  lastName: 'jojo',
  email: 'email330@example.com',
  landPhone: '123-456-7890',
  mobilePhone: '987-654-3210',
  type: 'Customer',
  office: 'Chalon sur Saône',
  persona: {
    id: 21,
    name: 'MOD Forms',
    description: '',
  } as Persona,
}
