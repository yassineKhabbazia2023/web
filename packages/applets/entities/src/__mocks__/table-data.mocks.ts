import type { WalletData } from '@entities/modules/wallet/types'

export const mockTableData: WalletData[] = [
  {
    owner: {
      contactId: 1,
      firstName: 'firstName1',
      lastName: 'lastName1',
      email: 'email1',
      initials: 'fl',
      avatarColor: 'orange',
    },
    city: 'paris',
    hub: 'Hub Aquitaine Nord',
    deploymentStatus: {
      text: 'To Deploy',
      color: 'warning',
      iconName: 'arrowUpCircle',
    },
    id: '5f85e793-57c0-4da6-b821-3b2888567256',
    accountId: 1,
    accountNumber: 'V900000547',
    name: 'NOM1',
    isFavorite: false,
    isCustomerRelation: false,
  },
  {
    owner: {
      contactId: 2,
      firstName: '',
      lastName: '',
      email: null,
      initials: '',
      avatarColor: 'orange',
    },
    city: 'hanoi',
    hub: 'Hub Aquitaine Nord',
    deploymentStatus: {
      text: 'In progress',
      color: 'warning',
      iconName: 'arrowRepeat',
    },
    id: '5f85e793-57c0-4da6-b821-3b2888567255',
    accountNumber: 'V900000546',
    accountId: 2,
    name: 'NOM2',
    isFavorite: true,
    isCustomerRelation: false,
  },
]
