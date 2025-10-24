import type { NotificationAccount } from '../types/notification-account.type'

export const accountMock: NotificationAccount = {
  id: 1,
  name: 'Au5',
  accountNumber: '100',
}

export const accountsMock: NotificationAccount[] = [
  {
    ...accountMock,
  },
  {
    id: 2,
    name: 'Monstercat',
    accountNumber: '200',
  },
  {
    id: 3,
    name: 'Virtual Riot',
    accountNumber: '300',
  },
  {
    id: 4,
    name: 'Haywyre',
    accountNumber: '400',
  },
  {
    id: 5,
    name: 'Porter Robinson',
    accountNumber: '500',
  },
  {
    id: 6,
    name: 'KOAN Sound',
    accountNumber: '600',
  },
]

export const accountsCollection = [
  {
    id: 70006470886,
    name: 'Aperture Science',
  },
  {
    id: 70006494886,
    name: 'Boulangerie Cochet',
  },
  {
    id: 70006400886,
    name: 'Pizza Planet',
  },
  {
    id: 70005321111,
    name: 'Le Chaudron Baveur',
  },
]

export const accountsCollectionForSelectFormat = [
  {
    pValue: 70006470886,
    pLabel: 'Aperture Science (70006470886)',
  },
  {
    pValue: 70006494886,
    pLabel: 'Boulangerie Cochet (70006494886)',
  },
  {
    pValue: 70006400886,
    pLabel: 'Pizza Planet (70006400886)',
  },
  {
    pValue: 70005321111,
    pLabel: 'Le Chaudron Baveur (70005321111)',
  },
]

export const recipientsIdCollection = [70006400886, 70006494886]
