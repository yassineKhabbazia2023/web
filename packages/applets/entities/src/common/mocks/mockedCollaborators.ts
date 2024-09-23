import type { Contact } from '@entities/services/contact/contactTypes'
import type { Collab } from '@entities/pages/wallet/pages/collaborators/types'

export const getMockedCollaborators = (): Contact[] => {
  return [
    {
      id: 801,
      firstName: 'FirstName578',
      lastName: 'LastName119',
      email: 'email383@example.com',
      landPhone: '123-456-7890',
      mobilePhone: '987-654-3210',
      type: 'Collaborator',
      office: 'Chalon sur Saône',
      persona: {
        id: 15,
        name: 'Assitante GS',
        description: '',
      },
      createdAt: '2024-03-26T11:18:23.9366667',
    },
    {
      id: 731,
      firstName: 'FirstName834',
      lastName: 'LastName146',
      email: 'email248@example.com',
      landPhone: '123-456-7890',
      mobilePhone: '987-654-3210',
      type: 'Collaborator',
      office: 'Besançon',
      persona: {
        id: 10,
        name: 'Collab Product',
        description: '',
      },
      createdAt: '2024-03-26T11:18:23.8733333',
    },
    {
      id: 571,
      firstName: 'FirstName562',
      lastName: 'LastName169',
      email: 'email787@example.com',
      landPhone: '123-456-7890',
      mobilePhone: '987-654-3210',
      type: 'Collaborator',
      office: 'Pontarlier',
      persona: {
        id: 15,
        name: 'Assitante GS',
        description: '',
      },
      createdAt: '2024-03-26T11:18:23.7433333',
    },
    {
      id: 841,
      firstName: 'FirstName372',
      lastName: 'LastName179',
      email: 'email40@example.com',
      landPhone: '123-456-7890',
      mobilePhone: '987-654-3210',
      type: 'Collaborator',
      office: 'Grenoble',
      persona: {
        id: 15,
        name: 'Assitante GS',
        description: '',
      },
      createdAt: '2024-03-26T11:18:23.9633333',
    },
  ]
}

export const getFormattedMockedCollaborators = (): Collab[] => {
  return [
    {
      id: 1,
      firstName: 'David',
      lastName: 'Pruitt',
      fullName: 'David Pruitt',
      email: 'davidpruitt@zanilla.com',
      landPhone: '1234567890',
      mobilePhone: '1234567890',
      ibsStatus: 'AM',
      role: 'Collaborateur ESC',
      office: 'Kenmar',
    },
    {
      id: 2,
      firstName: 'Chandler',
      lastName: 'Kerr',
      fullName: 'Chandler Kerr',
      email: 'chandlerkerr@zanilla.com',
      landPhone: '(998) 515-3805',
      mobilePhone: '(999) 402-2641',
      ibsStatus: 'AM',
      role: 'Support',
      office: 'Gilgo',
    },
    {
      id: 3,
      firstName: 'Burch',
      lastName: 'Sandoval',
      fullName: 'Burch Sandoval',
      email: 'burchsandoval@zanilla.com',
      landPhone: '(837) 441-3820',
      mobilePhone: '(862) 463-2492',
      ibsStatus: 'AM',
      role: 'Support',
      office: 'Fannett',
    },
    {
      id: 4,
      firstName: 'Dolly',
      lastName: 'Roberts',
      fullName: 'Dolly Roberts',
      email: 'dollyroberts@zanilla.com',
      landPhone: '(864) 577-3330',
      mobilePhone: '(849) 401-2953',
      ibsStatus: 'EM',
      role: 'Support',
      office: 'Herlong',
    },
  ]
}
