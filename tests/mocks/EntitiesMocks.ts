import type { IEntity } from '@/pages/wallet/types'

export const entityMock: IEntity = {
  isFavorite: false,
  name: 'Glagla land',
  accountNumber: 'a1b2',
  owner: {
    firstName: 'Jeff',
    lastName: 'Roi',
    email: 'jeff@roi.fr',
    initials: 'JF',
    avatarColor: 'purple',
  },
  id: '1',
  hub: 'ESC',
  city: 'Paris',
  deploymentStatus: 1,
}

export const entitiesMock: IEntity[] = [
  {
    isFavorite: false,
    name: 'Glagla land',
    accountNumber: 'a1b2',
    owner: {
      firstName: 'Jeff',
      lastName: 'Roi',
      email: 'jeff@roi.fr',
      initials: 'JF',
      avatarColor: 'purple',
    },
    id: '1',
    hub: 'ESC',
    city: 'Paris',
    deploymentStatus: 1,
  },
  {
    isFavorite: false,
    name: 'Vitest est pas ouf',
    accountNumber: 'b2c3',
    owner: {
      firstName: 'Jean',
      lastName: 'Bombeur',
      email: 'jean@bombeur.fr',
      initials: 'JB',
      avatarColor: 'yellow',
    },
    id: '1',
    hub: 'ESC',
    city: 'Paris',
    deploymentStatus: 1,
  },
  {
    isFavorite: false,
    name: 'Au5 Corp',
    accountNumber: 'c3d4',
    owner: {
      firstName: 'Austin',
      lastName: 'Collins',
      email: 'austin@collins.fr',
      initials: 'AC',
      avatarColor: 'purple',
    },
    id: '1',
    hub: 'ESC',
    city: 'Paris',
    deploymentStatus: 1,
  },
]
