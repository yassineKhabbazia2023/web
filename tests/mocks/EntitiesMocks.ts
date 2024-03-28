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
