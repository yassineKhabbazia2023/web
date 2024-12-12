import type { Contact, Persona } from './contactTypes'

export function getMockedCollaborators(): Contact[] {
  return [
    {
      id: 1,
      firstName: 'Jean-Paul',
      lastName: 'VELLUTINI',
      email: 'jvellutini@rydge.fr',
      landPhone: '0674589002',
      mobilePhone: '0785667002',
      type: 'Collaborator',
      office: 'Rydge Paris – Liège',
      persona: {
        id: 2,
        name: 'Admin / Collab Product',
        description: '',
      } as Persona,
    },
    {
      id: 2,
      firstName: 'Stéphanie',
      lastName: 'ORTEGA',
      email: 'sortega@rydge.fr',
      landPhone: '0674589005',
      mobilePhone: '0785667005',
      type: 'Collaborator',
      office: 'Rydge Paris – Liège',
      persona: {
        id: 4,
        name: 'Partner GS',
        description: '',
      } as Persona,
    },
    {
      id: 3,
      firstName: 'Philippe',
      lastName: 'MATHIS',
      email: 'pmathis@rydge.fr',
      landPhone: '0674589011',
      mobilePhone: '0785667020',
      type: 'Collaborator',
      office: 'Rydge Paris – Liège',
      persona: {
        id: 4,
        name: 'Partner GS',
        description: '',
      } as Persona,
    },
  ]
}
export function getMockedCustomer(): Contact[] {
  return [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'yve',
      email: 'yve@gmail.fr',
      landPhone: '0674589003',
      mobilePhone: '0785667003',
      type: 'Customer',
      office: undefined,
      persona: {
        id: 2,
        name: 'Dirigeant',
        description: '',
      } as Persona,
    },
    {
      id: 2,
      firstName: 'Bernard',
      lastName: 'yve',
      email: 'bernard@gmail.fr',
      landPhone: '0674589003',
      mobilePhone: '0785667003',
      type: 'Customer',
      office: undefined,
      persona: {
        id: 2,
        name: 'Comptable',
        description: '',
      } as Persona,
    },
  ]
}
