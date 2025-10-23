import type { Collab } from '@entities/types'
export const mockCollabsData: Collab[] = [
  {
    globalContactId: '1',
    firstName: 'custom firstName',
    lastName: 'custom lastName',
    email: 'customEmail@test.fr',
    personaName: 'collaborateur ESC',
    office: 'Paris',
    hasAccess: false,
    isCustomerRelation: true,
  },
  {
    globalContactId: '2',
    firstName: 'another custom firstName',
    lastName: 'another custom lastName',
    email: 'anotherCustomEmail@test.fr',
    personaName: 'Collaborateur GS',
    office: 'Paris',
    hasAccess: true,
    isCustomerRelation: false,
  },
  {
    globalContactId: '3',
    firstName: 'and another custom firstName',
    lastName: 'and another custom lastName',
    email: 'andAnotherCustomEmail@test.fr',
    personaName: 'Collaborateur CLP',
    office: 'Paris',
    hasAccess: true,
    isCustomerRelation: false,
  },
]
