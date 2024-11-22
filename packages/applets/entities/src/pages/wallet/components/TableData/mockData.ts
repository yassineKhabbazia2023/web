import { PIArrowUpCircle } from '@pulse/styleguide/components'
import type { WalletData } from '../../types'
import type { Entity } from '@pulse/common'

export const mockedEntity: Entity = {
  accountId: 1,
  legalName: 'Entity Test',
  accountNumber: 'IBS544G45F345F',
  color: 'orange',
}

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
      icon: PIArrowUpCircle,
      color: 'warning',
    },
    id: '5f85e793-57c0-4da6-b821-3b2888567256',
    accountId: 1,
    accountNumber: 'V900000547',
    name: 'NOM1',
    isFavorite: false,
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
      icon: PIArrowUpCircle,
      color: 'warning',
    },
    id: '5f85e793-57c0-4da6-b821-3b2888567255',
    accountNumber: 'V900000546',
    accountId: 2,
    name: 'NOM2',
    isFavorite: true,
  },
]

