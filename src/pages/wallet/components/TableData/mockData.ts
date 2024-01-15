import { PIArrowUpCircle } from '@kpmg/styleguide'

export const mockTableData = [
  {
    owner: {
      firstName: 'firstName1',
      lastName: 'lastName1',
      email: 'email1',
      phoneNumber: '',
      initials: 'fl'
    },
    city: 'paris',
    deploymentStatus: {
      text: 'To Deploy',
      icon: PIArrowUpCircle,
      color: 'warning'
    },
    id: '5f85e793-57c0-4da6-b821-3b2888567256',
    accountNumber: 'V900000547',
    name: 'NOM1',
    isFavorite: false
  },
  {
    owner: {
      firstName: '',
      lastName: '',
      email: null,
      phoneNumber: '',
      initials: ''
    },
    city: 'hanoi',
    deploymentStatus: {
      text: 'In progress',
      icon: PIArrowUpCircle,
      color: 'warning'
    },
    id: '5f85e793-57c0-4da6-b821-3b2888567255',
    accountNumber: 'V900000546',
    name: 'NOM2',
    isFavorite: true
  }
]
