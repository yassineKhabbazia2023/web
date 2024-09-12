import type { Collab } from './types'
export const mockCollabsData: Collab[] = [
  {
    globalContactId: '1',
    firstName: 'custom firstName',
    lastName: 'custom lastName',
    email: 'customEmail@kpmg.fr',
    personaName: 'collaborateur ESC',
    office: 'Paris',
    hasAccess: false,
  },
  {
    globalContactId: '2',
    firstName: 'another custom firstName',
    lastName: 'another custom lastName',
    email: 'anotherCustomEmail@kpmg.fr',
    personaName: 'Collaborateur GS',
    office: 'Paris',
    hasAccess: true,
  },
  {
    globalContactId: '3',
    firstName: 'and another custom firstName',
    lastName: 'and another custom lastName',
    email: 'andAnotherCustomEmail@kpmg.fr',
    personaName: 'Collaborateur CLP',
    office: 'Paris',
    hasAccess: true,
  },
]
