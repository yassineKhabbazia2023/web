import { PIArrowUpCircle } from '@kpmg/styleguide'
import type { IWalletData } from '../../types'
import type { Entity } from '@kpmg/common'

export const mockedEntity: Entity = {
  idAccount: 'idAccountTest',
  name: 'Entity Test',
  ibs: 'IBS544G45F345F',
  color: 'orange',
}

export const mockTableData: IWalletData[] = [
  {
    owner: {
      firstName: 'firstName1',
      lastName: 'lastName1',
      email: 'email1',
      initials: 'fl',
      avatarColor: 'orange',
    },
    city: 'paris',
    hub: 'paris',
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
      firstName: '',
      lastName: '',
      email: null,
      initials: '',
      avatarColor: 'orange',
    },
    city: 'hanoi',
    hub: 'paris',
    deploymentStatus: {
      text: 'In progress',
      icon: PIArrowUpCircle,
      color: 'warning',
    },
    id: '5f85e793-57c0-4da6-b821-3b2888567255',
    accountNumber: 'V900000546',
    name: 'NOM2',
    isFavorite: true,
  },
]

