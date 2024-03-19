import type { Contact } from './contactTypes'

export function getMockedCollaborators(): Contact[] {
  return [
    {
      id: 1,
      firstName: 'Jean-Paul',
      lastName: 'VELLUTINI',
      email: 'jvellutini@kpmg.fr',
      landPhone: '0674589002',
      mobilePhone: '0785667002',
      type: 'collaborateur',
      office: 'KPMG Paris – Liège',
      persona: {
        id: 2,
        name: 'Admin / Collab Product'
      }
    },
    {
      id: 2,
      firstName: 'Stéphanie',
      lastName: 'ORTEGA',
      email: 'sortega@kpmg.fr',
      landPhone: '0674589005',
      mobilePhone: '0785667005',
      type: 'collaborateur',
      office: 'KPMG Paris – Liège',
      persona: {
        id: 4,
        name: 'Partner GS'
      }
    },
    {
      id: 3,
      firstName: 'Philippe',
      lastName: 'MATHIS',
      email: 'pmathis@kpmg.fr',
      landPhone: '0674589011',
      mobilePhone: '0785667020',
      type: 'collaborateur',
      office: 'KPMG Paris – Liège',
      persona: {
        id: 4,
        name: 'Partner GS'
      }
    }
  ]
}
