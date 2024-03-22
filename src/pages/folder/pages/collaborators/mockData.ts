import type { Collab } from './types'
export const mockCollabsData: Collab[] = [
  {
    id: '2',
    firstName: 'ouassim',
    lastName: 'hayani',
    email: 'ouassim.hayani@kpmg.fr',
    roleFunction: 'collaborateur ESC',
    office: 'Paris',
    hasAccess: false,
  },
  {
    id: '3',
    firstName: 'suliman',
    lastName: 'lescot',
    email: 'suliman.lescot@kpmg.fr',
    roleFunction: 'Collaborateur GS',
    office: 'Paris',
    hasAccess: true,
  },
  {
    id: '4',
    firstName: 'Francois',
    lastName: 'SCHOTTE',
    email: 'fschotte@kpmg.fr',
    roleFunction: 'Collaborateur CLP',
    office: 'Paris',
    hasAccess: true,
  },
]
